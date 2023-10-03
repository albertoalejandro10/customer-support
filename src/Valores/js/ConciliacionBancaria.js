import { format_number, getParameter, isNumber, isValidDate, reverseFormatNumber } from "../../jsgen/Helper"

let arrTable = []
const loader = document.getElementById('loader')
const table = document.getElementById('movements-table')
const tbodyTable = document.getElementById('movements-tbody')
const tfootTable = document.getElementById('movements-tfoot')

let fechaConfirm = ''
let unidadNegocioIdConfirm = 0
let ultNroConciliation = 0
let nroCuenta = 0

// Fetch a la API, mostrar loader, ocultar loader y generar tabla principal con los datos de la API.
const post_getLastConciliation = data => {
	loader.classList.remove('d-none')
	
	const getLastConciliation = fetch( process.env.Solu_externo + '/bancosyvalores/conciliacion_bancaria/get_ult_conciliacion' , {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		}
	})

	const getUltNroConciliation = fetch(process.env.Solu_externo + `/bancosyvalores/conciliacion_bancaria/get_ult_nro?cuenta=${data.cuenta}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		}
	})

	Promise.all([getLastConciliation, getUltNroConciliation])
		.then(responses => Promise.all(responses.map(response => response.json())))
		.then(([{ cuenta, mensaje, pendientes, resultado, saldos }, { numero }]) => {
			if (resultado !== 'ok') return
			if (pendientes.length === 0) document.getElementById('not-movements').classList.remove('d-none')
			updateHigherForm(cuenta, saldos, numero)
			arrTable = [...pendientes]

			clearTable(table, 2)
			printTable(pendientes)

			fechaConfirm = data.fecha
			nroCuenta = data.cuenta
			unidadNegocioIdConfirm = data.unidadNegocioId
			ultNroConciliation = numero
		})
		.catch( err => {
			console.log( err )
			loader.classList.add('d-none')
		})
		.finally(() => {
			loader.classList.add('d-none')
			assignCheckboxEventListeners([updateHigherInput])
			confirmConciliation()
		})
}

// Limpiar tablas.
const clearTable = (table, length) => {
	while(table.rows.length > length) {
		table.deleteRow(length)
	}
}

const inputCountableBalance = document.getElementById('countable-balance')
const inputUnreconciledMovement =  document.getElementById('unreconciled-movement') 
const inputDifference = document.getElementById('difference')
const inputReconciledTo = document.getElementById('reconciled-to')
const inputFinalBalance = document.getElementById('final-balance')

// Actualizar los campos del higher form.
const updateHigherForm = (cuenta, saldos, numero) => {
	if (numero === 0) {
		inputCountableBalance.value = ''
		inputUnreconciledMovement.value = ''
		inputDifference.value = ''
		inputReconciledTo.value = ''
		inputFinalBalance.value = ''		
	} else {
		inputCountableBalance.value = format_number(saldos.contable)
		inputUnreconciledMovement.value = format_number(saldos.noConciliado)
		inputDifference.value = format_number(cuenta.diferencia)
		inputReconciledTo.value = format_number(cuenta.debe)
		inputFinalBalance.value = format_number(saldos.total)
	}

	document.getElementById('update').classList.add('d-none')
	const date = (cuenta.fechaUlt.slice(0, 10)).split('-').reverse().join('/')
	const reconciledToText = document.getElementById('reconciled-to-text')
	reconciledToText.textContent = `Conciliado al ${date} (Nro ${numero}):`

	const toExpandFirstDiv = document.getElementById('to-expand')
  toExpandFirstDiv.classList.remove('col-sm-3', 'col-xl-2')
	toExpandFirstDiv.classList.add('col-sm-5')
	toExpandFirstDiv.classList.add('col-xl-3')

	const toExpandButtons = document.getElementById('expand-buttons')
	toExpandButtons.classList.remove('col-xl-6')
	toExpandButtons.classList.add('col-xl-12')

	const toExpandBalance = document.getElementById('expand-input-balance')
	toExpandBalance.style.marginRight = '114px'
	reconciledToText.style.marginRight = '4px'
	
	const buttons = document.querySelectorAll('button[type="button"]')
	buttons.forEach(button => {
		button.classList.remove('d-none')
	})
}

// Generar tabla principal del formulario.
const printTable = data => {
	let finalBalance = 0
  data.forEach(({asiento, asientoId, bcoDetalle, bcoFecha, bcoNombre, bcoNumero, check, cuenta, debe, detalle, fecha, id, importe, linkAsiento, nombre, numero, semaforo, vencimiento}) => {
		const row = document.createElement('tr')
		let checkedAttribute = check ? 'checked' : ''
		const importeCell = createCell(format_number(importe))
		importeCell.id = 'import-' + id

    row.append(
      createCell(`<a href="javascript:void(0);" link-id=${id}>${fecha}<a/>`, true),
      createCell(nombre),
      createCell(numero),
      createCell(detalle.substring(0, 40)),
      createCell(),
      createCell(),
      createCell(),
      createCell(),
			createCell(),
			importeCell,
			createCell(`<label><input type="checkbox" name='checkbox-${id}' id='${id}' ${checkedAttribute}><span class="label">&nbsp;</span></label>`, true)
			)
		finalBalance += importe
		tbodyTable.appendChild(row)
	})
	const row = document.createElement('tr')
	const emptyCell = createCell()
	emptyCell.colSpan = 8
	const finalBalanceElement = createCell('$ ' + format_number(finalBalance))
	finalBalanceElement.id = 'finalBalance'
	row.append(
		emptyCell,
		createCell('Saldo FINAL'),
		finalBalanceElement,
	)
	tfootTable.appendChild(row)
	getAnchorsAndEditSeat()
}

const modalTextWrongDate = document.getElementById('modal-wrong-date')
const modalTextWrongNumber = document.getElementById('modal-wrong-number')
const saveEditConciliation = id => {
	document.getElementById('saveConciliation').onclick = () => {
		modalTextWrongDate.classList.add('d-none')
		modalTextWrongNumber.classList.add('d-none')

		const fecha = document.getElementById('modal-fecha').textContent
		const numero = document.getElementById('modal-numero').textContent

		if (!isValidDate(fecha)) {
			modalTextWrongDate.classList.remove('d-none')
			return
		}
		
		if (!isNumber(numero)) {
			modalTextWrongNumber.classList.remove('d-none')
			return
		}

		const data = { id, fecha, numero }
		editFetchAPI(data)
	}
}

// Fetch para editar valores presentacion y numero
const editFetchAPI = data => {
	fetch( process.env.Solu_externo + '/bancosyvalores/conciliacion_bancaria/valores_upd' , {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		}
	})
	.then(update => update.json())
	.then(({ resultado, mensaje }) => {
		if (resultado !== 'ok') return
		alert(`Resultado: ${resultado} \nMensaje: ${mensaje}`)
		const data = extractFormData(form)
		hideEditModal()
		post_getLastConciliation(data)
	})
}

// Helper para crear celdas.
const createCell = (text = '', html = false) => {
	const cell = document.createElement('td')
	if (html) {
		cell.innerHTML = text
	} else {
		cell.textContent = text
	}
	return cell
}

// Mostrar modal edit.
const editModal = document.getElementById('editModal')
const showEditModal = () => {
	editModal.style.display = 'block'
	modalTextWrongDate.classList.add('d-none')
	modalTextWrongNumber.classList.add('d-none')
}

// Cerrar modal edit.
document.getElementById('closeEditModal').onclick = () => hideEditModal()
const hideEditModal = () => editModal.style.display = 'none'

// Extraer datos.
const extractFormData = form => {
	const formData = new FormData(form)
	return {
		fecha: formData.get('date').split('-').reverse().join('/'),
		cuenta: Number(formData.get('account')),
		unidadNegocioId: Number(formData.get('business')),
		orden: formData.get('order'),
	}
}

// Boton actualizar y generar llamada a la API.
const tkn = getParameter('tkn')
const form = document.getElementById('form')
form.addEventListener('submit', event => {
	event.preventDefault()
	const data = extractFormData(event.currentTarget)
	// console.log(data)
	post_getLastConciliation(data)
})

// Boton Importar Extracto Bancario
const initialBalance = document.getElementById('initialBalance')
const excelModal = document.getElementById('excelModal')
const confirm = document.getElementById('confirm')
document.getElementById('import-excel').addEventListener('click', () => {
	excelModal.style.display = 'block'

	// Manejar el archivo .csv ingresado por el usuario. (Solo prueba aun no esta funcionando, lo dejare por el momento.)
	const inputFile = document.getElementById('formFile')
	inputFile.addEventListener('change', event => {
		const file = event.target.files[0]
		const reader = new FileReader()
	
		reader.onload = event => {
			let csvData = event.target.result
			console.log(csvData)
		}
	
		reader.readAsText(file)

		// reader.onload = event => {
		// 	let csvData = event.target.result
		// 	let lines = csvData.split('\n')
		// 	let headers = lines[0].split(',')
		
		// 	let csvArray = lines.slice(1).map(line => {
		// 		let values = line.split(',')
		
		// 		let row = {}
		// 		headers.forEach((header, index) => {
		// 			row[header] = values[index]
		// 		})
		
		// 		return row
		// 	})
		
		// 	console.log(csvArray)
		// }
	})

	const data = {
		movimientos: arrTable,
		fileExcel: ''
	}

	document.getElementById('processExcel').onclick = () => {
		fetch(process.env.Solu_externo + '/bancosyvalores/conciliacion_bancaria/importar_Excel', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${tkn}`
			}
		})
		.then(excel => excel.json())
		.then(({ movimientos, saldoInicial }) => {
			hideExcelModal()
			clearTable(table, 2)
			initialBalance.textContent = format_number(saldoInicial)
			printExcelTable(movimientos)
			assignCheckboxEventListeners([toggleClasses, calculateFinalBalance, changeAttribute])
			confirm.disabled = true
			// confirmExcelConciliation()
		})
	}
})

