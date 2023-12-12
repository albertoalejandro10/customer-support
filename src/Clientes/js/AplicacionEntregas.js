import { getParameter, createCell, clearTable, format_number, numbersOnly } from "../../jsgen/Helper"

const textTitleForm = document.getElementById('text-title-form')
const op = Number(getParameter('op'))
const textMap = {
	1: 'Detalle de Aplicación de Facturas',
	2: 'Detalle de Aplicación de Remitos',
	3: 'Detalle de Aplicación de Pedidos'
}
textTitleForm.textContent = textMap[op]

//Mueve los valores de la tabla
if (op === 1 || op === 3) {
	let table = document.querySelector("#voucher-table")
	table.rows[0].cells[6].textContent = "Ud. Entregado"
	table.rows[0].cells[5].textContent = "Ud. Facturado"
}

const tkn = getParameter('tkn')
const loader = document.getElementById('loader')
const table = document.getElementById('voucher-table')
const noVouchers = document.getElementById('no-vouchers')

const post_getMovements = async (data) => {
  try {
    loader.classList.remove('d-none')
    const response = await fetch(process.env.Solu_externo + '/reportes/clientes/comprobantes-aplicacion-de-entrega', {
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
    console.log(vouchers)
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

	let totalDelivered = 0
	let totalInvoiced = 0

	Object.entries(vouchers).forEach(([id, value]) => {
		let subtotalDelivered = 0
		let subtotalInvoiced = 0
		if (value.length > 1) {
      value.forEach(({ cliente, comp_orig, comprobante, entregado, facturado, fecha, id, importe, observ, precio, producto }, index) => {
        
				totalDelivered += entregado
				totalInvoiced += facturado

				subtotalDelivered += entregado
				subtotalInvoiced += facturado

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

			voucherTbody.appendChild(createSubTotalRow(subtotalDelivered, subtotalInvoiced))
			
		} else {
			let subtotalDelivered = 0
			let subtotalInvoiced = 0
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

	const row = document.createElement('tr')
	const finalBalanceText = createCell('TOTALES')
	finalBalanceText.classList.add('py-2')
	finalBalanceText.classList.add('font-weight-bold')
	const emptyCell = createCell()
	emptyCell.colSpan = 3
	const finalBalanceDelivered = createCell(format_number(totalDelivered))
	finalBalanceDelivered.classList.add('py-2')
	finalBalanceDelivered.classList.add('text-right')
	finalBalanceDelivered.classList.add('font-weight-bold')
	const finalBalanceInvoiced = createCell(format_number(totalInvoiced))
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

const form = document.getElementById('form')
form.addEventListener('submit', event => {
	event.preventDefault()
	// Consigo la data.
	const data = extractFormData(event.currentTarget)

	console.log( data )
	post_getMovements( data )
})

// Ejecutar boton imprimir, abre nueva ventana.
const printButton = document.getElementById('print')
printButton.onclick = () => {
	const data = extractFormData(form)

	let returnURL = window.location.protocol + '//' + window.location.host + process.env.VarURL + '/Clientes/VerAplicacionEntregas.html?'
	for (const property in data) {
		returnURL += `${property}=${data[property]}&`
	}
	
	const fullURL = returnURL + 'tkn=' + tkn
	setTimeout(() => window.open(fullURL, '_blank', 'toolbar=0,location=0,menubar=0,width=1260,height=800'), 1000)
}

// Function para obtener los datos del formulario.
const extractFormData = form => {
	const formData = new FormData(form)
	const selectedProduct = $("#products").select2('data')[0]
	return {
		tipo: op === 1 ? 'FAC' : op === 3 ? 'PED' : 'REM',
		dfecha: formData.get('periodStart').split('-').reverse().join('/'),
		hfecha: formData.get('periodEnd').split('-').reverse().join('/'),
    cliente: formData.get('customers') === null ? '0' : formData.get('customers'),
    agrupa: formData.get('group') === null ? 0 : 1,
    pendiente: formData.get('pending-payment') === null ? 0 : 1,
    desc_prod: selectedProduct ? selectedProduct.desc_prod : '',
    producto: formData.get('products') === null ? '' : formData.get('products'),
    numero: formData.get('voucher-number') === null ? '' : formData.get('voucher-number')
	}
}

voucherNumber = document.getElementById('voucher-number')
voucherNumber.addEventListener('keyup', () => {
	voucherNumber.value = numbersOnly(voucherNumber.value)
})