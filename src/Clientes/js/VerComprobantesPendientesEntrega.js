import { getParameter, format_number, createCell } from "../../jsgen/Helper"

const get_userData = async () => {
	try {
		const response = await fetch(process.env.Solu_externo + '/session/login_sid', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${tkn}`
			}
		})
		const user = await response.json()
		document.getElementById('name-company').textContent = user.empresaNombre
		document.getElementById('cuit-company').textContent = user.empresaCUIT
	} catch (err) {
		console.log('Error en el llamado a la API: ', err)
	}
}

const post_getMovements = async (data) => {
	try {
		const response = await fetch(process.env.Solu_externo + '/reportes/clientes/get_comprobantes_pendientes_entrega', {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${tkn}`
			}
		})
		const {comprobantes: vouchers} = await response.json()
		let groupById = vouchers.reduce((r, a) => {
			r[a.id] = [...r[a.id] || [], a]
			return r
		}, {})
		printTable(groupById)
	} catch (err) {
		console.log(err)
	}
}

const get_dataFromURL = async () => {
	const data = window.location.search.substring(1).split('&').reduce((acc, element) => {
		const [ property, value ] = element.split('=')
		acc[property] = value
		return acc
	}, {})
	document.getElementById('view-title').textContent = data.tipo === 'FAC' ? 'Facturas Pendiente de Entrega' : 'Remitos Pendientes de Facturar'
	document.getElementById('date').textContent = `${data.dfecha} - ${data.hfecha}`
	await post_getMovements(data)
}

const tkn = getParameter('tkn')
if (tkn) {
	Promise.all([get_userData(), get_dataFromURL()])
		// .then(() => console.log('Todas las solicitudes se completaron con éxito'))
		.catch(err => console.log('Hubo un error en alguna de las solicitudes: ', err))
}

const printTable = vouchers => {
	const voucherTbody = document.getElementById('voucher-tbody')

	let calculateDelivered = 0
	let calculateInvoiced = 0

	Object.entries(vouchers).forEach(([id, value]) => {
		if (value.length > 1) {
			value.forEach(({ cliente, comp_orig, comprobante, entregado, facturado, fecha, id, importe, observ, precio, producto }, index) => {
				calculateDelivered += entregado
				calculateInvoiced += facturado
				const row = document.createElement('tr')

				// Si es el primer elemento, agregar id y comprobante con rowspan
				if (index === 0) {
					const dateCell = createCell(fecha)
					dateCell.classList.add('no-hover-table')
					dateCell.setAttribute('rowspan', value.length)
					dateCell.style.verticalAlign = 'middle'
					row.appendChild(dateCell)

					const comprobanteCell = createCell(comprobante)
					comprobanteCell.classList.add('no-hover-table')
					comprobanteCell.setAttribute('rowspan', value.length)
					comprobanteCell.style.borderRight = '0.4px solid #D5D5D5'
					comprobanteCell.style.verticalAlign = 'middle'
					row.appendChild(comprobanteCell)
				}

				const price = createCell(format_number(precio))
				price.classList.add('text-right')
				const delivered = createCell(format_number(entregado))
				delivered.classList.add('text-right')
				const invoiced = createCell(format_number(facturado))
				invoiced.classList.add('text-right')

				row.append(
					createCell(cliente),
					createCell(producto),
					price,
					delivered,
					invoiced
				)
				voucherTbody.appendChild(row)
			})
		} else {
			value.forEach(({ cliente, comp_orig, comprobante, entregado, facturado, fecha, id, importe, observ, precio, producto }, index) => {
				calculateDelivered += entregado
				calculateInvoiced += facturado
				const row = document.createElement('tr')
				row.append(
					createCell(fecha),
					createCell(comprobante),
					createCell(cliente),
					createCell(producto),
					createCell(format_number(precio)),
					createCell(format_number(entregado)),
					createCell(format_number(facturado)),
				)
				voucherTbody.appendChild(row)
			})
		}
	})
	document.getElementById('balanceDelivered').textContent = format_number(calculateDelivered)
	document.getElementById('balanceInvoiced').textContent = format_number(calculateInvoiced)
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