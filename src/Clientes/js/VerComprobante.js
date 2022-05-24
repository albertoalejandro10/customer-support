import { getParameter, format_number } from "../../jsgen/Helper"

const get_salesReceipts = ( tkn, data ) => {
    const url_salesReceipts = 'https://www.solucioneserp.net/reportes/consultas/get_comprobante_venta_id'
    fetch( url_salesReceipts , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        printInvoice( resp )
    })
    .catch( err => {
        console.log( err )
    })
}

const id = getParameter('id')
const tkn = getParameter('tkn')
if ( id && tkn ) {
    const data = {
        id
    }
    get_salesReceipts( tkn, data )
}

const printInvoice = ({compTipo1, compTipo2, letra, ptoVta, numero, fecha, tipoComprobante, vencimientos, entregaConRemito, unidadNegocio, cliente, lista, vendedor, importes, detalle, descuento, adicionales, distContable}) => {
    // console.log( compTipo1, compTipo2, letra, ptoVta, numero, fecha, tipoComprobante, vencimientos, entregaConRemito, unidadNegocio, cliente, lista, vendedor, importes, detalle, descuento, adicionales, distContable )

    if ( entregaConRemito ) {
        document.getElementById('entrega-remito').classList.remove('d-none')
    }

    document.getElementById('invoice').innerHTML = `<span class="invoice-span">${compTipo1} (${compTipo2}) </span> ${letra} ${ptoVta}-${invoiceNumber(numero)}`
    document.getElementById('date').innerText = fecha
    const [ expiry ] = vencimientos
    document.getElementById('expiration').innerText = expiry.fecha
    
    // console.log( cliente )
    const { nombre, domicilio, cuit, email } = cliente
    document.getElementById('customer').innerText = nombre
    document.getElementById('suite').innerText = domicilio
    document.getElementById('cuit').innerText = cuit
    document.getElementById('email').innerText = email
    
    // console.log( adicionales )
    document.getElementById('type').innerHTML = 'Tipo: ' + `<strong class="real-blue">${tipoComprobante}</strong>`
    const { sucursal, deposito,  lote, observacion } = adicionales
    document.getElementById('subsidiary').innerText = 'Sucursal: ' + sucursal
    document.getElementById('deposit').innerText = 'Deposito: ' + deposito
    document.getElementById('batch').innerText = 'Lote: ' + lote
    document.getElementById('list').innerText = 'Lista: ' + lista
    document.getElementById('seller').innerHTML = 'Vendedor: ' + `<strong class="real-blue">${vendedor}</strong>`
    document.getElementById('observation').innerText = 'Observación: ' + observacion

    for (const element of detalle) {
        printTable(element)
    }

    const [ discount ] = descuento
    document.getElementById('subtotal').innerText = format_number(importes.neto)
    document.getElementById('descuento').innerText = format_number(discount.importe)
    document.getElementById('neto').innerText = format_number(importes.neto)
    document.getElementById('iva').innerText = format_number(importes.iva)
    document.getElementById('total').innerText = format_number(importes.total)

    if ( ! importes.noGravado === 0 ) {
        document.getElementById('tr-noGravado').classList.remove('d-none')
        document.getElementById('no-gravado').innerText = format_number(importes.noGravado)
    }
    
    if ( ! importes.impuesto1 === 0 ) {
        document.getElementById('tr-percepcionIIBB').classList.remove('d-none')
        document.getElementById('percepcion-iibb').innerText = format_number(importes.impuesto1)
    }

    if ( ! importes.impuesto2 === 0 ) {
        document.getElementById('tr-impuestosInternos').classList.remove('d-none')
        document.getElementById('impuestos-internos').innerText = format_number(importes.impuesto2)
    }
}

// Imprimir datos en la tabla
const printTable = ({ codigo, cantidad, unidad, detalle, precio, porcIva, noGravado, importe }) => {
    let row = document.createElement('tr')

    let row_data_1 = document.createElement('td')
    row_data_1.innerHTML = `<strong>${detalle}</strong> (${codigo})`

    let row_data_2 = document.createElement('td')
    row_data_2.textContent = unidad

    let row_data_3 = document.createElement('td')
    row_data_3.textContent = cantidad

    let row_data_4 = document.createElement('td')
    row_data_4.textContent = format_number(precio)

    let row_data_5 = document.createElement('td')
    row_data_5.textContent = porcIva

    let row_data_6 = document.createElement('td')
    row_data_6.textContent = format_number(importe)
    
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    
    document.getElementById('tbody-table').appendChild(row)
}

const invoiceNumber = number => {
    return number.toString().padStart(8, 0)
}