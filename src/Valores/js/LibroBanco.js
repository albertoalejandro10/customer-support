import { getParameter, format_number, numbersOnly, format_currency } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, filterChangedd } from "../../jsgen/Grid-Helper"

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
			width: 90,
			field: "fechap",
			headerName: "Presentación",
			tooltipField: 'fechap',
			cellRenderer: function(params) {
				return params.value
			}
		},
		{
			width: 100,
			field: "operacion",
			headerName: "Operación",
			tooltipField: 'operacion',
			cellRenderer: function(params) {
				return params.value
			}
		},
		{
			width: 80,
			field: "numero",
			headerName: "Número",
			tooltipField: 'numero',
			sortable: true,
			filter: true,
			cellRenderer: function(params) {
				return params.value
			}
		},
		{
			flex: 1,
			minWidth: 100,
			field: "detalle",
			tooltipField: 'detalle',
			sortable: true,
			filter: true,
			cellRenderer: function(params) {
				return params.value === null ? "Totales" : params.value;
			}
		},
		{
			width: 100,
			headerClass: "ag-right-aligned-header",
			cellClass: 'cell-vertical-align-text-right',
			field: "importe",
			sortable: true,
			filter: true,
			cellRenderer: function (params) {
				return params.value === null ? '' : format_number(params.value)
			}
		},
		{
			width: 100,
			headerClass: "ag-right-aligned-header",
			cellClass: 'cell-vertical-align-text-right',
			field: "saldo",
			sortable: true,
			filter: true,
			cellRenderer: function(params) {
				return format_number(params.value)
			}
		},
		{
			width: 100,
			headerClass: "ag-right-aligned-header",
			cellClass: 'cell-vertical-align-text-right',
			field: "consilidado",
			headerName: "Conciliado",
			sortable: true,
			filter: true,
			cellRenderer: function(params) {
				return params.value
			}
		}
	],
	rowData: [],
	getRowStyle: params => {
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
		$("#myGrid").height(parseInt($(window).height()) - 295)
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
	let columnsWithAggregation = ['saldo']
	columnsWithAggregation.forEach(element => {
		let values = []
		gridOptions.api.forEachNodeAfterFilter((rowNode) => {
			if (rowNode.data[element]) {
				values.push(Number(rowNode.data[element].toFixed(2)))
			}
		})
		if (values.length > 0) {
			target[element] = values[values.length - 1]
		}
	})
	return target
}

const get_listDetails = data => {
	// Mostrar Loader Grid
	gridOptions.api.showLoadingOverlay()
	const url_getListDetails = process.env.Solu_externo + '/bancosyvalores/librobanco/listar_detalles'
	fetch( url_getListDetails , {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		},
		body: JSON.stringify(data)
	})
	.then( details => details.json() )
	.then(({ registros }) => {
		
		let saldo = 0
		registros = registros.map(obj => {
			saldo += obj.importe
			return {
				...obj,
				saldo
			}
		})

		// Clear Filtros
		gridOptions.api.setFilterModel(null)
		// Clear Grilla
		gridOptions.api.setRowData([])
		gridOptions.api.applyTransaction({
			add: registros
		})
		
		let pinnedBottomData = generatePinnedBottomData()
		gridOptions.api.setPinnedBottomRowData([pinnedBottomData])
		
		gridOptions.api.hideOverlay()
		document.getElementById('print').disabled = false
		
		if ( Object.keys( registros ).length === 0 ) {
			// console.log( 'Is empty')
			gridOptions.api.setPinnedBottomRowData([])
			gridOptions.api.showNoRowsOverlay()
			document.getElementById('print').disabled = true
		}
	})
	.catch( err => {
		console.log( err )
		document.getElementById('print').disabled = true
	})
}

const extractFormData = form => {
	const formData = new FormData(form)
	return {
		unidad_negocio: Number(formData.get('business')),
		dfecha: formData.get('periodStart').split('-').reverse().join('/'),
		hfecha: formData.get('periodEnd').split('-').reverse().join('/'),
		cuenta: Number(formData.get('account')),
		numero: formData.get('number'),
		operacion: Number(formData.get('operation')),
		estado: formData.get('status'),
		importe: Number(formData.get('net').replaceAll('.', '').replace(',', '.')),
		detalle: formData.get('detail')
	}
}

// Boton actualizar
const tkn = getParameter('tkn')
const form = document.getElementById('form')
form.addEventListener('submit', event => {
	event.preventDefault()
	const data = extractFormData(event.currentTarget)
	// console.log(data)
	get_listDetails( data )
})

// Botón Imprimir
const print = document.getElementById('print')
print.onclick = () => {
	const data = extractFormData(form)

	let returnURL = window.location.protocol + '//' + window.location.host + process.env.VarURL + '/Valores/VerLibroBanco.html?'
	for (const property in data) {
		returnURL += `${property}=${data[property]}&`
	}
	const fullURL = returnURL + 'tkn=' + tkn
	setTimeout(() => window.open(fullURL, '_blank', 'toolbar=0,location=0,menubar=0,width=1060,height=800'), 1000)
}

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