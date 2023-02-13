import { getParameter, format_number, format_token } from "../../jsgen/Helper"
import { ag_grid_locale_es, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

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
            width: 100,
            headerName: 'CUIT',
            field: "cuit",
            tooltipField: 'cuit',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if ( String(params.value) === "null")
                    return ""
                else
                    return `<a href='${format_token(params.data.linkResumenSaldoProveedor)}' target="_self"> ${params.value} </a>`
            }
        },
        {
            flex: 1,
            minWidth: 200,
            headerName: 'Proveedor',
            field: "nombre",
            tooltipField: 'nombre',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) === "null")
                    return "Total"
                else
                    return params.value
            }
        },
        {
            width: 110,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "pendiente",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                return format_number(params.value)
            }
        },
        {
            width: 110,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "total",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if ( typeof params.value === 'string' )
                    return format_number(params.value)
                else
                    return `<a href='${format_token(params.data.linkCompPendienteProveedor)}' target="_self"> ${format_number(params.value)} </a>`
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
        $("#myGrid").height(parseInt($(window).height()) - 230)
})

function generatePinnedBottomData () {
    // generate a row-data with null values
    let result = {}
    gridOptions.api.columnModel.gridColumns.forEach(item => {
        result[item.colId] = null
    })
    return calculatePinnedBottomData(result)
}

function calculatePinnedBottomData (target) {
    //console.log(target)
    // **list of columns fo aggregation**
    let columnsWithAggregation = ['pendiente', 'total']
    columnsWithAggregation.forEach(element => {
        //console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {                  
            if (rowNode.data[element]) {
                target[element] += Number(rowNode.data[element].toFixed(2))
            }
        })
        if (target[element]) {
            target[element] = `${target[element].toFixed(2)}`
        }
    })
    //console.log(target)
    return target
}

const get_accountsPayableBalance = (tkn, data) => {
    gridOptions.api.showLoadingOverlay()
    const url_getAccountsPayableBalance = 'https://www.solucioneserp.net/reportes/proveedores/get_saldo_cuentas_por_pagar'
    fetch( url_getAccountsPayableBalance , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( accounts => accounts.json() )
    .then( accounts => {
        // console.log(accounts)
        accounts.map( account => {
            account.pendiente = Number(account.pendiente)
            account.total = Number(account.total)
        })

        // Clear Filtros
        gridOptions.api.setFilterModel(null)
        // Clear Grilla
        gridOptions.api.setRowData([])

        // Add info to grid
        gridOptions.api.applyTransaction({ 
            add: accounts
        })

        const pinnedBottomData = generatePinnedBottomData()
        gridOptions.api.setPinnedBottomRowData([pinnedBottomData])
        gridOptions.api.hideOverlay()
        
        if ( Object.keys( accounts ).length === 0 ) {
            // console.log( 'Is empty')
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
    const estado = formData.get('status')

    const data = {
        fechaDesde,
        fechaHasta,
        unidadNegocio,
        estado
    }
    // console.log( data )
    get_accountsPayableBalance( tkn, data )
})