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
	document.getElementById('date').textContent = `${data.dfecha} - ${data.hfecha}`
	printHeader(data)
	post_getlistDetails(data)
}

const post_getlistDetails = data => {
	const url_postListDetails = process.env.Solu_externo + '/bancosyvalores/librobanco/listar_detalles'
	fetch( url_postListDetails , {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${tkn}`
		}
	})
	.then( details => details.json() )
	.then( ({ registros }) => {
		let saldo = 0
		registros = registros.map(obj => {
			saldo += obj.importe
			return {
				...obj,
				saldo
			}
		})
		// console.log(registros)
		printTable(registros)
	})
	.catch( err => {
		console.log( err )
	})
}

const printHeader = ({ unidad_negocio, cuenta }) => {
  const fetchUnidadesNegocio = fetch(process.env.Solu_externo + '/listados/get_unidades_negocio', {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${tkn}`}
  })
	.then(business => business.json())
	.then(business => {
		const result = business.filter(x => x.id === Number(unidad_negocio))
		if (result?.length) {
			const [{ nombre }] = result
			document.getElementById('business').textContent = nombre
		}
	})

  const fetchCuentas = fetch(process.env.Solu_externo + '/bancosyvalores/librobanco/get_cuentas', {
    method: 'GET',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${tkn}`}
  })
	.then(accounts => accounts.json())
	.then(({ cuentas }) => {
		const result = cuentas.filter(x => x.codigo === Number(cuenta))
		if (result?.length) {
			const [{ banco }] = result
			document.getElementById('account').textContent = banco
		}
	})

  Promise.all([fetchUnidadesNegocio, fetchCuentas])
	.catch(error => {
		// Manejar el error si ocurre alguno durante las peticiones fetch
		console.error('Error:', error)
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
const printTable = data => {
	// console.log(data)
	const table = document.getElementById('full-table')
	if (!table) {
		throw new Error('Table element is not defined')
	}
	if (!data || data.length === 0) {
		throw new Error('Data is not defined or empty')
	}
	const finalSaldo = data[data.length - 1].saldo
	data.forEach(({ fecha, operacion, numero, detalle, importe, saldo, consilidado }) => {
    // console.log(fecha, fecha, operacion, numero, detalle, importe, saldo, consilidado)
    const row = document.createElement('tr')

		createAndAppendTd(row, fecha)
		createAndAppendTd(row, operacion)
		createAndAppendTd(row, numero)
		createAndAppendTd(row, detalle.slice(0, 30))
		createAndAppendTd(row, format_number(importe))
		createAndAppendTd(row, format_number(saldo))
		createAndAppendTd(row, consilidado)

		table.appendChild(row)
	})

	// Ultima fila
	const row = document.createElement('tr')
	row.classList.add('font-weight-bold')
	const row_empty_data = createAndAppendTd(row, '')
	row_empty_data.colSpan = 3
	const row_total = createAndAppendTd(row, 'Totales')
	row_total.colSpan = 2
	createAndAppendTd(row, format_number(finalSaldo))
	createAndAppendTd(row, '')
	
	table.appendChild(row)
}

// Imprimir pdf
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