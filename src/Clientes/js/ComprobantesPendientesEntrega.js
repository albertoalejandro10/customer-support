import { getParameter, createCell, clearTable, format_number } from "../../jsgen/Helper"

const textTitleForm = document.getElementById('text-title-form')
const op = Number(getParameter('op'))
const textMap = {
	1: 'Facturas Pendiente de Entrega',
	2: 'Remitos Pendientes de Facturar',
	// puedes agregar más opciones aquí en el futuro
}
textTitleForm.textContent = textMap[op]

//Mueve los valores de la tabla
if (op === 1) {
	let table = document.querySelector("#voucher-table")
	table.rows[0].cells[6].textContent = "Entregado"
	table.rows[0].cells[5].textContent = "Facturado"
}


const tkn = getParameter('tkn')
const loader = document.getElementById('loader')
const table = document.getElementById('voucher-table')
const noVouchers = document.getElementById('no-vouchers')

const post_getMovements = async (data) => {
  try {
    loader.classList.remove('d-none')
    const response = await fetch(process.env.Solu_externo + '/reportes/clientes/get_comprobantes_pendientes_entrega', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
		}
		
		const { comprobantes: vouchers } = await response.json()
    clearTable(table, 1)
    if (vouchers.length === 0) {
      printButton.disabled = true
      noVouchers.classList.remove('d-none')
      return
    }

    noVouchers.classList.add('d-none')
    printButton.disabled = false

    let groupById = vouchers.reduce((r, a) => {
      r[a.id] = [...r[a.id] || [], a]
      return r
		}, {})

    printTable(groupById)
  } catch (err) {
    console.log(err)
    loader.classList.remove('d-none')
  } finally {
    loader.classList.add('d-none')
  }
}

const printTable = vouchers => {
	const voucherTbody = document.getElementById('voucher-tbody')

	let calculateDelivered = 0
	let calculateInvoiced = 0

	Object.entries(vouchers).forEach(([id, value]) => {
		if (value.length > 1) {
			value.forEach(({ cliente, comp_orig, comprobante, entregado, facturado, fecha, id, importe, observ, precio, producto }, index) => {
				/* if (op === 1) {
					let table = document.querySelector("#voucher-table")
					table.rows[0].cells[6].textContent = "Entregado"
					table.rows[0].cells[5].textContent = "Facturado"
				} */
				calculateDelivered += entregado
				calculateInvoiced += facturado
				const row = document.createElement('tr')
				
				// Si es el primer elemento, agregar id y comprobante con rowspan
				if (index === 0) {
					const dateCell = createCell(fecha)
					dateCell.classList.add('no-hover-table')
					dateCell.setAttribute('rowspan', value.length)
					dateCell.style.verticalAlign = 'top'
					dateCell.style.borderBottom = '0.4px solid #808080'
					row.appendChild(dateCell)
					
					const comprobanteCell = createCell(comprobante)
					comprobanteCell.classList.add('no-hover-table')
					comprobanteCell.setAttribute('rowspan', value.length)
					comprobanteCell.style.verticalAlign = 'top'
					comprobanteCell.style.borderBottom = '0.4px solid #808080'
					row.appendChild(comprobanteCell)
					
					const customerCell = createCell(cliente)
					customerCell.classList.add('no-hover-table')
					customerCell.setAttribute('rowspan', value.length)
					customerCell.style.verticalAlign = 'top'
					customerCell.style.borderRight = '0.4px solid #D5D5D5'
					customerCell.style.borderBottom = '0.4px solid #808080'
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
		} else {
			value.forEach(({ cliente, comp_orig, comprobante, entregado, facturado, fecha, id, importe, observ, precio, producto }, index) => {
				/* if (op === 1) {
					let table = document.querySelector("#voucher-table")
					table.rows[0].cells[6].textContent = "Entregado"
					table.rows[0].cells[5].textContent = "Facturado"
				} */
				calculateDelivered += entregado
				calculateInvoiced += facturado
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
		}
	})

	const row = document.createElement('tr')
	const finalBalanceText = createCell('Totales')
	finalBalanceText.classList.add('py-2')
	finalBalanceText.classList.add('font-weight-bold')
	const emptyCell = createCell()
	emptyCell.colSpan = 3
	const finalBalanceDelivered = createCell(format_number(calculateDelivered))
	finalBalanceDelivered.classList.add('py-2')
	finalBalanceDelivered.classList.add('text-right')
	finalBalanceDelivered.classList.add('font-weight-bold')
	const finalBalanceInvoiced = createCell(format_number(calculateInvoiced))
	finalBalanceInvoiced.classList.add('py-2')
	finalBalanceInvoiced.classList.add('text-right')
	finalBalanceInvoiced.classList.add('font-weight-bold')
	row.append(
		createCell(),
		finalBalanceText,
		emptyCell,
		finalBalanceDelivered,
		finalBalanceInvoiced
	)
	voucherTbody.appendChild(row)
}

const form = document.getElementById('form')
form.addEventListener('submit', event => {
	event.preventDefault()
	// Consigo la data.
	const data = extractFormData(event.currentTarget)

	// console.log( data )
	post_getMovements( data )
})

// Ejecutar boton imprimir, abre nueva ventana.
const printButton = document.getElementById('print')
printButton.onclick = () => {
	const data = extractFormData(form)

	let returnURL = window.location.protocol + '//' + window.location.host + process.env.VarURL + '/Clientes/VerComprobantesPendientesEntrega.html?'
	for (const property in data) {
		returnURL += `${property}=${data[property]}&`
	}
	const fullURL = returnURL + 'tkn=' + tkn
	setTimeout(() => window.open(fullURL, '_blank', 'toolbar=0,location=0,menubar=0,width=1260,height=800'), 1000)
}

// Function para obtener los datos del formulario.
const extractFormData = form => {
	const formData = new FormData(form)
	const selectedProduct = $("#products").select2('data')[0];
	return {
		tipo: op === 1 ? 'FAC' : 'REM',
		cliente: formData.get('customers') === null ? '0' : formData.get('customers'),
		producto: formData.get('products') === null && ' ' ? '' : formData.get('products'),
		dfecha: formData.get('periodStart').split('-').reverse().join('/'),
		hfecha: formData.get('periodEnd').split('-').reverse().join('/'),
    desc_prod: selectedProduct ? selectedProduct.desc_prod : '',
	}
}