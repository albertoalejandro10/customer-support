import { getParameter, format_number, format_token } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Boton exportar grilla
const btn_export = document.getElementById("btn_export")
btn_export.onclick = function() {
    gridOptions.api.exportDataAsCsv(getParams())
}

const checkboxExpiration = document.getElementById('checkboxExpiration')
checkboxExpiration.addEventListener('change', event => {
    const expiration = document.getElementById('expiration')
    if ( event.currentTarget.checked ) {
        expiration.required = true
        expiration.disabled = false
        expiration.value = (new Date().toLocaleDateString('en-GB')).split('/').reverse().join('-')
    } else {
        expiration.disabled = true
        expiration.required = false
        expiration.value = ''
    }
})

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
            headerName: "Vencimiento",
            field: "vencimiento",
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
            width: 30, 
            field: "linkComprobante",
            headerName: "",
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + format_token(params.value) + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-regular fa-folder-open"></i></a>'
            }
        },
        {
            width: 145,
            field: "comprobante",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)== "null")
                    return "TOTAL"
                else
                    if (params.value=='Saldo Inicial')
                        return params.value
                    else
                        return '<a href="" onclick="window.open(\'' + format_token(params.data.linkComprobante) + '\', \'newwindow\', \'width=800,height=800\');return false;" target="_blank">'+ params.value +'</a>'
            }
        },
        {
            flex: 1,
            field: "nombre",
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
            flex: 2,
            field: "observacion",
            headerName: "Observaciones",
            sortable: true,
            filter: true
        },
        {
            width: 30,
            headerName: "",
            field: "linkAdjuntos",
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + params.value + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-solid fa-folder"></i></a>'
            }
        },
        {
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
            field: "moneda",
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
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
            field: "neto",
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
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
            field: "total",
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
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
            field: "pendiente",
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

    let columnsWithAggregation = ['pendiente']
    columnsWithAggregation.forEach(element => {
        //console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {                  
            if (rowNode.data[element])
                target[element] += Number(rowNode.data[element].toFixed(2))
        })
        if (target[element])
            target[element] = `${target[element].toFixed(2)}`            

    })
    //console.log(target)
    return target
}

const get_PendingCharges = (tkn, data) => {
    gridOptions.api.showLoadingOverlay()

    const url_getPendingCharges = 'https://www.solucioneserp.net/reportes/proveedores/get_comprobantes_pendiente_pago'
    fetch( url_getPendingCharges , {
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

    const idUnidadNegocio = Number(formData.get('business'))
    const fechaDesde      = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta      = formData.get('periodEnd').split('-').reverse().join('/')
    const monedaId        = Number(formData.get('coin'))
    const estado          = formData.get('status')
    const proveedor       = $(".cmb_proveedor").val()

    // Operador ternario
    const habilitaFechaVencimiento = (formData.get('expirationCheckbox') === 'on') ? 1 : 0
    const fechaVencimiento         = (formData.get('expiration') === null) ? '' : formData.get('expiration').split('-').reverse().join('/')
    const conDetVencimiento        = (formData.get('with-expiration') === 'on') ? 1 : 0

    const data = {
        idUnidadNegocio,
        fechaDesde,
        fechaHasta,
        habilitaFechaVencimiento,
        fechaVencimiento,
        monedaId,
        estado,
        proveedor,
        conDetVencimiento
    }

    // console.table( data )
    const tkn = getParameter('tkn')
    get_PendingCharges( tkn, data )
})