// Generar tabla principal del formulario cuando el usuario cliquea desde Importar extracto bancario. Es muy similar a la otra pero trae otras variables e imprime mas valores.
const printExcelTable = data => {
	let finalExcelBalance = 0
	let count = 0
	data.forEach(({ check, cuenta_codigo, cuenta_nombre, detalle_eb, detalle_erp, fecha_eb, fecha_erp, id_erp, importe, numero_eb, numero_erp, operacion_eb, operacion_erp }) => {
		const row = document.createElement('tr')
		const checkedAttribute = check ? 'checked' : ''
		const checkedDisabled = check ? 'disabled' : ''

		let checkboxCell = createCell(`<label><input type='checkbox' name='checkbox-${count}' id='${count}' registro=${false} ${checkedAttribute} ${checkedDisabled}><span class='label'>&nbsp;</span></label>`, true)		
		const importeCell = createCell(format_number(importe))
		importeCell.id = 'import-' + count
		importeCell.classList.add('text-white')

		if (detalle_eb === null) {
			checkboxCell.classList.add('grayCheckbox')
			importeCell.classList.add('bg-secondary')
		} else if (detalle_erp === null) {
			finalExcelBalance += importe
			importeCell.classList.add('bg-warning')
			checkboxCell = createCell(`<label><input type='checkbox' name='checkbox-${count}' id='${count}' registro=${true} ${checkedAttribute} ${checkedDisabled}><span class='label'>&nbsp;</span></label>`, true)
			checkboxCell.classList.add('warningCheckbox')
		} else {
			importeCell.classList.add('bg-success')
		}

    row.append(
      createCell(fecha_erp),
      createCell(operacion_erp),
      createCell(numero_erp),
      createCell(detalle_erp),
      createCell(fecha_eb),
      createCell(operacion_eb),
      createCell(numero_eb),
      createCell(detalle_eb),
			createCell(cuenta_nombre),
			importeCell,
      checkboxCell
		)
		tbodyTable.appendChild(row)
		count++
	})

	const row = document.createElement('tr')
	const emptyCell = createCell()
	emptyCell.colSpan = 8
	const finalBalanceElement = createCell('$ ' + format_number(finalExcelBalance))
	finalBalanceElement.classList.add('text-right')
	finalBalanceElement.id = 'finalBalance'
	row.append(
		emptyCell,
		createCell('Saldo FINAL'),
		finalBalanceElement,
	)
	tfootTable.appendChild(row)
	getAnchorsAndEditSeat()
}

