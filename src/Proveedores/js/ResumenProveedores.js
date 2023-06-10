import { getParameter, format_number, format_token } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Boton exportar grilla
const btn_export = document.getElementById("btn_export")
btn_export.onclick = function() {
    gridOptions.api.exportDataAsCsv(getParams())
}

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
            width: 120,
            headerName: "Fecha Asiento",
            field: "fechaC",
            tooltipField: 'fechaC',
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
            width: 90,
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
          width: 30,
          headerName: "",
          field: "linkComprobante",
          cellRenderer: function(params) {
            if (String(params.value) == "null" || params.data.comprobante == "Saldo Inicial")
              return ""
            else
              return '<a href="" onclick="window.open(\'' + format_token(params.value) + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-regular fa-folder-open"></i></a>'
          }
        },
        {
            width: 145,
            field: "comprobante",
            tooltipField: 'comprobante',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
              if (String(params.value) == "null")
                return "Saldo final"
              else
                if (params.value == 'Saldo Inicial')
                  return params.value
                else
                  return '<a href="" onclick="window.open(\'' + format_token(params.data.linkComprobante) + '\', \'newwindow\', \'width=800,height=800\');return false;" target="_blank">'+ params.value +'</a>'
            }
        },
        {
            flex: 1,
            minWidth: 100,
            headerName: "Observaciones",
            field: "observacion",
            tooltipField: 'observacion',
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
            width: 80,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "moneda",
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
          width: 30,
          headerName: "",
          field: "linkAdjuntos",
          cellRenderer: function(params) {
              if (String(params.value) == "null" || params.data.comprobante == "Saldo Inicial")
                return ""
              else
                return '<a href="" onclick="window.open(\'' + format_token(params.value) + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-regular fa-folder-open"></i></a>'
          }
        },
        {
          width: 30,
          headerName: "",
          field: "linkAsignaciones",
          cellRenderer: function(params) {
            if (String(params.value) == "null" || params.data.comprobante == "Saldo Inicial")
              return ""
            else
              return '<a href="" onclick="window.open(\'' + format_token(params.value) + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-regular fa-folder-open"></i></a>'
          }
        },
        {
            width: 90,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            headerName: "Debe",
            field: "importeDebe",
            tooltipField: "importeDebe",
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
            width: 90,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            headerName: "Haber",
            field: "importeHaber",
            tooltipField: 'importeHaber',
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
            width: 90,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            headerName: "Saldo",
            field: "saldo",
            tooltipField: 'saldo',
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

document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid')
    new agGrid.Grid(gridDiv, gridOptions)

    if ((parseInt($(window).height()) - 300) < 200)
      $("#myGrid").height(100)
    else
      $("#myGrid").height(parseInt($(window).height()) - 260)
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
    //* list of columns fo aggregation
    let columnsWithAggregation = ['importeDebe', 'importeHaber']
    columnsWithAggregation.forEach(element => {
        //console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {                  
          if (rowNode.data[element])
            target[element] += Number(rowNode.data[element].toFixed(2))
        })
        if (target[element]) {
          target[element] = `${target[element].toFixed(2)}`
        } else {
          target[element] = '0.00'
        }
    })
    let columnsWithAggregationBalance = ['saldo']
    columnsWithAggregationBalance.forEach(element => {
        // console.log('element', element)
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {
            if (rowNode.data[element]) {
                target[element] = Number(rowNode.data[element].toFixed(2))
            }
            target[element] = rowNode.data.saldo || '0.00'
        })
    })
    //console.log(target)
    return target
}

const get_supplierSummary = (tkn, data) => {
    // Mostrar Loader Grilla
    gridOptions.api.showLoadingOverlay()
    const url_getSupplierSummary = process.env.Solu_externo + '/reportes/proveedores/get_resumen_cuenta_proveedor'
    fetch( url_getSupplierSummary , {
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
      let saldo = 0
      resp.map( resp => {
          const { importeDebe, importeHaber } = resp
          saldo += importeDebe - importeHaber
          resp.saldo = saldo
          return resp
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
      if ( Object.keys( resp ).length === 0 ) {
        // console.log( 'Is empty')
        gridOptions.api.showNoRowsOverlay()
        gridOptions.api.setPinnedBottomRowData([])
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
    
    const unidadNegocioId = Number(formData.get('business'))
    const fechaDesde      = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta      = formData.get('periodEnd').split('-').reverse().join('/')
    const monedaId        = Number(formData.get('coin'))
    const cuentaEstado    = formData.get('status')
    const codigoProveedor = formData.get('supplier')
    
    const data = {
      unidadNegocioId,
      fechaDesde,
      fechaHasta,
      cuentaEstado,
      codigoProveedor,
      monedaId,
    }

    // console.log( data )
    get_supplierSummary( tkn, data )
})

const tkn = getParameter('tkn')
const name = getParameter('nombre')
const codigoProveedor = getParameter('codigoProveedor')
const unidadNegocioId = getParameter('unidadNegocioId')
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
            if (tkn && name && codigoProveedor && unidadNegocioId) {
                document.getElementById('getBackToPreviousPage').classList.remove('d-none')
                const monedaId = Number(document.getElementById('coin').value)
                let [fechaDesde] = data
                const fechaHasta = new Date().toLocaleDateString('en-GB')
            
                const info = {
                  unidadNegocioId: Number(unidadNegocioId),
                  fechaDesde: fechaDesde.fecha,
                  fechaHasta,
                  cuentaEstado: estado,
                  codigoProveedor,
                  monedaId
                }
                // console.log(info)
                get_supplierSummary(tkn, info)
            }
        }
    } catch (error) {
        console.log(error)
    }
}
APIRequest()