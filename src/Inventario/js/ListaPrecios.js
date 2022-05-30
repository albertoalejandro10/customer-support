import { getParameter, format_number } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Boton checkbox
const checkboxDate = document.getElementById('check')
checkboxDate.addEventListener('change', event => {
    const modified = document.getElementById('modified')
    if ( event.currentTarget.checked ) {
        modified.disabled = false
    } else {
        modified.disabled = true
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
            field: "producto",
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
            width: 120,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
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
            width: 120,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
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
            width: 120,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
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

        //clear Filtros
        gridOptions.api.setFilterModel(null)

        //Clear Grilla
        gridOptions.api.setRowData([])

        gridOptions.api.applyTransaction({
            add: resp
        })
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
    const habilitarFecha = (formData.get('check') === 'on') ? 1 : 0
    let fecha = formData.get('modified')
    fecha = ! (fecha === null ) ? fecha.split('-').reverse().join('/') : ''

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