// Generar tabla del modal.
const generateModalTable = editSeat => {
	const table = document.getElementById('modal-table')
	clearTable(table, 1)
	const [{ asiento, id, detalle, fecha, nombre, numero, vencimiento }] = editSeat
	let [{importe}] = editSeat
	// console.log(asiento, detalle, fecha, importe, nombre, numero, vencimiento)

	importe = '$ ' + format_number(importe)

	const row = document.createElement('tr')
	const cellFecha = createCell(vencimiento)
	cellFecha.setAttribute('contenteditable', 'true')
	cellFecha.id = 'modal-fecha'
	const cellNumero = createCell(numero)
	cellNumero.setAttribute('contenteditable', 'true')
	cellNumero.id = 'modal-numero'
	row.append(
		createCell(asiento),
		createCell(fecha),
		cellFecha,
		createCell(nombre),
		cellNumero,
		createCell(detalle.substring(0, 40)),
		createCell(importe),
	)
	table.appendChild(row)
	saveEditConciliation(id)
}

// Conseguir los anchors y editar registro.
const getAnchorsAndEditSeat = () => {
	const anchors = document.querySelectorAll('a[link-id]')
	anchors.forEach(anchor => {
		anchor.addEventListener('click', event => {
			const { target } = event
			const id = Number(target.getAttribute('link-id'))
			const editSeat = arrTable.filter(x => x.id === id)

			generateModalTable(editSeat)
			showEditModal()
		})
	})
}

