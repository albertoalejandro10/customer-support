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
document.getElementById("btn_export").onclick = () => redirectExport()
document.getElementById("btn_export_1024").onclick = () => redirectExport()
const redirectExport = () => {
    gridOptions.api.exportDataAsCsv(getParams())
}

const localeText = ag_grid_locale_es
const gridOptions = {
    headerHeight: 30,
    rowHeight: 25,
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
            headerName: "Código",
            field: "codigo",
            tooltipField: 'codigo',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (params.value ==' Saldo Inicial')
                    return params.value
                else
                    return params.value
            }
        },
        {
            flex: 1,
            headerName: "Detalle",
            field: "producto",
            tooltipField: 'producto',
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
            width: 180,
            headerClass: "text-center",
            cellClass: 'ag-center-aligned-cell',
            headerName: "Fecha Ult. Modif.",
            field: "fechaModificacion",
            tooltipField: 'fechaModificacion',
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
            headerName: "Índice",
            field: "indice",
            tooltipField: 'indice',
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
            width: 110,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            headerName: "No Gravado",
            field: "noGravado",
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
            width: 110,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            headerName: "Precio Neto",
            field: "precio",
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
            width: 110,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'cell-vertical-align-text-right',
            headerName: "Precio Final",
            field: "precioFinal",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
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
        $("#myGrid").height(parseInt($(window).height()) - 230)
})

const post_getPriceList = (tkn, data) => {
    // Mostrar Loader
    gridOptions.api.showLoadingOverlay()
    const url_getAccountsBalance = 'https://www.solucioneserp.net/inventario/reportes/get_listas_precios'
    fetch( url_getAccountsBalance , {
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

        if ( resp.length === 0 ) {
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
    const lineaId = Number(formData.get('line'))
    const listaId = Number(formData.get('list'))
    const habilitarFecha = formData.get('check') === 'on' ? 1 : 0
    const fecha = formData.get('to-date') === null ? '' : formData.get('to-date').split('-').reverse().join('/')

    const data = {
        rubroId,
        lineaId,
        listaId,
        habilitarFecha,
        fecha
    }
    // console.table( data )
    const tkn = getParameter('tkn')
    post_getPriceList( tkn, data )
})