import { getParameter, format_number, numbersOnly, format_token } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Boton exportar grilla
document.getElementById("btn_export").onclick = () => redirectExport()
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
			width: 70,
			field: "asiento",
			tooltipField: 'asiento',
			cellRenderer: function(params) {
				if (params.value) {
					return '<a href="" onclick="window.open(\'' + format_token(params.data.linkAsiento) + '\', \'newwindow\', \'width=1200,height=800\');return false;" target="_blank">'+ params.value +'</a>'
				}
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
			width: 100,
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

const get_mayorAccount = data => {
	// Mostrar Loader Grid
	gridOptions.api?.showLoadingOverlay()
	const url_getMayorAccount = process.env.Solu_externo + '/contabilidad/reportes/get_mayorcuentas'
	fetch( url_getMayorAccount , {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		},
		body: JSON.stringify(data)
	})
	.then( resp => resp.json() )
	.then(resp => {
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
		
		if ( Object.keys( resp ).length === 0 ) {
			// console.log( 'Is empty')
			gridOptions.api.setPinnedBottomRowData([])
			gridOptions.api.showNoRowsOverlay()
			document.getElementById('btn_print').disabled = true
		}
	})
	.catch( err => {
		console.log( err )
		document.getElementById('btn_print').disabled = true
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
	pinnedBottomData.debe = pinnedBottomData.debe === null ? '0' : pinnedBottomData.debe
	pinnedBottomData.haber = pinnedBottomData.haber === null ? '0' : pinnedBottomData.haber

	lastObject.saldo = pinnedBottomData.saldo
	pinnedBottomData.saldo = Number(pinnedBottomData.debe) - Number(pinnedBottomData.haber)
	totalBottomRows.push(pinnedBottomData, lastObject)
	return totalBottomRows
}

// Boton actualizar
const tkn = getParameter('tkn')
const form = document.getElementById('form')
form.addEventListener('submit', event => {
	event.preventDefault()
	const formData = new FormData(event.currentTarget)

	const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
	const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
	const detalle = formData.get('detail')
	const unidadNegocioId = Number(formData.get('business'))
	const analisisCuentaId = Number(formData.get('cost-center'))
	const monedaId = Number(formData.get('coin'))
	const nroRef = Number(formData.get('ref-number')) === 0 ? '' : Number(formData.get('ref-number'))
	const cuentaCod = formData.get('account') === 'TODAS_ID' ? '' : formData.get('account')

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
	// console.log( data )
	get_mayorAccount( data )
})

const refNumberElement = document.getElementById('ref-number')
refNumberElement.addEventListener('keyup', () => {
	refNumberElement.value = numbersOnly(refNumberElement.value)
})

const get_dataFromURL = () => {
	const data = window.location.search.substring(1).split('&').reduce((acc, element) => {
		const [ property, value ] = element.split('=')
		acc[property] = value
		return acc
	}, {})
	const { dfecha, hfecha, ccosto, analisiscta, cuenta } = data

	document.getElementById('business').value = ccosto
	document.getElementById('cost-center').value = analisiscta
	document.getElementById('periodStart').value = dfecha.split('/').reverse().join('-')
	document.getElementById('periodEnd').value = hfecha.split('/').reverse().join('-')

	const sendData = {
		unidadNegocioId: ccosto,
		fechaDesde: dfecha,
		fechaHasta: hfecha,
		analisisCuentaId: analisiscta,
		cuentaCod: cuenta,
	}
	// console.log(sendData)
	get_mayorAccount( sendData )
}

const url = new URL(window.location.href)
const params = Array.from(url.searchParams)
if (params.length >= 2) {
  get_dataFromURL()
}