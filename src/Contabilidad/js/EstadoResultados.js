import { getParameter, format_number, format_token } from "../../jsgen/Helper"

const tkn = getParameter('tkn')
const post_getResultState = data => {
	fetch( process.env.Solu_externo + '/contabilidad/estado_resultado/obtener' , {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		}
	})
	.then( result => result.json() )
	.then( ({estado_resultado}) => {
		// console.log(estado_resultado)
		const incomeTable = document.getElementById('income-tbody')
		const expensesTable = document.getElementById('expenses-tbody')
		cleanTables(incomeTable)
		cleanTables(expensesTable)

		const incomeArray = estado_resultado.filter(income => income.ptipo === 'I')
		const expensesArray = estado_resultado.filter(expenses => expenses.ptipo === 'G')

		const income = organizeAndFilter(incomeArray)
		const expenses = organizeAndFilter(expensesArray)
		printTable(incomeTable, income)
		printTable(expensesTable, expenses)

		printFooter(incomeArray, expensesArray)

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

const organizeAndFilter = organizeArrangement => {
	// Organizar arreglos dependiendo de ingresos y egresos
  const levelOneExpenses = organizeArrangement.filter(item => item.codigo.trim().length === 1)
  const levelTwoExpenses = organizeArrangement.filter(item => item.codigo.trim().length === 2)
  const levelFourExpenses = organizeArrangement.filter(item => item.codigo.trim().length === 5)

  levelOneExpenses.sort((a, b) => a.codigo.trim() - b.codigo.trim())
  levelTwoExpenses.sort((a, b) => a.codigo.trim() - b.codigo.trim())
  levelFourExpenses.sort((a, b) => a.codigo.trim() - b.codigo.trim())

  const arr = levelTwoExpenses.map(item => levelFourExpenses.filter(subItem => subItem.codigo.startsWith(item.codigo.trim())))

  for (const [index, element] of arr.entries()) {
    element.unshift(levelTwoExpenses[index])
	}
	// console.log(arr)
  return arr
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
	data.forEach(item => {
		for (const { codigo, nombre, saldo_anterior, saldo, linkMayorCuentas } of item) {
			const row = document.createElement('tr')

			// Create 'td' elements and append to 'tr'
			const row_data_1 = createAndAppendTd(row, nombre)
			const row_data_2 = createAndAppendTd(row, format_number(saldo_anterior))
			const row_data_3 = createAndAppendTd(row, format_number(saldo))

			// Add specific classes and attributes based on conditions
			const anchor = document.createElement('a')
			if (codigo.trim().length === 2) {
				row_data_1.classList.add('font-weight-bold')
				row_data_2.classList.add('font-weight-bold')
				row_data_3.classList.add('font-weight-bold')
			} else {
				anchor.setAttribute('href', format_token(linkMayorCuentas))
				anchor.textContent = nombre
				row_data_1.textContent = ''
				row_data_1.appendChild(anchor)
				row_data_1.classList.add('pl-4')
			}
			// Append 'tr' to table
			table.appendChild(row)
		}
	})
}

const printFooter = (income, expenses) => {
	let differencePreviousBalance = 0
	const previousBalanceIncome = income[0].saldo_anterior
	const totalBalanceIncome = income[0].saldo_total

	const previousBalanceExpenses = expenses[0].saldo_anterior
	const totalBalanceExpenses = expenses[0].saldo_total

	if ( previousBalanceIncome >= previousBalanceExpenses ) {
		differencePreviousBalance = previousBalanceIncome - previousBalanceExpenses
	} else {
		differencePreviousBalance = previousBalanceExpenses - previousBalanceIncome
	}

	document.getElementById('total-previous-income').textContent   = format_number(previousBalanceIncome)
	document.getElementById('total-previous-expenses').textContent = format_number(previousBalanceExpenses)

	document.getElementById('total-income').textContent   = format_number(totalBalanceIncome)
	document.getElementById('total-expenses').textContent = format_number(totalBalanceExpenses)

	document.getElementById('total-previous-difference').textContent = format_number(differencePreviousBalance)
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

	let returnURL = window.location.protocol + '//' + window.location.host + process.env.VarURL + '/Contabilidad/VerEstadoResultados.html?'
	for (const property in data) {
		returnURL += `${property}=${data[property]}&`
	}
	const fullURL = returnURL + 'tkn=' + tkn
	setTimeout(() => window.open(fullURL, '_blank', 'toolbar=0,location=0,menubar=0,width=1000,height=800'), 1000)
}