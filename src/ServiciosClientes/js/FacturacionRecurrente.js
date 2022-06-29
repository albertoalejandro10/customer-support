import { getParameter, format_number } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Boton exportar grilla
const btn_export = document.getElementById("btn_export")
btn_export.onclick = function() {
    gridOptions.api.exportDataAsCsv(getParams())
}

const localeText = ag_grid_locale_es

const gridOptions = {
    headerHeight: 35,
    rowHeight: 30,
    defaultColDef: {
        editable: false,
        resizable: true,  
        suppressNavigable: true, 
        //minWidth: 100,                      
    },
    onFilterChanged: event => filterChangedd(event),
    suppressExcelExport: true,
    popupParent: document.body,
    localeText: localeText,

    columnDefs: [
        {
            width: 85,
            headerName: "Fecha",
            field: "fecha",
            sortable: true,
            filter: true,
            filter: 'agDateColumnFilter',                    
            comparator: dateComparator,
            filterParams: {
                // provide comparator function
                comparator: comparafecha
            }   
        },
        {
            width: 145, 
            field: "comprobante", 
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)== "null")
                    return "<b>Totales</b>"
                else
                    if (params.value=='Saldo Inicial')
                        return params.value
                    else
                        return '<a href="" onclick="window.open(\'' + params.data.linkComprobante + '\', \'newwindow\', \'width=800,height=800\');return false;" target="_blank">'+ params.value +'</a>'
            }
        },
        { 
            flex: 1, headerName: "Cliente",
            field: "nombre",
            sortable: true,
            filter: true ,
            cellRenderer: function(params) {
                if (String(params.data)=="null")
                    return ''
                else
                    return params.data.cliente
            }
        },
        {
            width: 100, 
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            field: "neto", 
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {
            width: 100, 
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            field: "iva", 
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {
            width: 100, 
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            field: "total",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return format_number(params.value)
            }
        }
    ],
    rowData: [],
}

document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid')
    new agGrid.Grid(gridDiv, gridOptions)

    if ((parseInt($(window).height()) - 300) < 200) {
        $("#myGrid").height(100)
    } else {
        $("#myGrid").height(parseInt($(window).height()) - 500)
    }
})

function generatePinnedBottomData(){
    // generate a row-data with null values
    let result = {}

    gridOptions.api.columnModel.gridColumns.forEach(item => {
        result[item.colId] = null
    })
    return calculatePinnedBottomData(result)
}

function calculatePinnedBottomData(target){
    // console.log(target)
    //**list of columns fo aggregation**

    let columnsWithAggregation = ['neto', 'iva', 'total']
    columnsWithAggregation.forEach(element => {
        //console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {                  
            if (rowNode.data[element])
                target[element] += Number(rowNode.data[element].toFixed(2))
        })
        if (target[element])
            target[element] = `${target[element].toFixed(2)}`
    })
    //console.log(target)
    return target
}

const get_recurringBilling = tkn => {
    const url_getRecurringBilling = 'https://www.solucioneserp.net/maestros/generacion_lotes/get_ultima_liquidacion_cupones'
    fetch( url_getRecurringBilling , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ({comprobantes}) => {

        comprobantes.map( element => {
            element.neto = Number(element.neto)
            element.iva = Number(element.iva)
            element.total = Number(element.total)
            return element
        })

        // clear Filtros
        gridOptions.api.setFilterModel(null)

        // Clear Grilla
        gridOptions.api.setRowData([])

        gridOptions.api.applyTransaction({
            add: comprobantes
          })
        
        let pinnedBottomData = generatePinnedBottomData()
        gridOptions.api.setPinnedBottomRowData([pinnedBottomData])      

    })
    .catch( err => {
        console.log( err )
    })
}

// Obtener el valor de la opcion seleccionada por el usuario
const selectTypeGroup = document.getElementById('group-client')
selectTypeGroup.addEventListener('change', event => {
    if ( event.currentTarget.options[selectTypeGroup.selectedIndex].value === "1" ) return visibleInput('clientCode')
    if ( event.currentTarget.options[selectTypeGroup.selectedIndex].value === "2" ) return visibleInput('generatedFor')
})

// Remover clase d-none de precio neto y % descuento.
const clientCode = document.getElementById('divClientCode')
const customerCode = document.getElementById('client-code')
const generatedFor = document.getElementById('generated-for')
const visibleInput = type => {
    if ( type === 'clientCode') {
        generatedFor.classList.add('d-none')
        clientCode.classList.add('d-inline')
        clientCode.classList.remove('d-none')
        generatedFor.required = false
    }
    
    if ( type === 'generatedFor') {
        clientCode.classList.add('d-none')
        clientCode.classList.remove('d-inline')
        generatedFor.classList.remove('d-none')
        customerCode.value = ''
    }
}

