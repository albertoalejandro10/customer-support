import { getParameter, format_number } from "../../jsgen/Helper"
import { ag_grid_locale_es, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

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
            field: "codigo", 
            headerName: "Código",
            tooltipField: 'codigo',
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                return params.value
            }
        },
        {
            flex: 1,
            minWidth: 100,
            field: "producto",
            tooltipField: 'producto',
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null") {
                    return "Totales"
                } else {
                    return params.value
                }
            }
        },
        {
            width: 105,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            field: "cantidad",
            headerName: "Cantidad",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                return format_number(params.value)
            }
        },
        {
            width: 105,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            field: "costo",
            headerName: "Costo Prom.",
            cellRenderer: function(params) {
                return format_number(params.value)
            }
        },
        {
            width: 105,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            field: "precio",
            headerName: "Precio Prom.",
            cellRenderer: function(params) {
                return format_number(params.value)
            }
        },
        {
            width: 105,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            field: "venta",
            cellRenderer: function(params) {
                return format_number(params.value)
            }
        },
        {
            width: 105,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "impUtil",
            headerName: "Utilidad",
            cellRenderer: function(params) {
                return format_number(params.value)
            }
        },
        {
            width: 105,
            headerClass: "text-right",
            cellClass: 'cell-vertical-align-text-right',
            field: "porcUtil",
            headerName: "Margen s/Costo(%)",
            cellRenderer: function(params) {
                return format_number(params.value)
            }
        },
        {
            width: 105,
            headerClass: "text-right",
            cellClass: 'cell-vertical-align-text-right',
            field: "porcVta",
            headerName: "Margen s/Venta(%)",
            cellRenderer: function(params) {
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

function calculatePinnedBottomData(target){
    //console.log(target)
    // *list of columns fo aggregation*
    let columnsWithAggregation = ['cantidad', 'costo', 'precio', 'venta', 'impUtil']
    columnsWithAggregation.forEach(element => {
        // console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {                  
            if (rowNode.data[element]) {
                target[element] += Number(rowNode.data[element].toFixed(2))
            }
        })
        if (target[element]) {
            target[element] = `${target[element].toFixed(2)}`
        }
    })
    return target
}

const get_utilities = (tkn, data) => {
    // Mostrar Loader Grilla
    gridOptions.api.showLoadingOverlay()
    const url_getUtilities = process.env.Solu_externo + '/reportes/ctrl_gestion/get_utilidades'
    fetch( url_getUtilities , {
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
        gridOptions.api.applyTransaction({
            add: resp
        })

        let pinnedBottomData = generatePinnedBottomData()
        const { costo, precio } = pinnedBottomData
        pinnedBottomData.porcUtil = (((precio * 100 ) / costo) - 100).toString()
        pinnedBottomData.porcVta = (100 - (( costo * 100 ) / precio)).toString()
        
        gridOptions.api.setPinnedBottomRowData([pinnedBottomData])
        gridOptions.api.hideOverlay()
        if ( Object.keys( resp ).length === 0 ) {
            // console.log( 'Is empty')
            gridOptions.api.showNoRowsOverlay()
            gridOptions.api.setPinnedBottomRowData([])
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

    const rubroId = Number(formData.get('entry'))
    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/') 
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const lineaVentaId = Number(formData.get('line-sales'))
    const sucursalId = Number(formData.get('subsidiary'))
    const tipoDocumentoId = Number(formData.get('documents'))
    const precioPromedio = formData.get('average-price') == 'on' ? true : false

    const data = {
        rubroId,
        lineaVentaId,
        sucursalId,
        fechaDesde,
        fechaHasta,
        tipoDocumentoId,
        precioPromedio
    }

    // console.table( data )
    const tkn = getParameter('tkn')
    get_utilities( tkn, data )
})