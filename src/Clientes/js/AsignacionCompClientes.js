import { getParameter, format_number, reverseFormatNumber } from "../../jsgen/Helper"

const post_getReceipts = (tkn, data) => {
    const url_getReceipts = 'https://www.solucioneserp.net/clientes/formularios/asignacion_comprobantes/get_comprobantes_pendientes'
    fetch( url_getReceipts , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {

        // Eliminar filas viejas
        const tbody = document.getElementById('credit-tbody')
        const elements = document.getElementsByClassName('delete-row')
        if ( tbody.children.length >= 1) {
            while (elements.length > 0) elements[0].remove()
        }

        const receipts = resp
        const arrCredit = []
        const arrDebit = []
        for (const element of receipts) {
            const { debe } = element
            const creditNumber = 0
            if ( debe ===  creditNumber) {
                arrCredit.push(element)
            } else {
                arrDebit.push(element)
            }
        }
        
        const notCredit = document.getElementById('not-credit')
        const tfootCredit = document.getElementById('credit-tfoot')
        if ( arrCredit?.length ) {
            notCredit.classList.add('d-none')
            for (const element of arrCredit) {
                const creditBody = document.getElementById('credit-tbody')
                const { id, fecha, comprobante, total, pendiente } = element
                printElementTables( creditBody, tfootCredit, id, fecha, comprobante, total, pendiente )
            }
        } else {
            tfootCredit.classList.add('d-none')
            notCredit.classList.remove('d-none')
        }

        const notDebit = document.getElementById('not-debit')
        const tfootDebit = document.getElementById('debit-tfoot')
        if ( arrDebit?.length ) {
            notDebit.classList.add('d-none')
            for (const element of arrDebit) {
                const debitBody = document.getElementById('debit-tbody')
                const { id, fecha, comprobante, total, pendiente } = element
                printElementTables( debitBody, tfootDebit, id, fecha, comprobante, total, pendiente )
            }
        } else {
            tfootDebit.classList.add('d-none')
            notDebit.classList.remove('d-none')
        }

        getCheckboxesCredit()
        getCheckboxesDebit()
    })
    .catch( err => {
        console.log( err )
    })
}

// Imprimir datos en las tablas
const printElementTables = ( tbody, tfoot, id, fecha, comprobante, total, pendiente ) => {
    let row = document.createElement('tr')
    row.className = 'delete-row'

    let row_data_1 = document.createElement('td')
    row_data_1.innerHTML = `<input type="checkbox" name='checkbox-${id}' id='${id}'>`

    let row_data_2 = document.createElement('td')
    row_data_2.textContent = `${fecha.slice(0, 10)}`

    let row_data_3 = document.createElement('td')
    row_data_3.textContent = `${comprobante}`

    let row_data_4 = document.createElement('td')
    row_data_4.textContent = `${format_number(total)}`

    let row_data_5 = document.createElement('td')
    row_data_5.id = `tr-${id}`
    row_data_5.textContent = `${format_number(pendiente)}`
    
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    
    tbody.appendChild(row)

    tfoot.classList.remove('d-none')                
}

const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const data = {
        "cuenta": (formData.get('account')).trim(),
        "codCliente": formData.get('customers'),
        "unidadNegocio": Number(formData.get('business')),
        "fechaDesde": formData.get('periodStart').split('-').reverse().join('/'),
        "fechaHasta": formData.get('periodEnd').split('-').reverse().join('/'),
        "orden": Number(formData.get('orden-fecha'))
    }

    // console.table( data )
    const tkn = getParameter('tkn')
    post_getReceipts( tkn, data )
})

const getCheckboxesCredit = () => {
    const checkboxes = document.querySelectorAll("#credit-table input[type='checkbox']")
    const totalCredit = document.getElementById('total-credit')

    for (let element of checkboxes) {      
        element.addEventListener("click", event => {
            const totalTarget = document.getElementById(`tr-${event.target.id}`).textContent
            const trTotal = (Number(reverseFormatNumber(totalTarget, 'de')))
            if ( event.target.checked ) {
                totalCredit.value = format_number(sumarImporteCredit(trTotal))
            } else {
                totalCredit.value = format_number(restarImporteCredit(trTotal))            
            }
            calculateDifferenceBetweenCreditAndDebit()
        })
    }
}

