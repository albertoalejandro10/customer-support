import { getParameter, format_number, format_token, reverseFormatNumber } from "../../jsgen/Helper"
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
                    return "<b>Subtotal</b>"
                else
                    return params.value
            }
        },
        {
            flex: 1,
            field: "detalle",
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
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
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
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
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
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
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
            width: 115,
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
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
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
}

document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid')
    new agGrid.Grid(gridDiv, gridOptions)

    if ((parseInt($(window).height()) - 300) < 200)
        $("#myGrid").height(100)
    else
        $("#myGrid").height(parseInt($(window).height()) - 280)
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
            if (rowNode.data[element])
                target[element] += Number(rowNode.data[element].toFixed(2))
        })
        if (target[element])
            target[element] = `${target[element].toFixed(2)}`            

    })
    // console.log(target)
    return target
}

const get_productMovements = (tkn, data) => {
    gridOptions.api.showLoadingOverlay()

    const url_getProductMovements = 'https://www.solucioneserp.net/inventario/reportes/get_movimiento_productos'
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

        if ( resp.length === 0 ) {
            // console.log( 'Is empty')
            gridOptions.api.showNoRowsOverlay()
        } else {
            const bothRows = []
            const subtotalRow = generatePinnedBottomData()
            bothRows.push(subtotalRow)
            const { entrada, salida } = subtotalRow
            if ( ! ( entrada === null && salida === null ) ) {
                // console.log('Ok total')
                const totalRow = calculateLastRow(entrada, salida)
                bothRows.push(totalRow)
            }
            gridOptions.api.setPinnedBottomRowData(bothRows)
            gridOptions.api.hideOverlay()
        }
    })
    .catch( err => {
        console.log( err )
    })
}

const calculateLastRow = (entrada, salida) => {
    entrada = Number(reverseFormatNumber(entrada, 'de'))
    salida  = Number(reverseFormatNumber(salida, 'de'))
    let total = entrada - salida
    total = String(total).slice(0, -2)
    const obj = {
        comprobante: "<b>Total</b>",
        costo: null,
        detalle: null,
        entrada: null,
        fecha: null,
        precio: null,
        precioF: null,
        salida: total
    }
    return obj
}

const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const depositoId = Number(formData.get('deposit'))
    const codProducto = formData.get('producto')
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