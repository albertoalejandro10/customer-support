import * as bootstrap from 'bootstrap'

const checkboxExpiration = document.getElementById('checkboxExpiration')
checkboxExpiration.addEventListener('change', event => {
    const expiration = document.getElementById('expiration')
    if ( event.currentTarget.checked ) {
        expiration.required = true
        expiration.disabled = false
    } else {
        expiration.disabled = true
        expiration.required = false
    }
})

document.querySelectorAll('input').forEach(element => {
    element.addEventListener('change', () => {
        update.disabled = false
    })
})

document.querySelectorAll('select').forEach(element => {
    element.addEventListener('change', () => {
        update.disabled = false
    })
})

const get_pendingCharges = (tkn, data) => {
    const url_getPendingCharges = 'https://www.solucioneserp.net/reportes/clientes/get_comprobantes_pendientes_cobro'
    fetch( url_getPendingCharges , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( ({ linea }) => {

        // Eliminar filas viejas
        const tbody = document.getElementById('tbody')
        const elements = document.getElementsByClassName('delete-row')
        if ( tbody.children.length >= 1) {
            while (elements.length > 0) elements[0].remove()
            let importe = document.getElementById('importeTotal')
            importe.textContent = ''
        }

        for (const element of linea) {
            const { id, comprobante, fecha, codigoCliente, nombre, total, estado, debe, pendiente, cuit, vencimiento, observacion, sucursal, vencimientoOrden, cantidad, conProforma, telefono, tipoCliente, grupoCliente, moneda, importeNeto, importeIva, importeNoGravado, importePercepcion, tipoProducto, linkComprobante, linkAdjuntos } = element
            // console.log( id, vencimiento, fecha, comprobante, nombre, observacion, linkComprobante, linkAdjuntos, importeNeto, pendiente )

            // Imprimir datos en la tabla
            let row = document.createElement('tr')
            row.className = 'delete-row'

            let row_data_1 = document.createElement('td')
            row_data_1.textContent = `${ vencimiento }`

            let row_data_2 = document.createElement('td')
            row_data_2.textContent = `${fecha}`

            let row_data_3 = document.createElement('td')
            let row_data_3_anchor = document.createElement('a')
            row_data_3_anchor.href = `${linkComprobante}`
            row_data_3_anchor.textContent = `${comprobante}`
            row_data_3.appendChild(row_data_3_anchor)

            let row_data_4 = document.createElement('td')
            row_data_4.textContent = `${nombre}`

            let row_data_5 = document.createElement('td')
            row_data_5.textContent = `${observacion}`

            let row_data_6 = document.createElement('td')
            let row_data_6_anchor = document.createElement('a')
            row_data_6_anchor.href = `${linkAdjuntos}`
            row_data_6_anchor.innerHTML = '<i class="fa-solid fa-folder"></i>'
            row_data_6.appendChild(row_data_6_anchor)

            let row_data_7 = document.createElement('td')
            row_data_7.textContent = `${format_number(importeNeto)}`

            let row_data_8 = document.createElement('td')
            row_data_8.textContent = `${format_number(pendiente)}`
            
            row.appendChild(row_data_1)
            row.appendChild(row_data_2)
            row.appendChild(row_data_3)
            row.appendChild(row_data_4)
            row.appendChild(row_data_5)
            row.appendChild(row_data_6)
            row.appendChild(row_data_7)
            row.appendChild(row_data_8)
            
            tbody.appendChild(row)

            // Calcular e imprimir importeTotal
            calcularImporteTotal( pendiente )
            let importe = document.querySelector('#importeTotal')
            importe.textContent = importeTotal.toFixed(2) 
        }
        importeTotal = 0
    })
    .catch( err => {
        console.log( err )
    })
}

const format_number = importeNeto => {
    const localeCurrency = Intl.NumberFormat('en-US')
    let importe = localeCurrency.format(importeNeto)
    const char = '.'
    if ( ! importe.includes(char) ) {
        importe = importe + '.00'
    }
    const onlyOneDecimal = importe.slice('-2')
    if ( onlyOneDecimal.includes(char) ) {
        importe = importe + '0'
    }
    return importe
}

// Calcular importe total
let importeTotal = 0
const calcularImporteTotal = importe => {
    importeTotal += importe
    return importeTotal
}

// Conseguir parametros del URL
export const getParameter = parameterName => {
    const parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}
    
const tkn = getParameter('tkn')
const update = document.getElementById('update')

const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const business = Number(formData.get('business'))
    const periodStart = formData.get('periodStart').split('-').reverse().join('/')
    const periodEnd = formData.get('periodEnd').split('-').reverse().join('/')
    const expirationCheckbox = formData.get('expirationCheckbox')
    const expiration = get_expirationDate(formData.get('expiration'))
    const status = formData.get('status')
    const customer = formData.get('customer')
    const coin = formData.get('coin')
    const platform = formData.get('platform')

    const data = {
        "idUnidadNegocio": business,
        "fechaDesde": periodStart,
        "fechaHasta": periodEnd,
        "hastaFechaVencimiento": 0,
        "fechaVencimiento": expiration,
        "cuentaEstado": status,
        "codigoCliente": customer,
        "idMoneda": coin,
        "incluirProformas": 0,
        "incluirRemitos": 0
    }

    get_pendingCharges( tkn, data )
    update.disabled = true
})

const get_expirationDate = expirationValue => {
    let expiration
    if ( expirationValue ) {
        expiration = expirationValue.split('-').reverse().join('/')
    } else {
        expiration = ""
    }
    return expiration
}