// Cerrar modal Excel.
document.getElementById('closeExcelModal').onclick = () => hideExcelModal()
const hideExcelModal = () => excelModal.style.display = 'none'

// Inputs del Higher form para que solo acepten numeros y esten en formato 1.000,00.
const currencyInputs = document.querySelectorAll('input[data-type="currency"]')
currencyInputs.forEach(input => {
  input.addEventListener('keyup', event => {
    let {target} = event
    if ( target.value.length < 2 ) {
			if (target.value === '-') return
    }
    let result = format_currency(String(target.value))
    if ( result.includes('NaN') ) result = ''
    target.value = result
  })
})

// Helper para formatear.
const format_currency = value => {
  value = value.replace('.', '').replace(',', '').replace(/(?!-)[^0-9]/g, "") 
  const options = { minimumFractionDigits: 2, maximumFractionsDigits: 2 }
  const result = new Intl.NumberFormat('pt-BR', options).format(
		parseFloat(value) / 100
  )
  return result
}

// Eliminar Ult. Conciliacion
document.getElementById('delete-last').addEventListener('click', () => {
	if (window.confirm('¿Estás seguro de que deseas eliminar la ultima conciliación?')) {
		fetch( process.env.Solu_externo + '/bancosyvalores/conciliacion_bancaria/conciliacion_del' , {
			method: 'POST',
			body: JSON.stringify({
				cuenta: String(nroCuenta),
				numero: ultNroConciliation
			}),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${tkn}`
			}
		})
		.then(deleteLastConciliation => deleteLastConciliation.json())
		.then(({ resultado, mensaje }) => {
			if (resultado !== 'ok') return
			alert(`Resultado: ${resultado} \nMensaje: ${mensaje}`)
			const infoData = extractFormData(form)
			post_getLastConciliation(infoData)
		})
	}
})

// Boton limpiar
document.getElementById('clean').addEventListener('click', () => {
	confirm.disabled = false
	inputCountableBalance.value = ''
	inputUnreconciledMovement.value = ''
	inputDifference.value = ''
	inputReconciledTo.value = ''
	inputFinalBalance.value = ''

	document.getElementById('update').classList.remove('d-none')
	const buttons = document.querySelectorAll('button[type="button"]')
	buttons.forEach(button => {
		button.classList.add('d-none')
	})
	initialBalance.textContent = '$ 0,00'
	clearTable(table, 2)
})

// Boton confirmar
const confirmConciliation = () => {
	confirm.addEventListener('click', () => {
		if (window.confirm('¿Estás seguro de que deseas confirmar la conciliación?')) {
			const importeConcil = reverseFormatNumber(inputFinalBalance.value, 'de-DE')
			const saldoInicial = reverseFormatNumber(inputReconciledTo.value, 'de-DE')
			const checkboxes = getCheckboxes()
			const registros = checkboxes.filter(registro => {
				if (registro.checked === true) {
					return true
				}
				return false
			}).map(registro => registro.id)

			const data = {
				"fecha": fechaConfirm,
				registros,
				"ultimoNro": ultNroConciliation,
				"cuenta": nroCuenta,
				importeConcil,
				saldoInicial: saldoInicial === '' ? 0 : saldoInicial,
				"unidadNegocioId": unidadNegocioIdConfirm
			}
	
			fetch( process.env.Solu_externo + '/bancosyvalores/conciliacion_bancaria/conciliacion_grabar' , {
				method: 'POST',
				body: JSON.stringify(data),
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${tkn}`
				}
			})
			.then(confirm => confirm.json())
			.then(({ resultado, mensaje }) => {
				if (resultado !== 'ok') return
				alert(`Resultado: ${resultado} \nMensaje: ${mensaje}`)
				const infoData = extractFormData(form)
				post_getLastConciliation(infoData)
			})
		}
	})
}

