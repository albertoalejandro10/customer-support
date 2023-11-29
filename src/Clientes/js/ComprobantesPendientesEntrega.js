import { getParameter, createCell, clearTable, format_number } from "../../jsgen/Helper"

const textTitleForm = document.getElementById('text-title-form')
const op = Number(getParameter('op'))
const textMap = {
	1: 'Facturas Pendiente de Entrega',
	2: 'Remitos Pendientes de Facturar',
	// puedes agregar más opciones aquí en el futuro
}
textTitleForm.textContent = textMap[op]

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

    if (vouchers.length === 0) {
      printButton.disabled = true
      noVouchers.classList.remove('d-none')
      return
    }

    noVouchers.classList.add('d-none')
    printButton.disabled = false

    clearTable(table, 1)

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
				calculateDelivered += entregado
				calculateInvoiced += facturado
				const row = document.createElement('tr')

				// Si es el primer elemento, agregar id y comprobante con rowspan
				if (index === 0) {
					const dateCell = createCell(fecha)
					dateCell.classList.add('no-hover-table')
					dateCell.setAttribute('rowspan', value.length)
					row.appendChild(dateCell)

					const comprobanteCell = createCell(comprobante)
					comprobanteCell.classList.add('no-hover-table')
					comprobanteCell.setAttribute('rowspan', value.length)
					comprobanteCell.style.borderRight = '0.4px solid #D5D5D5'
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
	return {
		tipo: op === 1 ? 'FAC' : 'REM',
		cliente: formData.get('customers') === null ? '' : formData.get('customers'),
		producto: formData.get('products') === null ? '' : formData.get('products'),
		dfecha: formData.get('periodStart').split('-').reverse().join('/'),
		hfecha: formData.get('periodEnd').split('-').reverse().join('/'),
		desc_prod: formData.get('products') === null ? '' : formData.get('products'),
	}
}