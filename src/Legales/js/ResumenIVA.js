import { getParameter, format_number, numbersOnly } from "../../jsgen/Helper"
import { ag_grid_locale_es, filterChangedd } from "../../jsgen/Grid-Helper"

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
            flex: 1,
            minWidth: 120,
            field: "tipoIva",
            tooltipField: 'tipoIva',
            headerName: "Tipo IVA",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == 'null')
                    return 'Totales'
                else
                    return params.value + ` (${params.data.tipoComp})`
            }
        },
        {
            width: 80,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "porcIva",
            headerName: "% IVA",
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
            cellClass: 'cell-vertical-align-text-right',
            field: "neto",
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
            cellClass: 'cell-vertical-align-text-right',
            field: "iva",
            headerName: 'IVA Inscrip.',
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
            cellClass: 'cell-vertical-align-text-right',
            field: "noGravado",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) =="null")
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {
            width: 90,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "retencion",
            headerName: "Retención",
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
            cellClass: 'cell-vertical-align-text-right',
            field: "impuesto1",
            headerName: "Percep. IIBB",
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
            cellClass: 'cell-vertical-align-text-right',
            field: "impuest2",
            headerName: "Percep. LH",
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
            cellClass: 'cell-vertical-align-text-right',
            field: "total",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
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
const gridOptions2 = {...gridOptions}
document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid')
    new agGrid.Grid(gridDiv, gridOptions)
    if ((parseInt($(window).height()) - 300) < 200) {
        $("#myGrid").height(100)
    } else {
        $("#myGrid").height(parseInt($(window).height()) - 540)
    }

    const gridDiv2 = document.querySelector('#myGrid-purchased')
    new agGrid.Grid(gridDiv2, gridOptions2)
    if ((parseInt($(window).height()) - 300) < 200) {
        $("#myGrid-purchased").height(100)
    } else {
        $("#myGrid-purchased").height(parseInt($(window).height()) - 540)
    }
})

function generatePinnedBottomData () {
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
    let columnsWithAggregation = ['iva', 'neto', 'noGravado', 'retencion', 'impuesto1', 'impuest2', 'total']
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

function generatePinnedBottomData2 (){
    // generate a row-data with null values
    let result = {}
    gridOptions2.api.columnModel.gridColumns.forEach(item => {
        result[item.colId] = null
    })
    return calculatePinnedBottomData2(result)
}

function calculatePinnedBottomData2(target) {
    //console.log(target)
    //**list of columns fo aggregation**
    let columnsWithAggregation = ['iva', 'neto', 'noGravado', 'retencion', 'impuesto1', 'impuest2', 'total']
    columnsWithAggregation.forEach(element => {
        //console.log('element', element)
        gridOptions2.api.forEachNodeAfterFilter((rowNode) => {                  
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

const get_summaryBook = (tkn, data) => {
    gridOptions.api.showLoadingOverlay()
    gridOptions2.api.showLoadingOverlay()
    const url_getSummaryBook = process.env.Solu_externo + '/legales/get_resumen_libro_iva'
    fetch( url_getSummaryBook , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( resp => {
        const resultSales = resp.filter( x => x.lIva === 'V')
        const resultPurchases = resp.filter( x => x.lIva === 'C')

        const salesTotal = printSalesTables( resultSales )
        const purchasesTotal = printPurchasesTables( resultPurchases )
        printDifference( salesTotal, purchasesTotal )
    })
    .catch( err => {
        console.log( err )
    })
}

const printSalesTables = resp => {
    // console.log( resp )
    // Clear Filtros
    gridOptions.api.setFilterModel(null)
    // Clear Grilla
    gridOptions.api.setRowData([])
    gridOptions.api.applyTransaction({ 
        add: resp
    })
    
    const pinnedBottomData = generatePinnedBottomData()
    gridOptions.api.setPinnedBottomRowData([pinnedBottomData])
    
    gridOptions.api.hideOverlay()
    
    if ( Object.keys( resp ).length === 0 ) {
        // console.log( 'Is empty')
        gridOptions.api.setPinnedBottomRowData([])
        gridOptions.api.showNoRowsOverlay()
    }
    // console.log('Ventas IVA:', pinnedBottomData.iva )
    return Number(pinnedBottomData.iva)
}

const printPurchasesTables = resp => {
    // console.log( resp )
    // Clear Filtros
    gridOptions2.api.setFilterModel(null)
    // Clear Grilla
    gridOptions2.api.setRowData([])
    gridOptions2.api.applyTransaction({ 
        add: resp
    })
    
    const pinnedBottomData = generatePinnedBottomData2()
    gridOptions2.api.setPinnedBottomRowData([pinnedBottomData])
    
    gridOptions2.api.hideOverlay()
    
    if ( Object.keys( resp ).length === 0 ) {
        // console.log( 'Is empty')
        gridOptions2.api.setPinnedBottomRowData([])
        gridOptions2.api.showNoRowsOverlay()
    }
    // console.log( 'Compras IVA: ', pinnedBottomData.iva )
    return Number(pinnedBottomData.iva)
}

const printDifference = ( salesTotal, purchasesTotal ) => {
    const total = document.getElementById('total')
    let difference = 0
    if ( salesTotal > purchasesTotal ) {
        difference = salesTotal - purchasesTotal
        total.textContent = 'Diferencia = ' + format_number(difference) + ' (A Favor AFIP)'
    } else if ( salesTotal < purchasesTotal ) {
        difference = purchasesTotal - salesTotal
        total.textContent = 'Diferencia = ' + format_number(difference) + ' (En contra AFIP)'
    } else {
        difference = salesTotal - purchasesTotal
        total.textContent = 'Diferencia = ' + format_number(difference) + ' (Iguales AFIP)'
    }
}

const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const unidadNegocioId = Number(formData.get('business'))
    const sucursalId = Number(formData.get('subsidiary'))
    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const provinciaId = Number(formData.get('provinces'))
    // const origen = formData.get('origins')
    
    // Operador ternario
    const puntoVenta = formData.get('sale-point') === '' ? '0000' : formData.get('sale-point')
    const ivaPorActividad = formData.get('activity-iva') === 'on' ? 1 : 0

    const data = {
        unidadNegocioId,
        sucursalId,
        fechaDesde,
        fechaHasta,
        puntoVenta,
        provinciaId,
        origen: '',
        ivaPorActividad,
    }

    // console.log( data )
    const tkn = getParameter('tkn')
    get_summaryBook( tkn, data )
})

const salePointElement = document.getElementById('sale-point')
salePointElement.addEventListener('keyup', () => {
    salePointElement.value = numbersOnly(salePointElement.value)
})