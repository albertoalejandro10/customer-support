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
            width: 85,
            headerName: "Venc.",
            field: "vencimiento",
            tooltipField: 'vencimiento',
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
            tooltipField: 'fecha',
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
            width: 155,
            field: "comprobante",
            tooltipField: 'comprobante',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
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
            minWidth: 100,
            field: "nombre",
            tooltipField: 'nombre',
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
            flex: 1,
            minWidth: 120,
            field: "observacion",
            tooltipField: 'observacion',
            headerName: "Observaciones",
            sortable: true,
            filter: true,
        },
        {
            width: 30,
            headerName: "",
            field: "linkAdjuntos",
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + format_token(params.value) + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-regular fa-folder-open"></i></a>'
            }
        },
        {
            width: 90,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
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
            width: 90,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
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
            width: 100,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "total",
            tooltipField: 'total',
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
            field: "pendiente",
            tooltipField: 'pendiente',
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
        $("#myGrid").height(parseInt($(window).height()) - 290)
})

function generatePinnedBottomData () {
    // generate a row-data with null values
    let result = {}
    gridOptions.api.columnModel.gridColumns.forEach(item => {
        result[item.colId] = null
    })
    return calculatePinnedBottomData(result)
}

function calculatePinnedBottomData(target) {
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

const get_pendingCharges = (tkn, data) => {
    // Mostrar Loader Grilla
    gridOptions.api.showLoadingOverlay()
    const url_getPendingCharges = process.env.Solu_externo + '/reportes/proveedores/get_comprobantes_pendiente_pago'
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

    const idUnidadNegocio = Number(formData.get('business'))
    const fechaDesde      = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta      = formData.get('periodEnd').split('-').reverse().join('/')
    const monedaId        = Number(formData.get('coin'))
    const estado          = formData.get('status')
    const proveedor       = formData.get('supplier') === null ? '0' : formData.get('supplier')

    // Operador ternario
    const habilitaFechaVencimiento = formData.get('expirationCheckbox') === 'on' ? 1 : 0
    const fechaVencimiento         = formData.get('expiration') === null ? '' : formData.get('expiration').split('-').reverse().join('/')
    const conDetVencimiento        = formData.get('with-expiration') === 'on' ? 1 : 0

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
    // console.log( data )
    get_pendingCharges( tkn, data )
})

const tkn = getParameter('tkn')
const name = getParameter('nombre')
const proveedor = getParameter('codProveedor')
const idUnidadNegocio = getParameter('unidadNegocio')
const estado = getParameter('estado')

const APIRequest = async () => {
    const endpoint = process.env.Solu_externo + '/listados/get_fecha_inicio_ejercicio'
    try {
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${tkn}`}
        })
        if( response.ok ) {
            const data = await response.json()
            if (tkn && name && proveedor && idUnidadNegocio) {
                document.getElementById('getBackToPreviousPage').classList.remove('d-none')
                const monedaId = Number(document.getElementById('coin').value)
                let [fechaDesde] = data
                const fechaHasta = new Date().toLocaleDateString('en-GB')
            
                const info = {
                    idUnidadNegocio: Number(idUnidadNegocio),
                    fechaDesde: fechaDesde.fecha,
                    fechaHasta,
                    hastaFechaVencimiento: 0,
                    fechaVencimiento: "",
                    estado,
                    proveedor,
                    monedaId,
                    conDetVencimiento: 0
                }
                // console.log(info)
                get_pendingCharges(tkn, info)
            }
        }
    } catch (error) {
        console.log(error)
    }
}
APIRequest()