// Listado de tipos de cargo por reconexion
const get_lastSettlement = tkn => {
    const url_getLastSettlement = 'https://www.solucioneserp.net/maestros/generacion_lotes/get_ultima_liquidacion_cupones'
    fetch( url_getLastSettlement, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ({ liquidacion, recargo, comprobantes, reconexion }) => {
        // console.log( liquidacion, recargo, comprobantes, reconexion )
        // console.log(comprobantes)
        const lotNumber = document.getElementById('numero')
        lotNumber.value = liquidacion.numero
        const observation = document.getElementById('observation')
        observation.value = liquidacion.observacion

        const interesVenc2Element = document.getElementById('interesVenc2')
        interesVenc2Element.value = liquidacion.interesVenc2
        const interesVenc3Element = document.getElementById('interesVenc3')
        interesVenc3Element.value = liquidacion.interesVenc3

        if ( recargo.detalle ) {
            // console.log( 'Recargo seccion:', recargo.detalle )
            document.getElementById('reconnection-section').classList.remove('d-none')
            const reconectionChargesTextElement = document.getElementById('reconection-charges-text')
            reconectionChargesTextElement.innerText = `${recargo.detalle} ${format_number(recargo.precio)}`
        }

        if ( reconexion.detalle ) {
            // console.log( 'Reconexion seccion:', reconexion.detalle )
            document.getElementById('surchage-section').classList.remove('d-none')
            const calculateChargesTextElement = document.getElementById('calculate-charges-text')
            calculateChargesTextElement.innerText = `${reconexion.detalle} ${format_number(reconexion.precio)}`
        }

        if ( liquidacion.confirmada === -1 ) return
        if ( liquidacion.confirmada === 0 ) {
            const generateReceipts = document.getElementById('generate-receipts')
            generateReceipts.classList.remove('d-none')

            const generate = document.getElementById('generate')
            const regenerateButtons = document.getElementById('regenerate-buttons')

            generate.classList.add('d-none')
            regenerateButtons.classList.remove('d-none')

            const cantReceipts = document.getElementById('number-receipts')
            const totalReceipts = document.getElementById('total-receipts')
            cantReceipts.innerText = liquidacion.cantComprobantes
            totalReceipts.innerText = `$${format_number(liquidacion.totalComprobantes)}`

            get_recurringBilling( tkn )
        }
    })
    .catch( err => {
        console.log( err )
    })
}

const tkn = getParameter('tkn')
if ( tkn ) {
    get_lastSettlement( tkn )
}

const post_GenerateButton = (tkn, data) => {
    const url_GenerateButton = 'https://www.solucioneserp.net/maestros/generacion_lotes/generar_lote'
    fetch( url_GenerateButton , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ({ resultado, mensaje}) => {
        // console.log(resultado, mensaje)
        alert(mensaje)
        const generate = document.getElementById('generate')
        const regenerateButtons = document.getElementById('regenerate-buttons')

        generate.classList.add('d-none')
        regenerateButtons.classList.remove('d-none')
        get_lastSettlement( tkn )
    })
    .catch( err => {
        console.log( err )
    })
}

const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const numero = Number(formData.get('numero'))
    const codigoCliente = (formData.get('client-code') === null) ? '' : formData.get('client-code')
    const grupoClienteId = Number(formData.get('generated-for'))
    const tipoClienteId = Number(formData.get('customer-type'))
    const tipoComprobante = Number(formData.get('voucher-type'))
    const tipoCalculaRecargo = Number(formData.get('calculate-charges'))
    const tipoCargoReconexion = Number(formData.get('reconection-charges'))
    const vencimiento1 = formData.get('expiration').split('-').reverse().join('/')
    const vencimiento2 = formData.get('expiration').split('-').reverse().join('/')
    const vencimiento3 = formData.get('expiration').split('-').reverse().join('/')
    const interesVenc2 = Number(formData.get('interesVenc2'))
    const interesVenc3 = Number(formData.get('interesVenc3'))
    const observacion = formData.get('observation')

    const data = {
        numero,
        codigoCliente,
        grupoClienteId,
        tipoClienteId,
        tipoComprobante,
        tipoCalculaRecargo,
        tipoCargoReconexion,
        vencimiento1,
        vencimiento2,
        vencimiento3,
        interesVenc2,
        interesVenc3,
        observacion
    }
    // console.table( data )
    const tkn = getParameter('tkn')
    post_GenerateButton( tkn, data )
})

const post_ConfirmButton = (tkn, data) => {
    const url_ConfirmButton = 'https://www.solucioneserp.net/maestros/generacion_lotes/confirmar_lote'
    fetch( url_ConfirmButton , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ({ resultado, mensaje}) => {
        // console.log(resultado, mensaje)
        alert(mensaje)
        location.reload()
    })
    .catch( err => {
        console.log( err )
    })
}

document.getElementById("confirm").addEventListener("click", () => {
    const numero = Number(document.getElementById('numero').value)
    const data = {
        numero
    }
    // console.log( data )
    const tkn = getParameter('tkn')
    post_ConfirmButton( tkn, data )
})