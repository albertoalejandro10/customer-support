import { getParameter, format_number, format_token } from "../../jsgen/Helper"
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
            width: 145,
            field: "comprobante",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if ( String(params.value) == "null" )
                    return "<b>Saldo Final</b>"
                else
                    return params.value
            }
        },
        {
            flex: 1,
            field: "observacion",
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
            field: "linkComprobante",
            headerName: "",
            cellRenderer: function(params) {
                if ( String(params.value) == "null")
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + format_token(params.value) + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-solid fa-folder-closed"></i></a>'
            }
        },
        {
            width: 30, 
            field: "linkAsiento",
            headerName: "",
            cellRenderer: function(params) {
                if ( String(params.value) == "null" )
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + params.value + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-regular fa-folder-open"></i></a>'
            }
        },
        {
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
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
            cellClass: 'ag-right-aligned-cell',
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
            cellClass: 'ag-right-aligned-cell',
            field: "importeNeto",
            headerName: 'Saldo',
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
}

document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid')
    new agGrid.Grid(gridDiv, gridOptions)

    if ((parseInt($(window).height()) - 300) < 200)
        $("#myGrid").height(100)
    else
        $("#myGrid").height(parseInt($(window).height()) - 360)
})

function generatePinnedBottomData () {
    // generate a row-data with null values
    let result = {}

    gridOptions.api.columnModel.gridColumns.forEach(item => {
        result[item.colId] = null
    })
    return calculatePinnedBottomData(result)
}

function calculatePinnedBottomData (target){
    // console.log(target)
    //**list of columns fo aggregation**

    let columnsWithAggregation = ['importeDebe', 'importeHaber', 'importeNeto']
    columnsWithAggregation.forEach(element => {
        //console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {                  
            if (rowNode.data[element])
                target[element] += Number(rowNode.data[element].toFixed(2))
        })
        if (target[element])
            target[element] = `${target[element].toFixed(2)}`            

    })
    // console.log(target)
    return target
}

const get_accountSummary = (tkn, data) => {
    gridOptions.api.showLoadingOverlay()

    const url_getAccountSummary = 'https://www.solucioneserp.net/reportes/clientes/get_resumen_cuenta_cliente'
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
        // console.log( resp )
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
        
        if ( Object.keys( resp ).length === 0 ) {
            console.log( 'Is empty')
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

    const unidadNegocio = Number(formData.get('business'))
    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const sucursal = Number(formData.get('subsidiary'))
    const cuentaEstado = formData.get('status')
    const codigoCliente = formData.get('customer')
    const cobrador = formData.get('debt-collector')
    const moneda = formData.get('coin')
    const soloMovimientos  = (formData.get('only-movements') === 'on')    ? 1 : 0
    const incluirProformas = (formData.get('include-proformas') === 'on') ? 1 : 0
    const incluirRemitos   = (formData.get('include-notes') === 'on')     ? 1 : 0

    const usuarioOnline = '801987735'
    const empresa = 'test'

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
        incluirRemitos,
        usuarioOnline,
        empresa
    }
    // console.table( data )
    const tkn = getParameter('tkn')
    get_accountSummary( tkn, data )
})