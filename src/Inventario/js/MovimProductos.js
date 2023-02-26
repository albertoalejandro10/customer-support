import { getParameter, format_number } from "../../jsgen/Helper"
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
            tooltipField: 'comprobante',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if ( String(params.value) == "null" )
                    return "Totales"
                else
                    return params.value
            }
        },
        {
            flex: 1,
            minWidth: 100,
            field: "detalle",
            tooltipField: 'detalle',
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
            width: 100,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "entrada",
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
            width: 100,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "salida",
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
            width: 100,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "costo",
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
            width: 100,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "precio",
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
            width: 120,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            headerName: "Precio Final",
            field: "precioF",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if ( String(params.value) == "null" )
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
        $("#myGrid").height(parseInt($(window).height()) - 260)
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
    let columnsWithAggregation = ['entrada', 'salida']
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
    // Calcular campo «costo»
    const { entrada, salida } = target
    const costo = Number(entrada) - Number(salida)
    target.costo = `${costo}.00`
    
    // console.log(target)
    return target
}

const get_productMovements = (tkn, data) => {
    // Mostrar Loader
    gridOptions.api.showLoadingOverlay()
    const url_getProductMovements = process.env.Solu_externo + '/inventario/reportes/get_movimiento_productos'
    fetch( url_getProductMovements , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( resp => {
        // Clear Filtros
        gridOptions.api.setFilterModel(null)
        // Clear Grilla
        gridOptions.api.setRowData([])
        gridOptions.api.setPinnedBottomRowData([])

        gridOptions.api.applyTransaction({
            add: resp
        })

        let pinnedBottomData = generatePinnedBottomData()
        gridOptions.api.setPinnedBottomRowData([pinnedBottomData])
        
        if ( resp.length === 0 ) {
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

    const depositoId = Number(formData.get('deposit'))
    const codProducto = (formData.get('producto') === null) ? '' : formData.get('producto')
    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const tipoComprobante = Number(formData.get('voucher-type'))

    const data = {
        depositoId,
        codProducto,
        fechaDesde,
        fechaHasta,
        tipoComprobante
    }
    // console.table( data )
    const tkn = getParameter('tkn')
    get_productMovements( tkn, data )
})