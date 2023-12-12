import { getParameter, format_number, createCell } from "../../jsgen/Helper"

const getOpParameter = getParameter('tipo')
const op = getOpParameter === 'FAC' ? 1 : getOpParameter === 'PED' ? 3 : 2

// Mueve los valores de la tabla
if (op === 1 || op === 3) {
	let table = document.querySelector("#voucher-table")
	table.rows[1].cells[6].textContent = "UD. ENTREGADO"
	table.rows[1].cells[5].textContent = "UD. FACTURADO"
}

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

const post_getMovements = async data => {
	try {
		const response = await fetch(process.env.Solu_externo + '/reportes/clientes/comprobantes-aplicacion-de-entrega', {
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
	document.getElementById('view-title').textContent = data.tipo === 'FAC' ? 'Detalle de Aplicación de Facturas' : data.tipo === 'PED' ? 'Detalle de Aplicación de Pedidos' : 'Detalle de Aplicación de Remitos'
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

	let totalDelivered = 0
	let totalInvoiced = 0

	Object.entries(vouchers).forEach(([id, value]) => {
		let subtotalDelivered = 0
		let subtotalInvoiced = 0
		if (value.length > 1) {
			let subtotalDelivered = 0
			let subtotalInvoiced = 0
			value.forEach(({ cliente, comp_orig, comprobante, entregado, facturado, fecha, id, importe, observ, precio, producto }, index) => {

				totalDelivered += entregado
				totalInvoiced += facturado

				subtotalDelivered += entregado
				subtotalInvoiced += facturado
				const row = document.createElement('tr')

				// Si es el primer elemento, agregar id y comprobante con rowspan
				if (index === 0) {
					const dateCell = createCell(fecha)
					dateCell.setAttribute('rowspan', value.length)
					dateCell.style.borderBottom = '0.4px solid #808080'
					row.appendChild(dateCell)

					const comprobanteCell = createCell(comprobante)
					comprobanteCell.setAttribute('rowspan', value.length)
					comprobanteCell.style.borderBottom = '0.4px solid #808080'
					row.appendChild(comprobanteCell)

					const customerCell = createCell(cliente)
					customerCell.setAttribute('rowspan', value.length)
					customerCell.style.borderBottom = '0.4px solid #808080'
					customerCell.style.borderRight = '0.4px solid #D5D5D5'
					row.appendChild(customerCell)
				}

				const productCell = createCell(producto)
				const priceCell = createCell(format_number(precio))
				const deliveredCell = createCell(format_number(entregado))
				const invoicedCell = createCell(format_number(facturado))
				if (index === value.length - 1) {
					productCell.style.borderBottom = '0.4px solid #808080'
					priceCell.style.borderBottom = '0.4px solid #808080'
					deliveredCell.style.borderBottom = '0.4px solid #808080'
					invoicedCell.style.borderBottom = '0.4px solid #808080'
				}

				priceCell.classList.add('text-right')
				deliveredCell.classList.add('text-right')
				invoicedCell.classList.add('text-right')

				row.append(
					productCell,
					priceCell,
					deliveredCell,
					invoicedCell
				)
				voucherTbody.appendChild(row)
			})
			voucherTbody.appendChild(createSubTotalRow(subtotalDelivered, subtotalInvoiced))
		} else {
			value.forEach(({ cliente, comp_orig, comprobante, entregado, facturado, fecha, id, importe, observ, precio, producto }, index) => {
				
				subtotalDelivered += entregado
				subtotalInvoiced += facturado

				totalDelivered += entregado
				totalInvoiced += facturado
				const row = document.createElement('tr')
				const cells = [
					createCell(fecha),
					createCell(comprobante),
					createCell(cliente),
					createCell(producto),
					createCell(format_number(precio)),
					createCell(format_number(entregado)),
					createCell(format_number(facturado)),
				]
				cells.forEach(cell => {
					cell.style.borderBottom = '0.4px solid #808080'
				})
				row.append(...cells)
				voucherTbody.appendChild(row)
			})
			voucherTbody.appendChild(createSubTotalRow(subtotalDelivered, subtotalInvoiced))
		}
	})
	document.getElementById('balanceDelivered').textContent = format_number(totalDelivered)
	document.getElementById('balanceInvoiced').textContent = format_number(totalInvoiced)
}

const createSubTotalRow = (delivered, invoiced) => {
	const row = document.createElement('tr')
	const subTotalText = createCell('Subtotal')
	subTotalText.classList.add('font-weight-bold')
	const emptyCell = createCell()
	emptyCell.colSpan = 3
	const subTotalDelivered = createCell(format_number(delivered))
	subTotalDelivered.classList.add('text-right')
	subTotalDelivered.classList.add('font-weight-bold')
	const subTotalInvoiced = createCell(format_number(invoiced))
	subTotalInvoiced.classList.add('text-right')
	subTotalInvoiced.classList.add('font-weight-bold')
	const cells = [
		createCell(),
		subTotalText,
		emptyCell,
		subTotalDelivered,
		subTotalInvoiced
	]
	cells.forEach(cell => {
		cell.style.borderBottom = '0.4px solid #808080'
	})
	row.append(...cells)
	return row
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