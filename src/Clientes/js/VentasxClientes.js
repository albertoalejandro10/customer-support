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
            field: "Fecha",
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
            field: "Comprobante",
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
            field: "cliente",
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
            width: 120,
            field: "Sucursal",
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
            flex: 2,
            field: "detalle",
            headerName: "Producto",
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
            width: 90,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
            field: "cantidad",
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
            width: 90,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
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
            width: 100,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
            field: "precioF",
            headerName: 'Precio Final',
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
    let columnsWithAggregation = ['cantidad', 'precio', 'precioF']
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
    return target
}

const get_salesCustomers = (tkn, data) => {
    gridOptions.api.showLoadingOverlay()

    const url_getSalesCustomers = 'https://www.solucioneserp.net/reportes/clientes/get_ventasxcliente'
    fetch( url_getSalesCustomers , {
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
        document.getElementById('btn_print').disabled = false
        
        if ( Object.keys( resp ).length === 0 ) {
            // console.log( 'Is empty')
            gridOptions.api.setPinnedBottomRowData([])
            gridOptions.api.showNoRowsOverlay()
            document.getElementById('btn_print').disabled = true
        }
    })
    .catch( err => {
        console.log( err )
        document.getElementById('btn_print').disabled = true
    })
}

// Boton actualizar
const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const cliente = formData.get('customer')
    const idSucursal = Number(formData.get('subsidiary'))
    const idRubro = Number(formData.get('entry'))
    const idLineaVenta = Number(formData.get('sale-line'))
    const idTipoReporte = Number(formData.get('report-type'))
    const idTipoComprobante = Number(formData.get('voucher'))
    const idProveedor = Number(formData.get('supplier'))
    // Operador ternario
    const codProducto = formData.get('product') === null  ? '' : formData.get('product')

    const data = {
        cliente,
        codProducto,
        fechaDesde,
        fechaHasta,
        idSucursal,
        idProveedor,
        idRubro,
        idLineaVenta,
        idTipoReporte,
        idTipoComprobante
    }

    // console.log( data )
    const tkn = getParameter('tkn')
    get_salesCustomers( tkn, data )
})

// Boton Imprimir
document.getElementById("btn_print").onclick = () => {
    const fechaDesde = (document.getElementById('periodStart').value).split('-').reverse().join('/')
    const fechaHasta = (document.getElementById('periodEnd').value).split('-').reverse().join('/')

    const cliente = document.getElementById('customer').value
    const codProducto = document.getElementById('product').value === null ? '' : document.getElementById('product').value
    const idSucursal = Number(document.getElementById('subsidiary').value)
    const idRubro = Number(document.getElementById('entry').value)
    const idLineaVenta = Number(document.getElementById('sale-line').value)
    const idTipoReporte = Number(document.getElementById('report-type').value)
    const idTipoComprobante = Number(document.getElementById('voucher').value)
    const idProveedor = Number(document.getElementById('supplier').value)

    const data = {
        cliente,
        codProducto,
        fechaDesde,
        fechaHasta,
        idSucursal,
        idProveedor,
        idRubro,
        idLineaVenta,
        idTipoReporte,
        idTipoComprobante
    }
    // console.table( data )
    const tkn = getParameter('tkn')
    let returnURL = window.location.protocol + '//' + window.location.host + '/clientes/VerVentasxClientes.html?'
    for (const property in data) {
        returnURL += `${property}=${data[property]}&`
    }
    const fullURL = returnURL + 'tkn=' + tkn
    setTimeout(() => window.open(fullURL, '_blank', 'toolbar=0,location=0,menubar=0'), 1000)
}