// Conseguir los checkbox
const getCheckboxes = () => {
  return Array.from(document.querySelectorAll('input[type="checkbox"]'))
}

// Manejador de eventos
const handleCheckboxClick = (checkbox, callback) => {
  checkbox.addEventListener('click', event => {
    const id = event.target.id
    const checked = event.target.checked
    callback(id, checked)
  })
}

// Cambiar clases bg warning y bg secondary
const toggleClasses = id => {
  const trImport = document.getElementById(`import-${id}`)
  trImport.classList.toggle('bg-warning')
  trImport.classList.toggle('bg-secondary')
}

// Calcular saldo final
const calculateFinalBalance = () => {
  let finalBalanceExcel = 0
  Array.from(document.getElementsByClassName('bg-warning')).forEach(element => {
    finalBalanceExcel += parseFloat(reverseFormatNumber(element.textContent, 'de-DE'))
  })
  document.getElementById('finalBalance').textContent = '$ ' + format_number(finalBalanceExcel)
}

// Cambiar atributo, false o true.
const changeAttribute = id => {
  const checkbox = document.getElementById(id)
  checkbox.registro = !checkbox.registro
}

let finalCash = 0.00
const updateHigherInput = (id, isChecked) => {
	if (isChecked) {
		finalCash += parseFloat(reverseFormatNumber(document.getElementById(`import-${id}`).textContent, 'de-De'))
	} else {
		finalCash -= parseFloat(reverseFormatNumber(document.getElementById(`import-${id}`).textContent, 'de-De'))
	}
	inputFinalBalance.value = format_number(finalCash)
}

const assignCheckboxEventListeners = (callbacks) => {
  const checkboxes = getCheckboxes()
  checkboxes.forEach(checkbox => {
    callbacks.forEach(callback => {
      handleCheckboxClick(checkbox, callback)
    })
  })
}