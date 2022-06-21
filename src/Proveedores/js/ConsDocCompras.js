import { getParameter, format_number, format_token, numbersOnly } from "../../jsgen/Helper"
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
            width: 100,
            headerName: 'Contabilizado',
            field: "fechaContable",
            sortable: true,
            filter: true,
            filter: 'agDateColumnFilter',
            comparator: dateComparator,
            filterParams: {
                // provide comparator function
                comparator: comparafecha
            },
            cellRenderer: function(params) {
                if ( String(params.value) == "null" )
                    return "TOTALES"
                else
                    if (String(params.value) == 'null')
                        return ''
                    else
                        return params.value
            }
        },
        {
            flex: 1,
            field: "comprobante",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == 'null')
                    return ''
                else
                    return '<a href="" onclick="window.open(\'' + format_token(params.data.linkComprobante) + '\', \'newwindow\', \'width=800,height=800\');return false;" target="_blank">'+ params.value +'</a>'
            }
        },
        {
            width: 140,
            field: "proveedor",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == 'null')
                    return ''
                else
                    return params.value
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
                    return '<a href="" onclick="window.open(\'' + format_token(params.value) + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-solid fa-folder-closed"></i></a>'
            }
        },
        {
            width: 30, 
            field: "linkAsiento",
            headerName: "",
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + params.value + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-regular fa-folder-open"></i></a>'
            }
        },
        {
            width: 110,
            field: "numeroInterno",
            cellClass: 'ag-right-aligned-cell',
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
            width: 110,
            field: "ejercicio",
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
            width: 90,
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
            width: 90,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
            field: "iva",
            headerName: "IVA",
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
            width: 90,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
            field: "retencion",
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
            cellClass: 'ag-right-aligned-cell',
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
            width: 90,
            headerClass: "ag-right-aligned-header",
            cellClass: 'ag-right-aligned-cell',
            field: "importe",
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
            width: 90,
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

    let columnsWithAggregation = ['neto', 'iva', 'retencion', 'noGravado', 'importe', 'pendiente']
    columnsWithAggregation.forEach(element => {
        //console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {                  
            if (rowNode.data[element]) {
                target[element] += Number(rowNode.data[element].toFixed(2))
            }
        })
        if (target[element]) {
            target[element] = `${target[element].toFixed(2)}`
        } else {
            target[element] = '0.00'
        }
    })

    //console.log(target)
    return target
}

const get_purchaseDocuments = (tkn, data) => {
    gridOptions.api.showLoadingOverlay()

    const url_getPurchaseDocuments = 'https://www.solucioneserp.net/reportes/consultas/get_documentos_compras'
    fetch( url_getPurchaseDocuments , {
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
            gridOptions.api.setPinnedBottomRowData([])
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

    const comprobante = Number(formData.get('voucher'))
    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const proveedor = formData.get('supplier')
    const unidadNegocio = Number(formData.get('business'))

    // Operador ternario
    const nroDocumento = (formData.get('doc-number') === '') ? '' : Number(formData.get('doc-number'))
    const nroAsiento = (formData.get('number-seats') === '') ? '' : Number(formData.get('number-seats'))
    const ptoVta = (formData.get('sale-point') === '') ? '0000' : formData.get('sale-point')

    const data = {
        comprobante,
        fechaDesde,
        fechaHasta,
        nroDocumento,
        nroAsiento,
        proveedor,
        ptoVta,
        unidadNegocio,
    }

    // console.log( data )
    const tkn = getParameter('tkn')
    get_purchaseDocuments( tkn, data )
})

const numberDocsElement = document.getElementById('doc-number')
numberDocsElement.addEventListener('keyup', () => {
    numberDocsElement.value = numbersOnly(numberDocsElement.value)
})

const numberSeatsElement = document.getElementById('number-seats')
numberSeatsElement.addEventListener('keyup', () => {
    numberSeatsElement.value = numbersOnly(numberSeatsElement.value)
})

const salePointElement = document.getElementById('sale-point')
salePointElement.addEventListener('keyup', () => {
    salePointElement.value = numbersOnly(salePointElement.value)
})