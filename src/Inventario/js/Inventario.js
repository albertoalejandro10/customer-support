import { getParameter, format_number } from "../../jsgen/Helper"
import { ag_grid_locale_es, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Obtiene el checkbox y el campo de fecha por su ID
const checkboxDate = document.getElementById('check')
const toDate = document.getElementById('to-date')

// Agrega un evento de cambio al checkbox
checkboxDate.addEventListener('change', event => {
	// Si el checkbox está marcado, habilita el campo de fecha
	// Si el checkbox no está marcado, deshabilita el campo de fecha
	toDate.disabled = !event.currentTarget.checked
})

// Boton exportar grilla
document.getElementById("export").onclick = () => redirectExport()
const redirectExport = () => {
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
			headerName: "Código",
			field: "codigo",
			tooltipField: 'codigo',
			sortable: true,
			filter: true,
			cellRenderer: function(params) {
				if (params.value == 'Saldo Inicial')
					return params.value
				else
					return params.value
			}
		},
		{
			flex: 1,
			minWidth: 120,
			headerName: "Detalle",
			field: "detalle",
			tooltipField: 'detalle',
			sortable: true,
			filter: true,
			cellRenderer: function(params) {
				if (String(params.value) == "null")
					return "Totales"
				else
					if (params.value=='Saldo Inicial')
						return params.value
					else
						return params.value
			}
		},
		{
			width: 80,
			headerClass: "ag-right-aligned-header",
			cellClass: 'cell-vertical-align-text-right',
			headerName: "Stock",
			field: "stock",
			tooltipField: 'stock',
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
			headerName: "Unidad",
			field: "unidad",
			tooltipField: 'unidad',
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
			width: 120,
			headerClass: "ag-right-aligned-header", 
			cellClass: 'cell-vertical-align-text-right',
			headerName: "Stk. Valuado",
			field: "stockValuado",
			tooltipField: 'stockValuado',
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
			headerName: "Deposito",
			field: "deposito",
			tooltipField: 'deposito',
			sortable: true, 
			filter: true,
			cellRenderer: function(params) {
				if ( String(params.value) == "null" )
					return ""
				else
					return params.value
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
		$("#myGrid").height(parseInt($(window).height()) - 220)
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
	let columnsWithAggregation = ['stockValuado']
	columnsWithAggregation.forEach(element => {
		// console.log('element', element)
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

	return target
}

const post_getStock = (tkn, data) => {
	// Mostrar loader
	gridOptions.api.showLoadingOverlay()
	const url_getDeposits = process.env.Solu_externo + '/inventario/reportes/get_inventario'
	// const url_getDeposits = localhost... '/inventario/reportes/get_inventario'
	fetch( url_getDeposits , {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		},
		body: JSON.stringify(data)
	})
	.then( stock => stock.json() )
	.then( stock => {
		// console.log( stock )

		// Clear Filtros
		gridOptions.api.setFilterModel(null)
		// Clear Grilla
		gridOptions.api.setRowData([])
		gridOptions.api.applyTransaction({
			add: stock
		})
		let pinnedBottomData = generatePinnedBottomData()
		gridOptions.api.setPinnedBottomRowData([pinnedBottomData])

		// No rows loader
		if ( stock.length === 0 ) {
			// console.log( 'Is empty')
			gridOptions.api.showNoRowsOverlay()
		}
	})
	.catch( err => {
		console.log( err )
	})
}

const form = document.getElementById('form')
form.addEventListener('submit', event => {
	event.preventDefault()
	const formData = new FormData(event.currentTarget)

	const rubroId = formData.get('entry') === null ? '' : Number(formData.get('entry'))
	const lineaId = formData.get('sale-line') === null ? '' : Number(formData.get('sale-line'))
	const depositoId = Number(formData.get('list'))
	const habilitarFecha = (formData.get('check') === 'on') ? 1 : 0
	let fecha = formData.get('to-date')
	fecha = ! (fecha === null ) ? fecha.split('-').reverse().join('/') : ''

	const data = {
		rubroId,
		lineaId,
		depositoId,
		habilitarFecha,
		fecha
	}

	// console.log( data )
	const tkn = getParameter('tkn')
	post_getStock( tkn, data )
})