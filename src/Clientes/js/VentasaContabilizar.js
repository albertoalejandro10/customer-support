import { getParameter, format_number } from "../../jsgen/Helper"

// *Conseguir ventas por contabilizar
const post_getPendingSales = (data, tkn) => {
    document.getElementById('loader').classList.remove('d-none')
    const url_getPendingSales = 'https://www.solucioneserp.net/formularios/clientes/get_ventas_pendientes_contabilizar'
    fetch( url_getPendingSales , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        // Eliminar tablas previas
        const tableHeaderRowCount = 1
        const table = document.getElementById('sales-table')
        const rowCount = table.rows.length
        for (let i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount)
        }

        const tableHeaderRowCountInfo = 1
        const tableInfo = document.getElementById('info-table')
        const rowCountInfo = tableInfo.rows.length
        for (let i = tableHeaderRowCountInfo; i < rowCountInfo; i++) {
            tableInfo.deleteRow(tableHeaderRowCountInfo)
        }

        if ( ! resp.length ) {
            document.getElementById('not-sales').classList.remove('d-none')
            return
        }
        
        const arrDebits = [
            {neto: 0},
            {iva: 0},
            {noGravado: 0},
            {total: 0}
        ]
        const arrCredits = [
            {neto: 0},
            {iva: 0},
            {noGravado: 0},
            {total: 0}
        ]
        for (const element of resp) {
            printElementTables(element)
            const { debe, neto, iva, noGravado, total } = element
            if ( debe ) {
                arrCredits[0].neto += neto
                arrCredits[1].iva += iva
                arrCredits[2].noGravado += noGravado
                arrCredits[3].total += total
            } else {
                arrDebits[0].neto += neto
                arrDebits[1].iva += iva
                arrDebits[2].noGravado += noGravado
                arrDebits[3].total += total
            }
        }
        printElementInfoTables(arrDebits, arrCredits)
        document.getElementById('loader').classList.add('d-none')
    })
    .catch( err => {
        console.log( err )
        document.getElementById('loader').classList.add('d-none')
        document.getElementById('not-sales').classList.remove('d-none')
    })
}

// *Imprimir datos en la primera tabla
const printElementTables = ({id, fecha, comprobante, nombre, total}) => {
    const row = document.createElement('tr')
    row.className = 'delete-row'

    const row_data_1 = document.createElement('td')
    row_data_1.innerHTML = `<input type="checkbox" name='checkbox-${id}' id='${id}'>`

    const row_data_2 = document.createElement('td')
    row_data_2.textContent = (fecha.slice(0, 10)).split('-').reverse().join('/')

    const row_data_3 = document.createElement('td')
    row_data_3.textContent = comprobante

    const row_data_4 = document.createElement('td')
    row_data_4.textContent = nombre

    const row_data_5 = document.createElement('td')
    row_data_5.id = `tr-${id}`
    row_data_5.textContent = `${format_number(total)}`
    
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    
    document.getElementById('sales-table').appendChild(row)
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
    row_data_4_debits.textContent = format_number(arrDebits[2].noGravado)
    const row_data_4_credits = document.createElement('td')
    row_data_4_credits.textContent = format_number(arrCredits[2].noGravado)

    const row_data_5_debits = document.createElement('td')
    row_data_5_debits.textContent = format_number(arrDebits[3].total)
    const row_data_5_credits = document.createElement('td')
    row_data_5_credits.textContent = format_number(arrCredits[3].total)
    
    rowDebits.appendChild(row_data_1_debits)
    rowDebits.appendChild(row_data_2_debits)
    rowDebits.appendChild(row_data_3_debits)
    rowDebits.appendChild(row_data_4_debits)
    rowDebits.appendChild(row_data_5_debits)

    rowCredits.appendChild(row_data_1_credits)
    rowCredits.appendChild(row_data_2_credits)
    rowCredits.appendChild(row_data_3_credits)
    rowCredits.appendChild(row_data_4_credits)
    rowCredits.appendChild(row_data_5_credits)
    
    document.getElementById('info-table').appendChild(rowDebits)
    document.getElementById('info-table').appendChild(rowCredits)
}

const codCliente = getParameter('codCliente')
const tkn = getParameter('tkn')
if ( codCliente && tkn ) {
    post_getPendingSales({codCliente}, tkn)
}

// *Boton para grabar
const post_recordedAssess = (tkn, data) => {
    const url_recordedAssess = 'https://www.solucioneserp.net/formularios/clientes/generar_asiento_ventas'
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
        alert(`${resultado} - ${mensaje}`)
        post_getPendingSales({codCliente}, tkn)
    })
    .catch( err => {
        console.log( err )
    })
}

// *Ejecutar boton actualizar
document.getElementById("update").addEventListener("click", () => {
    post_getPendingSales({codCliente}, tkn)
})

// *Ejecutar boton cargar
document.getElementById("record").addEventListener("click", () => {
    location.href = 'https://www.solucioneserp.com.ar/net/webform/compcomp.aspx'
})

// *Boton contabilizar
const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const fecha = formData.get('seat-date').split('-').reverse().join('/')
    const unidadNegocioId = Number(formData.get('business'))
    const tipoAsientoId = Number(formData.get('seat-type'))
    const detalle = formData.get('detail')
    const agrupado = false
    
    let comprobantes = ''
    const checkedCheckboxes = document.querySelectorAll("#sales-table input[type='checkbox']:checked")
    if ( ! checkedCheckboxes.length ) return alert('Debe marcar al menos una venta pendiente para contabilizar')
    for (const e of checkedCheckboxes) {
        comprobantes += ';' + e.id
    }

    const data = {
        fecha,
        unidadNegocioId,
        tipoAsientoId,
        detalle,
        agrupado,
        comprobantes
    }
    // console.log(JSON.stringify(data))
    post_recordedAssess( tkn, data )
})