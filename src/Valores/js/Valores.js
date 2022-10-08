import { getParameter, format_number, numbersOnly, format_currency } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Boton exportar grilla
document.getElementById("btn_export").onclick = () => redirectExport()
document.getElementById("btn_export_1024").onclick = () => redirectExport()
const redirectExport = () => {
    gridOptions.api.exportDataAsCsv(getParams())
}

const localeText = ag_grid_locale_es
const gridOptions = {
    headerHeight: 28,
    rowHeight: 22,
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
            width: 70,
            field: "valor",
            tooltipField: 'valor',
            cellRenderer: function(params) {
                return params.value
            }
        },
        {
            width: 70,
            field: "numero",
            headerName: "Número",
            tooltipField: 'numero',
            cellRenderer: function(params) {
                return params.value
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
            width: 120,
            field: "Vencimiento",
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
            flex: 1,
            minWidth: 100,
            field: "recibido",
            tooltipField: 'recibido',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null") {
                    return "Totales"
                } else {
                    return params.value
                }
            }
        },
        {
            width: 100,
            field: "cuit",
            headerName: "C.U.I.T.",
            tooltipField: 'cuit',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                return params.value
            }
        },
        {
            flex: 1,
            minWidth: 100,
            field: "estado",
            tooltipField: 'estado',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                return params.value
            }
        },
        {
            width: 100,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "importe",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
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
        $("#myGrid").height(parseInt($(window).height()) - 310)
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
    // console.log(target)
    //**list of columns fo aggregation**
    let columnsWithAggregation = ['importe']
    columnsWithAggregation.forEach(element => {
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {
            if (rowNode.data[element]) {
                target[element] += Number(rowNode.data[element].toFixed(2))
            }
        })
        if (target[element]) {
            target[element] = `${target[element].toFixed(2)}`
        }
    })
    //console.log(target)
    return target
}

const get_valuesConsult = (tkn, data) => {
    // Mostrar Loader Grid
    gridOptions.api.showLoadingOverlay()
    const url_getValuesConsult = 'https://www.solucioneserp.net/bancosyvalores/reportes/get_consultaValores'
    fetch( url_getValuesConsult , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( resp => {
        resp.map( resp => {
            let { importe } = resp
            importe = Number(importe)
            resp.importe = importe
        })

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
        document.getElementById('btn_print_1024').disabled = false
        
        if ( Object.keys( resp ).length === 0 ) {
            // console.log( 'Is empty')
            gridOptions.api.setPinnedBottomRowData([])
            gridOptions.api.showNoRowsOverlay()
            document.getElementById('btn_print').disabled = true
            document.getElementById('btn_print_1024').disabled = true
        }
    })
    .catch( err => {
        console.log( err )
        document.getElementById('btn_print').disabled = true
        document.getElementById('btn_print_1024').disabled = true
    })
}

// Boton actualizar
const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const unidadNegocioId = Number(formData.get('business'))
    const tipoPeriodo = formData.get('period-type')
    const estado = formData.get('status')
    const orden = formData.get('order')
    const numero = formData.get('number')
    const valorId = Number(formData.get('value'))
    const detValorId = Number(formData.get('det-value'))
    const importe = Number(formData.get('net').replaceAll('.', '').replace(',', '.'))
    const entrega = formData.get('delivery')
    const cuit = formData.get('cuit')

    const data = {
        fechaDesde,
        fechaHasta,
        unidadNegocioId,
        tipoPeriodo,
        estado,
        orden,
        numero,
        valorId,
        detValorId,
        importe,
        entrega,
        cuit
    }
    // console.log( data )
    const tkn = getParameter('tkn')
    get_valuesConsult( tkn, data )
})

// Boton Imprimir
// document.getElementById("btn_print").onclick = () => redirectPrint()
// document.getElementById("btn_print_1024").onclick = () => redirectPrint()
// const redirectPrint = () => {
//     const fechaDesde = (document.getElementById('periodStart').value).split('-').reverse().join('/')
//     const fechaHasta = (document.getElementById('periodEnd').value).split('-').reverse().join('/')
//     const detalle = document.getElementById('detail').value
//     const unidadNegocioId = Number(document.getElementById('business').value)
//     const analisisCuentaId = Number(document.getElementById('cost-center').value)
//     const monedaId = Number(document.getElementById('coin').value)
//     const nroRef  = Number(document.getElementById('ref-number').value) === 0 ? '' : Number(document.getElementById('ref-number').value)
//     const cuentaCod = document.getElementById('account').value

//     const data = {
//         unidadNegocioId,
//         fechaDesde,
//         fechaHasta,
//         detalle,
//         analisisCuentaId,
//         cuentaCod,
//         nroRef,
//         monedaId
//     }
//     console.table( data )
//     const tkn = getParameter('tkn')
//     let returnURL = window.location.protocol + '//' + window.location.host + '/clientes/VerResumen.html?'
//     for (const property in data) {
//         returnURL += `${property}=${data[property]}&`
//     }
//     const fullURL = returnURL + 'tkn=' + tkn
//     setTimeout(() => window.open(fullURL, '_blank', 'toolbar=0,location=0,menubar=0'), 1000)
// }

const numberElement = document.getElementById('number')
numberElement.addEventListener('keyup', () => {
    numberElement.value = numbersOnly(numberElement.value)
})

$("input[data-type='currency']").on({
    keyup: function() {
    	format_currency($(this))
    },
    blur: function() { 
    	format_currency($(this), "blur")
    }
})