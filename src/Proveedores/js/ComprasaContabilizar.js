import { getParameter, format_number, format_token } from "../../jsgen/Helper"

// *Conseguir ventas por contabilizar
const post_getPendingPurchases = tkn => {
    document.getElementById('loader').classList.remove('d-none')
    const url_getPendingPurchases = process.env.Solu_externo + '/formularios/proveedores/get_compras_pendientes_contabilizar'
    fetch( url_getPendingPurchases , {
        method: 'POST',
        body: JSON.stringify({}),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        // Eliminar tablas previas
        clearTable('purchases-table')
        clearTable('info-table')

        if ( ! resp.length ) {
            document.getElementById('not-purchases').classList.remove('d-none')
            return
        }
        
        const arrDebits = [
            {neto: 0},
            {iva: 0},
            {retencion: 0},
            {noGravado: 0},
            {total: 0}
        ]
        const arrCredits = structuredClone(arrDebits)
        for (const element of resp) {
            printElementTables(element)
            const { debe, neto, iva, retencion, noGravado, total } = element
            if ( debe ) {
                arrCredits[0].neto += neto
                arrCredits[1].iva += iva
                arrCredits[2].retencion += retencion
                arrCredits[3].noGravado += noGravado
                arrCredits[4].total += total
            } else {
                arrDebits[0].neto += neto
                arrDebits[1].iva += iva
                arrDebits[2].retencion += retencion
                arrDebits[3].noGravado += noGravado
                arrDebits[4].total += total
            }
        }

        printElementInfoTables(arrDebits, arrCredits)
        document.getElementById('loader').classList.add('d-none')
    })
    .catch( err => {
        handleError( err )
    })
}

const handleError = err => {
    console.log( err )
    document.getElementById('loader').classList.add('d-none')
    document.getElementById('not-sales').classList.remove('d-none')
}

const clearTable = tableId => {
    let table = document.getElementById(tableId)
    let rowCount = table.rows.length
    while (--rowCount) {
        table.deleteRow(rowCount)
    }
}

// *Imprimir datos en la primera tabla
const printElementTables = ({id, numInterno, fecha, comprobante, linkComprobante, nombre, total}) => {
    const row = document.createElement('tr')
    row.className = 'delete-row'

    const row_data_1 = document.createElement('td')
    row_data_1.innerHTML = `<input type="checkbox" name='checkbox-${id}' id='${id}'>`

    const row_data_2 = document.createElement('td')
    row_data_2.textContent = numInterno

    const row_data_3 = document.createElement('td')
    row_data_3.textContent = (fecha.slice(0, 10)).split('-').reverse().join('/')

    const row_data_4 = document.createElement('td')
    row_data_4.innerHTML = `<a href="${format_token(linkComprobante)}">${comprobante}</a>`

    const row_data_5 = document.createElement('td')
    row_data_5.textContent = nombre

    const row_data_6 = document.createElement('td')
    row_data_6.id = `tr-${id}`
    row_data_6.textContent = format_number(total)
    
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    
    document.getElementById('purchases-table').appendChild(row)
}

// *Imprimir datos en la segunda tabla
const printElementInfoTables = ( arrDebits, arrCredits ) => {
    const rowDebits = document.createElement('tr')
    const rowCredits = document.createElement('tr')

    const row_data_1_debits = document.createElement('td')
    row_data_1_debits.textContent = 'Debitos'
    const row_data_1_credits = document.createElement('td')
    row_data_1_credits.textContent = 'Creditos'

    const row_data_2_debits = document.createElement('td')
    row_data_2_debits.textContent = format_number(arrDebits[0].neto)
    const row_data_2_credits = document.createElement('td')
    row_data_2_credits.textContent = format_number(arrCredits[0].neto)

    const row_data_3_debits = document.createElement('td')
    row_data_3_debits.textContent = format_number(arrDebits[1].iva)
    const row_data_3_credits = document.createElement('td')
    row_data_3_credits.textContent = format_number(arrCredits[1].iva)

    const row_data_4_debits = document.createElement('td')
    row_data_4_debits.textContent = format_number(arrDebits[2].retencion)
    const row_data_4_credits = document.createElement('td')
    row_data_4_credits.textContent = format_number(arrCredits[2].retencion)

    const row_data_5_debits = document.createElement('td')
    row_data_5_debits.textContent = format_number(arrDebits[3].noGravado)
    const row_data_5_credits = document.createElement('td')
    row_data_5_credits.textContent = format_number(arrCredits[3].noGravado)

    const row_data_6_debits = document.createElement('td')
    row_data_6_debits.textContent = format_number(arrDebits[4].total)
    const row_data_6_credits = document.createElement('td')
    row_data_6_credits.textContent = format_number(arrCredits[4].total)
    
    rowDebits.appendChild(row_data_1_debits)
    rowDebits.appendChild(row_data_2_debits)
    rowDebits.appendChild(row_data_3_debits)
    rowDebits.appendChild(row_data_4_debits)
    rowDebits.appendChild(row_data_5_debits)
    rowDebits.appendChild(row_data_6_debits)

    rowCredits.appendChild(row_data_1_credits)
    rowCredits.appendChild(row_data_2_credits)
    rowCredits.appendChild(row_data_3_credits)
    rowCredits.appendChild(row_data_4_credits)
    rowCredits.appendChild(row_data_5_credits)
    rowCredits.appendChild(row_data_6_credits)
    
    document.getElementById('info-table').appendChild(rowDebits)
    document.getElementById('info-table').appendChild(rowCredits)
}

const tkn = getParameter('tkn')
if ( tkn ) {
    post_getPendingPurchases( tkn )
}

// *Boton para grabar
const post_recordedAssess = (tkn, data) => {
    const url_recordedAssess = process.env.Solu_externo + '/formularios/proveedores/generar_asiento_compras'
    fetch( url_recordedAssess , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ({ resultado, mensaje}) => {
        // console.log(resultado, mensaje)
        alert(`Resultado: ${resultado} \nMensaje: ${mensaje}`)
        post_getPendingPurchases( tkn )
    })
    .catch( err => {
        console.log( err )
    })
}

// *Ejecutar boton actualizar
document.getElementById("update").addEventListener("click", () => {
    post_getPendingPurchases( tkn )
})

// *Ejecutar boton cargar
document.getElementById("record").addEventListener("click", () => {
    location.href = 'https://www.solucioneserp.com.ar/net/webform/compcomp.aspx'
})

// *Boton contabilizar
const form = document.getElementById('form')
form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const fecha = formData.get('seat-date').split('-').reverse().join('/')
    const unidadNegocioId = Number(formData.get('business'))
    const tipoAsientoId = Number(formData.get('seat-type'))
    const detalle = formData.get('detail')
    const agrupado = false
    
    let comprobantes = ''
    const checkedCheckboxes = document.querySelectorAll("#purchases-table input[type='checkbox']:checked")
    if ( ! checkedCheckboxes.length ) return alert('Debe marcar al menos una compra pendiente para contabilizar')
    for (const e of checkedCheckboxes) {
        comprobantes += e.id + ';'
    }
    comprobantes = ';' + comprobantes

    const data = {
        fecha,
        unidadNegocioId,
        tipoAsientoId,
        detalle,
        agrupado,
        comprobantes
    }
    // console.log(data)
    post_recordedAssess( tkn, data )
})