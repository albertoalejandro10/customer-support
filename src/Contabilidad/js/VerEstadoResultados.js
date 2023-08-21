import { getParameter, format_number } from "../../jsgen/Helper"

const get_userData = () => {
	const url_getUserData = process.env.Solu_externo + '/session/login_sid'
	fetch( url_getUserData , {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		}
	})
	.then( user => user.json() )
	.then( ({ empresaNombre, empresaCUIT }) => {
		// console.log( estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre )
		document.getElementById('name-company').textContent = empresaNombre
		document.getElementById('cuit-company').textContent = empresaCUIT
	})
	.catch( err => {
		console.log( 'Error en el llamado a la API: ', err )
	})
}

const get_dataFromURL = () => {
	const data = window.location.search.substring(1).split('&').reduce((acc, element) => {
		const [ property, value ] = element.split('=')
		acc[property] = value
		return acc
	}, {})
	// console.log(data)
	printHeader(data.unidad_negocio)
	post_getResultState(data)
}

const post_getResultState = data => {
	const url_postGetResultState = process.env.Solu_externo + '/contabilidad/estado_resultado/obtener'
	fetch( url_postGetResultState , {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		}
	})
	.then( result => result.json() )
	.then( ({ estado_resultado }) => {
		// console.log(estado_resultado)
		document.getElementById('date').textContent = `${data.fecha_desde} - ${data.fecha_hasta}`
		const incomeTable = document.getElementById('income-tbody')
		const expensesTable = document.getElementById('expenses-tbody')

		const incomeArray = estado_resultado.filter(income => income.ptipo === 'I')
		const expensesArray = estado_resultado.filter(expenses => expenses.ptipo === 'G')

		const income = organizeAndFilter(incomeArray)
		const expenses = organizeAndFilter(expensesArray)

		printTable(incomeTable, income)
		printTable(expensesTable, expenses)

		printFooter(incomeTable, incomeArray)
		printFooter(expensesTable, expensesArray)
	})
	.catch( err => {
		console.log( err )
	})
}

const printHeader = idBusiness => {
	fetch( process.env.Solu_externo + '/listados/get_unidades_negocio', {
		method: 'GET',
		headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${tkn}`}
	})
	.then( business => business.json() )
	.then( business => {
		const result = business.filter(x => x.id === Number(idBusiness))
		if ( result?.length ) {
			const [{nombre}] = result
			document.getElementById('business').innerHTML = `<strong class="real-blue">${nombre}</strong>`
		}
	})
}

const tkn = getParameter('tkn')
if (tkn) {
	get_userData()
	get_dataFromURL()
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

// Helper function to create 'td' and append to 'tr'
const createAndAppendTd = (parent, content) => {
	const td = document.createElement('td')
	td.textContent = content
	parent.appendChild(td)
	return td
}

// Main function to print data into a table
const printTable = (table, data) => {
	// console.log(data)
	if (!table) {
		throw new Error('Table element is not defined')
	}
	if (!data || data.length === 0) {
		throw new Error('Data is not defined or empty')
	}
	data.forEach(item => {
		for (const { codigo, nombre, saldo, linkMayorCuentas } of item) {
			const row = document.createElement('tr')

			const row_data_1 = createAndAppendTd(row, nombre)
			const row_data_2 = createAndAppendTd(row, format_number(saldo))

			const anchor = document.createElement('a')
			if (codigo.trim().length === 2) {
				row_data_1.classList.add('font-weight-bold')
				row_data_2.classList.add('font-weight-bold')
			} else {
				anchor.setAttribute('href', linkMayorCuentas)
				anchor.textContent = nombre
				row_data_1.textContent = ''
				row_data_1.appendChild(anchor)
				row_data_1.classList.add('pl-4')
			}
			table.appendChild(row)
		}
	})
}

let saldo = 0
const printFooter = (table, balance) => {
	saldo += Math.abs(Number(balance[0].saldo))
	const row = document.createElement('tr')
	row.classList.add('font-weight-bold')
	createAndAppendTd(row, balance[0].nombre)
	createAndAppendTd(row, format_number(balance[0].saldo))

	document.getElementById('balance').textContent = format_number(saldo)

	table.appendChild(row)
}

document.getElementById('print').onclick = () => {
	const printContents = document.getElementById('printableArea').innerHTML
	const originalContents = document.body.innerHTML
	document.body.innerHTML = printContents
	window.print()
	document.body.innerHTML = originalContents
}