import { getParameter, format_number, format_token } from "../../jsgen/Helper"

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
	document.getElementById('date').textContent = `${data.fecha_desde} - ${data.fecha_hasta}`
	const url_postGetResultState = process.env.Solu_externo + '/contabilidad/estado_situacion_patrimonial/obtener'
	fetch( url_postGetResultState , {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		}
	})
	.then( result => result.json() )
	.then( ({ estado_sit_patrimonial }) => {
		// console.log(estado_sit_patrimonial)
		const assetsTable = document.getElementById('assets-tbody')
		const passiveTable = document.getElementById('passive-tbody')

		const assetsArray = estado_sit_patrimonial.filter(assets => assets.ptipo === 'A')
		const passiveArray = estado_sit_patrimonial.filter(passive => passive.ptipo === 'P')

		printTable(assetsTable, assetsArray)
		printTable(passiveTable, passiveArray)

		printFooter(assetsTable, assetsArray)
		printFooter(passiveTable, passiveArray)
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
			document.getElementById('business').textContent = nombre
		}
	})
}

const tkn = getParameter('tkn')
if (tkn) {
	get_userData()
	get_dataFromURL()
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
		throw new Error('Data is not defined or empty')
	}

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

let saldo = 0
const printFooter = (table, balance) => {
	saldo += Number(balance[0].saldo)
	const row = document.createElement('tr')
	row.classList.add('font-weight-bold')
	createAndAppendTd(row, balance[0].nombre)
	createAndAppendTd(row, format_number(balance[0].saldo))

	document.getElementById('balance').textContent = format_number(saldo)
	table.appendChild(row)
}

document.getElementById('print').addEventListener('click', () => {
  try {
    const printContents = document.querySelector('#printableArea').outerHTML
    const originalContents = document.body.innerHTML
    document.body.innerHTML = printContents
    window.print()
    setTimeout(function() {
      document.body.innerHTML = originalContents
    }, 100) // Add a delay of 100 milliseconds before restoring the original content
  } catch (error) {
    console.error('An error occurred while printing:', error)
  }
})