let importeCredit = 0
const sumarImporteCredit = importe => {
    importeCredit += importe
    return importeCredit    
} 

const restarImporteCredit = importe => {
    importeCredit -= importe
    return importeCredit
}

const getCheckboxesDebit = () => {
    const checkboxes = document.querySelectorAll("#debit-table input[type='checkbox']")
    const totalDebit = document.getElementById('total-debit')

    for (let element of checkboxes) {      
        element.addEventListener("click", event => {
            const totalTarget = document.getElementById(`tr-${event.target.id}`).textContent
            const trTotal = (Number(reverseFormatNumber(totalTarget, 'de')))
            if ( event.target.checked ) {
                totalDebit.value = format_number(sumarImporteDebit(trTotal))
            } else {
                totalDebit.value = format_number(restarImporteDebit(trTotal))            
            }
            calculateDifferenceBetweenCreditAndDebit()
        })
    }
}

let importeDebit = 0
const sumarImporteDebit = importe => {
    importeDebit += importe
    return importeDebit
} 

const restarImporteDebit = importe => {
    importeDebit -= importe
    return importeDebit
}


const calculateDifferenceBetweenCreditAndDebit = () => {
    const totalCredit = document.getElementById('total-credit').value
    const totalDebit  = document.getElementById('total-debit').value
    const credito = Number(reverseFormatNumber(totalCredit, 'de'))
    const debito = Number(reverseFormatNumber(totalDebit, 'de'))
    // console.log('Credit:', credito)
    // console.log('Debit:', debito)
    const difference = document.getElementById('total-difference')
    if ( credito >= debito ) {
        difference.value = format_number(credito - debito)
    } else {
        difference.value = format_number(debito-credito)
    }
    // console.log('difference:', difference.value)
}

const post_RecordButton = (tkn, data) => {
    const url_ConfirmButton = 'https://www.solucioneserp.net/clientes/formularios/asignacion_comprobantes/asignar_comprobantes_pendientes'
    fetch( url_ConfirmButton , {
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
        alert(`${mensaje}`)
    })
    .catch( err => {
        console.log( err )
    })
}

document.getElementById("record").addEventListener("click", () => {
    const checkboxesCredit = document.querySelectorAll("#credit-table input[type='checkbox']:checked")
    const comprobantesCredit = []
    for (let element of checkboxesCredit) {
        const totalTarget = document.getElementById(`tr-${element.id}`).textContent
        const importe = (Number(reverseFormatNumber(totalTarget, 'de')))
        
        comprobantesCredit.push({
            id: Number(element.id),
            importePendiente: importe,
            debe: 0
        })
    }
    
    const checkboxesDebit = document.querySelectorAll("#debit-table input[type='checkbox']:checked")
    const comprobantesDebit = []
    for (let element of checkboxesDebit) {
        const totalTarget = document.getElementById(`tr-${element.id}`).textContent
        const importe = (Number(reverseFormatNumber(totalTarget, 'de')))
        
        comprobantesDebit.push({
            id: Number(element.id),
            importePendiente: importe,
            debe: 1
        })
    }

    if ( ! comprobantesCredit.length ) return alert('Debe marcar al menos dos comprobantes para asignar')
    if ( ! comprobantesDebit.length ) return alert('Debe marcar al menos dos comprobantes para asignar')

    const comprobantes = comprobantesCredit.concat(comprobantesDebit)
    const fecha = new Date().toLocaleDateString('en-GB')
    const data = {
        fecha,
        comprobantes
    }

    // console.log(data)
    const tkn = getParameter('tkn')
    post_RecordButton( tkn, data )
})