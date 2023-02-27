import { getParameter, format_number, format_token } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Boton exportar grilla
document.getElementById("btn_export").onclick = () => redirectExport()
document.getElementById("btn_export_1024").onclick = () => redirectExport()
const redirectExport = () => {
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
            width: 85,
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
            field: "observacion",
            tooltipField: 'observacion',
            minWidth: 60,
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if ( String(params.value) == "null" )
                    return ""
                else
                    return params.value
            }
        },
        {
            width: 30,
            field: "linkAdjuntos",
            headerName: "",
            cellRenderer: function(params) {
                if ( String(params.value) == "null")
                    return ""
                else
                    if ( params.data.id === 0 )
                        return ''
                    else
                        return '<a href="" onclick="window.open(\'' + format_token(params.value) + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-solid fa-folder-closed"></i></a>'
            }
        },
        {
            width: 30, 
            field: "linkAsignaciones",
            headerName: "",
            cellRenderer: function(params) {
                if ( String(params.value) == "null" )
                    return ""
                else
                    if( params.data.id === 0 )
                        return ''
                    else
                        return '<a href="" onclick="window.open(\'' + format_token(params.value) + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-regular fa-folder-open"></i></a>'
            }
        },
        {
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "importeDebe",
            headerName: 'Debe',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if ( String(params.value) == "null" )
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "importeHaber",
            headerName: 'Haber',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if ( String(params.value) == "null" )
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "saldo",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if ( String(params.value) == "null" )
                    return ""
                else
                    return format_number(params.value)
            }
        },
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
        $("#myGrid").height(parseInt($(window).height()) - 320)
})

function generatePinnedBottomData () {
    // generate a row-data with null values
    let result = {}
    gridOptions.api.columnModel.gridColumns.forEach(item => {
        result[item.colId] = null
    })
    return calculatePinnedBottomData(result)
}

function calculatePinnedBottomData(target) {
    // console.log(target)
    //**list of columns fo aggregation**
    let columnsWithAggregation = ['importeDebe', 'importeHaber']
    columnsWithAggregation.forEach(element => {
        //console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {
            if (rowNode.data[element]) {
                target[element] += Number(rowNode.data[element].toFixed(2))
            }
        })
        if (target[element]) {
            target[element] = `${target[element].toFixed(2)}`
        } else {
            target[element] = '0.00'
        }
    })

    let columnsWithAggregationBalance = ['saldo']
    columnsWithAggregationBalance.forEach(element => {
        // console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {
            if (rowNode.data[element]) {
                target[element] = Number(rowNode.data[element].toFixed(2))
            }
            target[element] = rowNode.data.saldo || '0.00'
        })
    })
    return target
}

