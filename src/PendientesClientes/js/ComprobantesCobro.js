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
            headerName: "Venc.",
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
            width: 145,
            field: "comprobante",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)== "null")
                    return ""
                else
                    if (params.value=='Saldo Inicial')
                        return params.value
                    else
                        return '<a href="" onclick="window.open(\'' + format_token(params.data.linkComprobante) + '\', \'newwindow\', \'width=800,height=800\');return false;" target="_blank">'+ params.value +'</a>'
            }
        },
        {
            flex: 1,
            headerName: "Cliente",
            field: "nombre",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
            if (String(params.value) == "null")
                return "<b>Total</b>"
            else
                return params.value
            }
        },
        { 
            flex: 2,
            field: "observacion",
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
            headerName: "Importe",
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

    const url_getPendingCharges = 'https://www.solucioneserp.net/reportes/clientes/get_comprobantes_pendientes_cobro'
    fetch( url_getPendingCharges , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( ({ linea }) => {

        //clear Filtros
        gridOptions.api.setFilterModel(null)

        //Clear Grilla
        gridOptions.api.setRowData([])

        gridOptions.api.applyTransaction({ 
            add: linea
        })
        
        let pinnedBottomData = generatePinnedBottomData()
        gridOptions.api.setPinnedBottomRowData([pinnedBottomData])
        
        gridOptions.api.hideOverlay()

        if ( Object.keys( linea ).length === 0 ) {
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

    const business = Number(formData.get('business'))
    const periodStart = formData.get('periodStart').split('-').reverse().join('/')
    const periodEnd = formData.get('periodEnd').split('-').reverse().join('/')
    const expirationCheckbox = formData.get('expirationCheckbox')
    const expiration = get_expirationDate(formData.get('expiration'))
    const status = formData.get('status')
    const customer = $(".cmb_clientes").val()//formData.get('customer')
    const coin = formData.get('coin')
    if (formData.get('platform')=="on")
        var platform = 1
    else
        var platform = 0

    const data = {
        "idUnidadNegocio": business,
        "fechaDesde": periodStart,
        "fechaHasta": periodEnd,
        "hastaFechaVencimiento": 0,
        "fechaVencimiento": expiration,
        "cuentaEstado": status,
        "codigoCliente": customer,
        "idMoneda": coin,
        "incluirProformas": platform,
        "incluirRemitos": 0
    }

    const tkn = getParameter('tkn')
    get_PendingCharges( tkn, data )
})

const get_expirationDate = expirationValue => {
    let expiration
    if ( expirationValue ) {
        expiration = expirationValue.split('-').reverse().join('/')
    } else {
        expiration = ""
    }
    return expiration
}