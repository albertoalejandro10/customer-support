import { getParameter, format_number, format_token } from "../../jsgen/Helper"

const tkn = getParameter('tkn')
const post_getResultState = data => {
	fetch( process.env.Solu_externo + '/contabilidad/estado_situacion_patrimonial/obtener' , {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		}
	})
	.then( result => result.json() )
	.then( ({estado_sit_patrimonial}) => {
		// console.log(estado_sit_patrimonial)
		const activeTable = document.getElementById('active-tbody')
		const passiveTable = document.getElementById('passive-tbody')
		cleanTables(activeTable)
		cleanTables(passiveTable)

		const activeArray = estado_sit_patrimonial.filter(active => active.ptipo === 'A')
		const passiveArray = estado_sit_patrimonial.filter(passive => passive.ptipo === 'P')

		printTable(activeTable, activeArray)
		printTable(passiveTable, passiveArray)

		printFooter(activeArray, passiveArray)

		loadingx.forEach(elem => elem.classList.add('d-none'))
		loading.forEach(elem => elem.classList.remove('d-none'))
		print.disabled = false
	})
	.catch( err => {
		loadingx.forEach(elem => elem.classList.add('d-none'))
		loading.forEach(elem => elem.classList.add('d-none'))
		console.log(err)
	})
}

const cleanTables = table => {
	while (table.rows.length > 0) {
		table.deleteRow(0)
	}
}

// Helper function to create 'td' and append to 'tr'
const createAndAppendTd = (parent, content) => {
	const td = document.createElement('td')
	td.textContent = content
	parent.appendChild(td)
	return td
}

// Main function to print data into a table
const printTable = (table, data) => {
	// Check if table element and data array are valid
	if (!table) {
		throw new Error('Table element is not defined')
	}
	if (!data || data.length === 0) {
		cleanTables(table)
		document.getElementById('empty-data').classList.remove('d-none')
		throw new Error('Data is not defined or empty')
	}
	document.getElementById('empty-data').classList.add('d-none')

	// Iterate over each object in data array
	for (const { codigo, nombre, saldo, linkMayorCuentas } of data) {
		const row = document.createElement('tr')

		// Create 'td' elements and append to 'tr'
		const row_data_1 = createAndAppendTd(row, nombre)
		const row_data_2 = createAndAppendTd(row, format_number(saldo))

		// Add specific classes and attributes based on conditions
		const anchor = document.createElement('a')
		if (codigo.trim().length === 1) {
			row_data_1.classList.add('font-weight-bold')
			row_data_2.classList.add('font-weight-bold')
		} else if (codigo.trim().length === 2) {
			row_data_1.classList.add('font-weight-bold')
			row_data_1.classList.add('pl-3')
			row_data_2.classList.add('font-weight-bold')
		} else if (codigo.trim().length === 3) {
			row_data_1.classList.add('font-weight-bold')
			row_data_1.classList.add('pl-5')
			row_data_2.classList.add('font-weight-bold')
		} else {
			anchor.setAttribute('href', format_token(linkMayorCuentas))
			anchor.textContent = nombre
			row_data_1.textContent = ''
			row_data_1.appendChild(anchor)
			row_data_1.classList.add('pl-6')
		}
		// Append 'tr' to table
		table.appendChild(row)
	}
}

const printFooter = (active, passive) => {
	console.log(active)
	console.log(passive)
	if (!active || !active[0] || !passive || !passive[0]) {
		throw new Error('Invalid input')
	}

	// Update DOM
	const updateFooter = (id, value, isTotal) => {
		if (isTotal) {
			return document.getElementById(id).textContent = value !== 0 ? format_number(value) : ''
		}
		return document.getElementById(id).textContent = format_number(value)
	}

	const totalBalanceActive = Number(active[0].saldo_total)
	const totalBalancePassive = Number(passive[0].saldo_total)

	updateFooter('total-active', totalBalanceActive, false)
	updateFooter('total-passive', totalBalancePassive, false)

	let totalDifference = 0
	if (totalBalanceActive >= totalBalancePassive) {
		totalDifference = totalBalanceActive - totalBalancePassive
		updateFooter('total-active-difference', totalDifference, true)
	} else if (totalBalanceActive < totalBalancePassive) {
		totalDifference = totalBalanceActive - totalBalancePassive
		updateFooter('total-passive-difference', totalDifference, true)
	}
}

const loadingx = document.querySelectorAll('.loadingx')
const loading = document.querySelectorAll('.loading')
const form = document.getElementById('form')
form.addEventListener('submit', event => {
	event.preventDefault()
	
	loadingx.forEach(elem => elem.classList.remove('d-none'))
	loading.forEach(elem => elem.classList.add('d-none'))
	const data = extractFormData(event.currentTarget)
	// console.log(data)
	post_getResultState(data)
})

const extractFormData = form => {
	const formData = new FormData(form)
	return {
		unidad_negocio: Number(formData.get('business')),
		fecha_desde: formData.get('periodStart').split('-').reverse().join('/'),
		fecha_hasta: formData.get('periodEnd').split('-').reverse().join('/'),
		analisis_cuenta: formData.get('cost-center')
	}
}

// Botón Imprimir
const print = document.getElementById('print')
print.onclick = () => {
	const data = extractFormData(form)

	let returnURL = window.location.protocol + '//' + window.location.host + process.env.VarURL + '/Contabilidad/VerEstadoSituacionPatrimonial.html?'
	for (const property in data) {
		returnURL += `${property}=${data[property]}&`
	}
	const fullURL = returnURL + 'tkn=' + tkn
	setTimeout(() => window.open(fullURL, '_blank', 'toolbar=0,location=0,menubar=0,width=1000,height=800'), 1000)
}