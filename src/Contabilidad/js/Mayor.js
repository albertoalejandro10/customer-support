import { getParameter, format_number, numbersOnly } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Boton exportar grilla
document.getElementById("btn_export").onclick = () => redirectExport()
document.getElementById("btn_export_1024").onclick = () => redirectExport()
const redirectExport = () => {
    gridOptions.api.exportDataAsCsv(getParams())
}

const localeText = ag_grid_locale_es
const gridOptions = {
    headerHeight: 30,
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
            field: "asiento",
            tooltipField: 'asiento',
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
            field: "unidadDeNegocio",
            headerName: "U. de Negocio",
            tooltipField: 'unidadDeNegocio',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                return params.value
            }
        },
        {
            width: 90,
            field: "nroReferencia",
            headerName: "Nº de Ref.",
            tooltipField: 'nroReferencia',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                return params.value
            }
        },
        {
            width: 100,
            field: "usuario",
            tooltipField: 'usuario',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                return params.value
            }
        },
        {
            flex: 1,
            minWidth: 140,
            field: "detalle",
            tooltipField: 'detalle',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null") {
                    return "Totales del Período"
                } else {
                    return params.value
                }
            }
        },
        {
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "debe",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (params.data.detalle != 'Saldo Inicial' && params.value !== null) {
                    return format_number(params.value)
                }
            }
        },
        {
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "haber",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (params.data.detalle != 'Saldo Inicial' && params.value !== null) {
                    return format_number(params.value)
                }
            }
        },
        {
            width: 115,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "saldo",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
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
    // console.log(target)
    //**list of columns fo aggregation**
    let columnsWithAggregation = ['debe', 'haber']
    columnsWithAggregation.forEach(element => {
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {
            if (rowNode.data[element]) {
                if ( rowNode.data.detalle != 'Saldo Inicial') {
                    target[element] += Number(rowNode.data[element].toFixed(2))
                }
            }
        })
        if (target[element]) {
            target[element] = `${target[element].toFixed(2)}`
        }
    })

    let columnsWithAggregationBalance = ['saldo']
    columnsWithAggregationBalance.forEach(element => {
        // console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {
            if (rowNode.data[element]) {
                target[element] = Number(rowNode.data[element].toFixed(2))
            }
            target[element] = rowNode.data.saldo
        })
    })
    //console.log(target)
    return target
}

const get_mayorAccount = (tkn, data) => {
    // Mostrar Loader Grid
    gridOptions.api.showLoadingOverlay()
    const url_getMayorAccount = 'https://www.solucioneserp.net/contabilidad/reportes/get_mayorcuentas'
    fetch( url_getMayorAccount , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( resp => {

        let saldo = 0
        resp.map( resp => {
            const { debe, haber } = resp
            saldo += debe - haber
            resp.saldo = saldo
        })

        // Clear Filtros
        gridOptions.api.setFilterModel(null)
        // Clear Grilla
        gridOptions.api.setRowData([])
        gridOptions.api.applyTransaction({
            add: resp
        })

        gridOptions.api.setPinnedBottomRowData(calculateBottomRows())
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

const calculateBottomRows = () => {
    const totalBottomRows = []
    const lastObject = {
        "detalle": "Saldo final",
        "debe": null,
        "haber": null,
        "saldo": null
    }

    const pinnedBottomData = generatePinnedBottomData()

    lastObject.saldo = pinnedBottomData.saldo
    lastObject.debe = Number(pinnedBottomData.debe)
    lastObject.haber = Number(pinnedBottomData.haber)

    pinnedBottomData.saldo = Number(pinnedBottomData.debe) - Number(pinnedBottomData.haber)
    pinnedBottomData.debe = null
    pinnedBottomData.haber = null

    totalBottomRows.push(pinnedBottomData, lastObject)
    // console.log( totalBottomRows )
    return totalBottomRows
}

// Boton actualizar
const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const detalle = formData.get('detail')
    const unidadNegocioId = Number(formData.get('business'))
    const analisisCuentaId = Number(formData.get('cost-center'))
    const monedaId = Number(formData.get('coin'))
    const nroRef = Number(formData.get('ref-number')) === 0 ? '' : Number(formData.get('ref-number'))
    const cuentaCod = formData.get('account')

    const data = {
        unidadNegocioId,
        fechaDesde,
        fechaHasta,
        detalle,
        analisisCuentaId,
        cuentaCod,
        nroRef,
        monedaId
    }
    // console.table( data )
    const tkn = getParameter('tkn')
    get_mayorAccount( tkn, data )
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

const refNumberElement = document.getElementById('ref-number')
refNumberElement.addEventListener('keyup', () => {
    refNumberElement.value = numbersOnly(refNumberElement.value)
})