import { getParameter, format_number, format_token, numbersOnly } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Boton exportar grilla
const btn_export = document.getElementById("btn_export")
btn_export.onclick = function() {
    gridOptions.api.exportDataAsCsv(getParams())
}

const localeText = ag_grid_locale_es
const gridOptions = {
    headerHeight: 28,
    rowHeight: 24,
    defaultColDef: {
        editable: false,
        resizable: true,  
        suppressNavigable: true, 
        //minWidth: 100,
    },
    // Tooltip delayer (1seg)
    tooltipShowDelay: 1000,
    // No rows and grid loader
    overlayLoadingTemplate:
    '<div class="loadingx" style="margin: 7em"></div>',
    overlayNoRowsTemplate:
    '<span class="no-rows"> No hay información </span>',

    onFilterChanged: event => filterChangedd(event),
    suppressExcelExport: true,
    popupParent: document.body,
    localeText: localeText,

    columnDefs: [
        {
            width: 75,
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
            width: 155,
            field: "comprobante",
            tooltipField: 'comprobante',
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return "Totales"
                else
                    if (params.value == 'Saldo Inicial')
                        return params.value
                    else
                        return '<a href="" onclick="window.open(\'' + format_token(params.data.linkComprobante) + '\', \'newwindow\', \'width=800,height=800\');return false;" target="_blank">'+ params.value +'</a>'
            }
        },
        { 
            flex: 1,
            minWidth: 110,
            headerName: "Cliente",
            field: "cliente",
            tooltipField: 'cliente',
            sortable: true,
            filter: true ,
            cellRenderer: function(params) {
                if (String(params.data) == "null")
                    return ''
                else
                    return params.value
            }
        },
        {
            width: 30,
            headerName: "",
            field: "linkAsiento",
            cellClass: 'cell-vertical-align-center',
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + params.value + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-solid fa-file-lines"></i></a>'
            }
        },
        {   
            width: 30, 
            headerName: "", 
            field: "linkAdjuntos",
            cellClass: 'cell-vertical-align-center',
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + params.value + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-regular fa-folder-open"></i></a>'
                }
        },
        {   
            width: 30, 
            headerName: "", 
            field: "linkCambioEstado",
            cellClass: 'cell-vertical-align-center',
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + params.value + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-solid fa-arrows-spin"></i></a>'
            }
        },
        {
            width: 80,
            field: "Ejercicio",
            headerClass: "ag-center-aligned-header", 
            tooltipField: 'Ejercicio',
            cellRenderer: function(params) {
                if (String(params.data) == "null")
                    return ''
                else
                    return params.value
            }
        },
        {
            width: 100,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            field: "neto", 
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {
            width: 90, 
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "iva",
            headerName: "IVA",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "noGravado",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {
            width: 100,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            field: "importe",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return format_number(params.value)
            }
        }
    ],
    rowData: [],
    getRowStyle: (params) => {
        if (params.node.rowPinned) {
          return { 'font-weight': 'bold' }
        }
    },
}

document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid')
    new agGrid.Grid(gridDiv, gridOptions)

    if ((parseInt($(window).height()) - 300) < 200)
        $("#myGrid").height(100)
    else
        $("#myGrid").height(parseInt($(window).height()) - 300)
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
    //console.log(target)
    //**list of columns fo aggregation**
    let columnsWithAggregation = ['neto', 'iva', 'noGravado', 'importe']
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

const get_salesDocs = (tkn, data) => {
    gridOptions.api.showLoadingOverlay()
    const url_getPendingCharges = process.env.Solu_externo + '/reportes/consultas/get_documentos_ventas'
    fetch( url_getPendingCharges , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( ({ linea }) => {
        // console.log( linea )
        // Clear Filtros
        gridOptions.api.setFilterModel(null)
        // Clear Grilla
        gridOptions.api.setRowData([])
        gridOptions.api.applyTransaction({
            add: linea
        })
        
        let pinnedBottomData = generatePinnedBottomData()
        gridOptions.api.setPinnedBottomRowData([pinnedBottomData])
        gridOptions.api.hideOverlay()
        
        if ( Object.keys( linea ).length === 0 ) {
            // console.log( 'Is empty')
            gridOptions.api.setPinnedBottomRowData([])
            gridOptions.api.showNoRowsOverlay()
        }
    })
    .catch( err => {
        console.log( err )
    })
}

const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const comprobante   = Number(formData.get('voucher'))
    const fechaDesde    = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta    = formData.get('periodEnd').split('-').reverse().join('/')
    const cliente       = formData.get('cuit')
    const unidadNegocio = Number(formData.get('business'))
    const grupoCliente  = Number(formData.get('customer-groups'))

    // Uso de operador ternario
    const nroDocumento = (formData.get('number-docs')  === '') ? '' : Number(formData.get('number-docs'))
    const nroAsiento   = (formData.get('number-seats') === '') ? '' : Number(formData.get('number-seats'))
    const ptoVta       = (formData.get('sale-point')   === '') ? '0000' : formData.get('sale-point')
    const letra        = (formData.get('letter')       === '') ? '' : formData.get('letter')

    const data = {
        comprobante,
        fechaDesde,
        fechaHasta,
        nroDocumento,
        nroAsiento,
        cliente,
        ptoVta,
        letra,
        unidadNegocio,
        grupoCliente
    }

    // console.table( data )
    const tkn = getParameter('tkn')
    get_salesDocs( tkn, data )
})

const numberDocsElement = document.getElementById('number-docs')
numberDocsElement.addEventListener('keyup', () => {
    numberDocsElement.value = numbersOnly(numberDocsElement.value)
})

const numberSeatsElement = document.getElementById('number-seats')
numberSeatsElement.addEventListener('keyup', () => {
    numberSeatsElement.value = numbersOnly(numberSeatsElement.value)
})

const salePointElement = document.getElementById('sale-point')
salePointElement.addEventListener('keyup', () => {
    salePointElement.value = numbersOnly(salePointElement.value)
})