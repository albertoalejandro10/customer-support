import { getParameter, format_number } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, filterChangedd } from "../../jsgen/Grid-Helper"

function getParams() {
    return {
      allColumns: true,
    }
}

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
        wrapHeaderText: true,
        autoHeaderHeight: true,
        allColumns: true
        //minWidth: 100,
    },
    // Tooltip Delayer (1seg)
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
            width: 120,
            headerName: "CUIT",
            field: "cuit",
            tooltipField: 'cuit',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    if (params.value == 'Saldo Inicial')
                        return params.value
                    else
                        return `<a href='${process.env.VarURL}/Clientes/ResumenClientes.html?nombre=${(params.data.nombre).trim().replaceAll(' ', '+')}&codigoCliente=${(params.data.codigoCliente).trim()}&cuit=${(params.data.cuit).trim()}&unidadNegocio=${params.data.unidadNegocio}&estado=${params.data.estado}&cobrador=${params.data.cobrador}&tkn=${getParameter('tkn')}' target="_self"> ${params.value} </a>`
            }
        },
        {
            flex: 1,
            minWidth: 100,
            headerName: "Cliente",
            field: "nombre",
            tooltipField: 'nombre',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return "Totales"
                else
                    return params.value
            }
        },
        {
            width: 100,
            field: "telefono",
            tooltipField: 'telefono',
            hide: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ''
                else
                    return params.value
            }
        },
        {
            width: 80,
            headerClass: "text-center",
            cellClass: 'cell-vertical-align-center',
            headerName: "Promedio Días Cobros",
            field: "promoDiasCobros",
            tooltipField: 'promoDiasCobros',
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ''
                else
                    return params.value
            }
        },
        {
            width: 80,
            headerClass: "text-center",
            cellClass: 'cell-vertical-align-center',
            headerName: "Promedio Días Valores",
            field: "promoDiasValores",
            tooltipField: 'promoDiasValores',           
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ''
                else
                    return params.value
            }
        },
        {
            minWidth: 90,
            maxWidth: 100,
            headerClass: "text-center",
            cellClass: 'cell-vertical-align-center',
            headerName: "Última venta",
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
            flex: 1,
            minWidth: 90,
            maxWidth: 120,
            headerClass: "text-center",
            cellClass: 'cell-vertical-align-center',
            headerName: "Último Credito",
            field: "ultCredito",
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
            flex: 1,
            minWidth: 60,
            maxWidth: 100,
            headerClass: "text-center", 
            cellClass: 'cell-vertical-align-text-right',
            headerName: "Créditos Cheques",
            field: "creditoCheches",
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ''
                else
                    return format_number(params.value)
            }
        },
        {
            width: 80,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            headerName: "Crédito",
            field: "credito", 
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
            headerName: "Saldo Vencido",
            field: "vencido",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (params.value === 0 || typeof params.value === 'string')
                    return format_number(params.value)
                else
                    return `<span class="ag-red">${format_number(params.value)}</span>`
            }
        },
        {
            width: 100,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            headerName: "Saldo Final",
            field: "pendienteTotal",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (typeof params.value === 'string')
                    return format_number(params.value)
                else
                    return `<a href='${process.env.VarURL}/PendientesClientes/pendientesclientes.html?nombre=${(params.data.nombre).trim().replaceAll(' ', '+')}&codigoCliente=${(params.data.codigoCliente).trim()}&cuit=${(params.data.cuit).trim()}&unidadNegocio=${params.data.unidadNegocio}&estado=${params.data.estado}&tkn=${getParameter('tkn')}' target="_self"> ${format_number(params.value)} </a>`
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
        $("#myGrid").height(parseInt($(window).height()) - 290)
})

function generatePinnedBottomData () {
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
    let columnsWithAggregation = ['vencido', 'pendienteTotal']
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

const get_AccountsBalance = (tkn, data) => {
    // Mostrar Grid Loader
    gridOptions.api?.showLoadingOverlay()
    const url_getAccountsBalance = process.env.Solu_externo + '/reportes/clientes/get_saldo_cuentas_por_cobrar'
    fetch( url_getAccountsBalance , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( ({ linea }) => {
        // console.log(linea)
        const { unidadNegocio, estado, cobrador } = data
        linea.map(element => {            
            element.unidadNegocio = unidadNegocio
            element.estado = estado
            element.cobrador = cobrador
        })
        
        // Clear Filtros
        gridOptions.api.setFilterModel(null)
        // Clear Grilla
        gridOptions.api.setRowData([])
        gridOptions.api.applyTransaction({
            add: linea
        })
        
        let pinnedBottomData = generatePinnedBottomData()
        gridOptions.api.setPinnedBottomRowData([pinnedBottomData])

        if ( Object.keys( linea ).length === 0 ) {
            // console.log('Is empty')
            gridOptions.api.setPinnedBottomRowData([])
            gridOptions.api.showNoRowsOverlay()
        }
    })
    .catch( err => {
        console.log( err )
    })
}

const tkn = getParameter('tkn')
const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const unidadNegocio = Number(formData.get('business'))
    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const tipoCliente = Number(formData.get('customer-type'))
    const grupoCliente = Number(formData.get('customer-groups'))
    const estado = formData.get('status')
    const cobrador = Number(formData.get('debt-collector'))
    const saldoCero = (formData.get('exclude-balances') === 'on') ? 1 : 0

    const data = {
        unidadNegocio,
        fechaDesde,
        fechaHasta,
        tipoCliente,
        grupoCliente,
        estado, 
        cobrador,
        saldoCero
    }
    window.top.SCC = data
    // console.log(window.top.SCC)
    // console.table( data )
    get_AccountsBalance( tkn, data )
})

// Rellenar filtros si viene window.top.scc
const existsSCC = async () => {
    const scc = new Promise(() => {
        setTimeout(() => {
            const { cobrador, estado, fechaDesde, fechaHasta, grupoCliente, saldoCero, tipoCliente, unidadNegocio } = window.top.SCC
            // console.log(cobrador, estado, fechaDesde, fechaHasta, grupoCliente, saldoCero, tipoCliente, unidadNegocio)
            document.getElementById('business').value = unidadNegocio
            document.getElementById('periodStart').value = fechaDesde.split('/').reverse().join('-')
            document.getElementById('periodEnd').value = fechaHasta.split('/').reverse().join('-')
            document.getElementById('customer-type').value = tipoCliente
            document.getElementById('customer-groups').value = grupoCliente
            document.getElementById('status').value = estado
            document.getElementById('debt-collector').value = cobrador
            
            let saldoCeroElement = document.getElementById('exclude-balances')
            if ( saldoCero === 1 ) {
                saldoCeroElement.checked = true
            } else {
                saldoCeroElement.checked = false
            }
        }, 1000)
        get_AccountsBalance( tkn, window.top.SCC )
    })
    await scc
}

// Verificar si existe window.top.scc y ejecutar la funcion
if ( window.top.SCC ) {
    existsSCC()
}