const get_accountSummary = (tkn, data) => {
    // Mostrar Loader Grid
    gridOptions.api?.showLoadingOverlay()
    const url_getAccountSummary = process.env.Solu_externo + '/reportes/clientes/get_resumen_cuenta_cliente'
    fetch( url_getAccountSummary , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( resp => {
        // console.log(resp)
        let saldo = 0
        resp.map( resp => {
            const { importeDebe, importeHaber } = resp
            saldo += importeDebe - importeHaber
            resp.saldo = saldo
            return resp
        })

        // Clear Filtros
        gridOptions.api.setFilterModel(null)
        // Clear Grilla
        gridOptions.api.setRowData([])
        gridOptions.api.applyTransaction({
            add: resp
        })
        
        let pinnedBottomData = generatePinnedBottomData()
        gridOptions.api.setPinnedBottomRowData([pinnedBottomData])
        
        gridOptions.api.hideOverlay()
        document.getElementById('btn_print').disabled = false
        document.getElementById('btn_print_1024').disabled = false
        
        if ( Object.keys( resp ).length === 0 ) {
            // console.log( 'Is empty')
            gridOptions.api.setPinnedBottomRowData([])
            gridOptions.api.showNoRowsOverlay()
            document.getElementById('btn_print').disabled = true
            document.getElementById('btn_print_1024').disabled = true
        }
    })
    .catch( err => {
        console.log( err )
        document.getElementById('btn_print').disabled = true
        document.getElementById('btn_print_1024').disabled = true
    })
}

// Boton actualizar
const tkn = getParameter('tkn')
const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const unidadNegocio = Number(formData.get('business'))
    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const sucursal = Number(formData.get('subsidiary'))
    const cuentaEstado = formData.get('status')
    const codigoCliente = formData.get('customer')
    const cobrador = formData.get('debt-collector')
    const moneda = formData.get('coin')
    const soloMovimientos  = formData.get('only-movements') === 'on'    ? 1 : 0
    const incluirProformas = formData.get('include-proformas') === 'on' ? 1 : 0
    const incluirRemitos   = formData.get('include-notes') === 'on'     ? 1 : 0

    const data = {
        unidadNegocio,
        fechaDesde,
        fechaHasta,
        sucursal,
        cuentaEstado,
        codigoCliente,
        cobrador,
        moneda,
        soloMovimientos,
        incluirProformas,
        incluirRemitos
    }
    // console.table( data )
    get_accountSummary( tkn, data )
})

// Boton Imprimir
document.getElementById("btn_print").onclick = () => redirectPrint()
document.getElementById("btn_print_1024").onclick = () => redirectPrint()
const redirectPrint = () => {
    const unidadNegocio = Number(document.getElementById('business').value)
    const fechaDesde = (document.getElementById('periodStart').value).split('-').reverse().join('/')
    const fechaHasta = (document.getElementById('periodEnd').value).split('-').reverse().join('/')
    const sucursal = Number(document.getElementById('subsidiary').value)
    const cuentaEstado = document.getElementById('status').value
    const codigoCliente = document.getElementById('customer').value
    const cobrador = document.getElementById('debt-collector').value
    const moneda = document.getElementById('coin').value
    const soloMovimientos  = document.getElementById('only-movements').value    === 'on' ? 1 : 0
    const incluirProformas = document.getElementById('include-proformas').value === 'on' ? 1 : 0
    const incluirRemitos   = document.getElementById('include-notes').value     === 'on' ? 1 : 0

    const data = {
        unidadNegocio,
        fechaDesde,
        fechaHasta,
        sucursal,
        cuentaEstado,
        codigoCliente,
        cobrador,
        moneda,
        soloMovimientos,
        incluirProformas,
        incluirRemitos
    }
    // console.table( data )
    let returnURL = process.env.VarURL + '/Clientes/VerResumen.html?'
    // console.log(returnURL)
    for (const property in data) {
        returnURL += `${property}=${data[property]}&`
    }
    const fullURL = returnURL + 'tkn=' + tkn
    setTimeout(() => window.open(fullURL, '_blank', 'toolbar=0,location=0,menubar=0'), 1000)
}

const name = getParameter('nombre')
const codigoCliente= getParameter('codigoCliente')
const cuit = getParameter('cuit')
const unidadNegocio = getParameter('unidadNegocio')
const estado = getParameter('estado')
if (tkn && name && codigoCliente && cuit && unidadNegocio && estado) {
    document.getElementById('getBackToPreviousPage').classList.remove('d-none')
    const fechaDesde = (document.getElementById('periodStart').value).split('-').reverse().join('/')
    const fechaHasta = (document.getElementById('periodEnd').value).split('-').reverse().join('/')

    const data = {
        unidadNegocio,
        fechaDesde,
        fechaHasta,
        sucursal: "0",
        cuentaEstado: estado,
        codigoCliente,
        cobrador: "0",
        moneda: "1",
        soloMovimientos: 0,
        incluirProformas: 0,
        incluirRemitos: 0
    }
    // console.table(data)
    get_accountSummary(tkn, data)
}