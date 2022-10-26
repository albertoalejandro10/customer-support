import { getParameter, format_number } from "../../jsgen/Helper"
import { ag_grid_locale_es, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

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
            width: 100,
            field: "codigo", 
            headerName: "Código",
            tooltipField: 'codigo',
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.data) == "null")
                    return ''
                else
                    return params.value
            }
        },
        {
            flex: 1,
            minWidth: 100,
            field: "producto",
            tooltipField: 'producto',
            headerName: "Detalle",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.data) == "null")
                    return ''
                else
                    return params.value
            }
        },
        {
            width: 100,
            field: "sucursal",
            tooltipField: 'sucursal',
            headerName: "Sucursal",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return params.value
            }
        },
        {
            width: 100, 
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            field: "cantidad",
            headerName: "Cantidad",
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
            width: 120,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            field: "precio",
            headerName: "Precio Prom.",
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
            field: "venta",
            headerName: "Venta Neta",
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
            width: 100,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "noGravado",
            headerName: "No Gravado",
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
            field: "ventaTotal",
            headerName: "Venta Total",
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

function calculatePinnedBottomData(target){
    //console.log(target)
    //**list of columns fo aggregation**
    let columnsWithAggregation = ['cantidad', 'precio', 'venta', 'iva', 'noGravado', 'ventaTotal']
    columnsWithAggregation.forEach(element => {
        // console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {                  
            if (rowNode.data[element]) {
                target[element] += Number(rowNode.data[element].toFixed(2))
            }
        })
        if (target[element]) {
            target[element] = `${target[element].toFixed(2)}`
        } else {
            target[element] = "0"
        }
    })
    return target
}

const get_salesMovements = (tkn, data) => {
    // Mostrar Loader Grilla
    gridOptions.api.showLoadingOverlay()
    const url_getSalesMovements = 'https://www.solucioneserp.net/reportes/ventas/get_movimiento_ventas'
    fetch( url_getSalesMovements , {
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
            // console.log( 'Is empty')
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

    const rubroId = Number(formData.get('entry'))
    const vendedorId = Number(formData.get('sellers'))
    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/') 
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')

    const lineaVentaId = Number(formData.get('line-sales'))
    const sucursalId = Number(formData.get('subsidiary'))
    const tipoClienteId = Number(formData.get('customer-type'))

    const tipoPrecioId = Number(formData.get('price'))
    const tipoDocumentoId = Number(formData.get('documents'))
    const incluirProforma = (formData.get('include-proformas') == 'on') ? 1 : 0

    const data = {
        rubroId,
        vendedorId,
        fechaDesde,
        fechaHasta,
        lineaVentaId,
        sucursalId,
        tipoClienteId,
        tipoPrecioId,
        tipoDocumentoId,
        incluirProforma
    }

    // console.table( data )
    const tkn = getParameter('tkn')
    get_salesMovements( tkn, data )
})