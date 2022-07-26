import { getParameter, format_number } from "../../jsgen/Helper"

const get_userData = tkn => {
    const url_getUserData = 'https://www.solucioneserp.net/session/login_sid'
    fetch( url_getUserData , {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const users = resp
        const { estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre, empresaCUIT, empresaDomicilio } = users
        // console.log( estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre, empresaCUIT, empresaDomicilio )
        document.getElementById('name-company').textContent = empresaNombre
        document.getElementById('direction-company').textContent = empresaDomicilio
        document.getElementById('cuit-company').textContent = empresaCUIT
    })
    .catch( err => {
        console.log( 'Error en el llamado a la API: ', err )
    })  
}

const get_boughtVoucher = ( tkn, data ) => {
    const url_boughtVoucher = 'https://www.solucioneserp.net/reportes/consultas/get_comprobante_compra_id'
    fetch( url_boughtVoucher , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        // console.log( resp )
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
    get_userData( tkn )
    get_boughtVoucher( tkn, data )
}

const printInvoice = ({compTipo1, compTipo2, letra, ptoVta, numero, fecha, tipoComprobante, vencimientos, entregaConRemito, unidadNegocio, proveedor, lista, importes, detalle, descuento, adicionales, distContable}) => {
    // console.log( compTipo1, compTipo2, letra, ptoVta, numero, fecha, tipoComprobante, vencimientos, entregaConRemito, unidadNegocio, proveedor, lista, vendedor, importes, detalle, descuento, adicionales, distContable )

    if ( entregaConRemito ) {
        document.getElementById('entrega-remito').classList.remove('d-none')
    }

    document.getElementById('invoice').innerHTML = `${compTipo1.toUpperCase()} (${compTipo2}) ${letra} ${ptoVta}-${invoiceNumber(numero)}`
    document.getElementById('date').innerText = fecha
    const expirationDate = vencimientos[0]
    document.getElementById('expiration').innerText = ( expirationDate === undefined ) ? 'No tiene vencimiento' : expirationDate.fecha
    
    // console.log( proveedor )
    const { nombre, domicilio, cuit, email } = proveedor
    document.getElementById('customer').innerHTML = `<strong>${nombre}</strong>`
    document.getElementById('suite').innerText = domicilio
    document.getElementById('cuit').innerText = cuit
    document.getElementById('email').innerText = email

    // console.log( adicionales )
    document.getElementById('type').innerHTML = 'Tipo: ' + (tipoComprobante === '' ? 'No tiene' : tipoComprobante)

    let { sucursal, deposito, lote, observacion } = adicionales
    document.getElementById('subsidiary').innerText = 'Sucursal: ' + (sucursal === '' ? 'Sin sucursal' : sucursal)
    document.getElementById('deposit').innerText = 'Deposito: ' + (deposito === '' ? 'No tiene' : deposito)
    document.getElementById('batch').innerText = 'Lote: ' + (lote === '' ? 'No tiene' : lote)
    document.getElementById('list').innerText = 'Lista: ' + (lista === '' ? 'No tiene' : lista)
    // document.getElementById('seller').innerHTML = 'Vendedor: ' + `<strong class="real-blue">${vendedor}</strong>`
    document.getElementById('observation').innerText = observacion

    if ( detalle ) {
        for (const element of detalle) {
            printTable(element)
        }
    }

    const discount = descuento[0]
    const importeDescuento = (discount === undefined) ? 0 : discount.importe
    console.log( importeDescuento )
    const { neto, iva, total, noGravado, impuesto1, impuesto2 } = importes
    document.getElementById('subtotal').innerText = format_number(neto + Math.abs(importeDescuento))
    document.getElementById('descuento').innerText = format_number(importeDescuento)
    document.getElementById('neto').innerText = format_number(neto)
    document.getElementById('iva').innerText = format_number(iva)
    document.getElementById('total').innerText = format_number(neto + iva)

    if ( noGravado !== 0 ) {
        document.getElementById('tr-noGravado').classList.remove('d-none')
        document.getElementById('no-gravado').innerText = format_number(noGravado)
    }
    
    if ( impuesto1 !== 0 ) {
        document.getElementById('tr-percepcionIIBB').classList.remove('d-none')
        document.getElementById('percepcion-iibb').innerText = format_number(impuesto1)
    }

    if ( impuesto2 !== 0 ) {
        document.getElementById('tr-impuestosInternos').classList.remove('d-none')
        document.getElementById('impuestos-internos').innerText = format_number(impuesto2)
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
    row_data_3.textContent = cantidad.toFixed(2)

    let row_data_4 = document.createElement('td')
    row_data_4.textContent = format_number(precio)

    let row_data_5 = document.createElement('td')
    row_data_5.textContent = porcIva.toFixed(1)

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