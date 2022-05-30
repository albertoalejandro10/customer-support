import { getParameter, format_number } from "../../jsgen/Helper"
import { ag_grid_locale_es, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Boton checkbox
const checkboxDate = document.getElementById('check')
checkboxDate.addEventListener('change', event => {
    const toDate = document.getElementById('to-date')
    if ( event.currentTarget.checked ) {
        toDate.disabled = false
    } else {
        toDate.disabled = true
    }
})

// Boton exportar grilla
const btn_export = document.getElementById("btn_export")
btn_export.onclick = () => {
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
    onFilterChanged: event => filterChangedd(event),
    suppressExcelExport: true,
    popupParent: document.body,
    localeText: localeText,

    columnDefs: [
        {
            width: 120,
            headerName: "Código",
            field: "codigo",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (params.value=='Saldo Inicial')
                    return params.value
                else
                    return params.value
            }
        },
        {
            flex: 1,
            headerName: "Detalle",
            field: "detalle",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)== "null")
                    return "<b>Totales</b>"
                else
                    if (params.value=='Saldo Inicial')
                        return params.value
                    else
                        return params.value
            }
        },
        {
            width: 80,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
            headerName: "Stock",
            field: "stock",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {
            width: 100,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            headerName: "Unidad",
            field: "unidad",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return params.value
            }
        },
        {
            width: 100,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            headerName: "Costo Lista",
            field: "stockValuado",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {
            width: 100,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            headerName: "Deposito",
            field: "deposito",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return params.value
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
        $("#myGrid").height(parseInt($(window).height()) - 230)
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

    let columnsWithAggregation = ['stockValuado']
    columnsWithAggregation.forEach(element => {
        // console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {                  
            if (rowNode.data[element])
                target[element] += Number(rowNode.data[element].toFixed(2))
        })
        if (target[element])
            target[element] = `${target[element].toFixed(2)}`
    })

    return target
}

const post_getDeposits = (tkn, data) => {
    const url_getDeposits = 'https://www.solucioneserp.net/inventario/reportes/get_inventario'
    fetch( url_getDeposits , {
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
        //clear Filtros
        gridOptions.api.setFilterModel(null)

        //Clear Grilla
        gridOptions.api.setRowData([])

        gridOptions.api.applyTransaction({
            add: resp
        })

        let pinnedBottomData = generatePinnedBottomData()
        gridOptions.api.setPinnedBottomRowData([pinnedBottomData])
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
    const lineaId = Number(formData.get('line'))
    const depositoId = Number(formData.get('list'))
    const habilitarFecha = ! (formData.get('check') === 'on') ? 1 : 0
    let fecha = formData.get('to-date')
    fecha = ! (fecha === null ) ? fecha.split('-').reverse().join('/') : ''

    const data = {
        rubroId,
        lineaId,
        depositoId,
        habilitarFecha,
        fecha
    }

    // console.table( data )
    const tkn = getParameter('tkn')
    post_getDeposits( tkn, data )
})