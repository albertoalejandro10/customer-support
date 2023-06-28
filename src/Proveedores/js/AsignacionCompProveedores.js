import { getParameter, format_number, reverseFormatNumber } from "../../jsgen/Helper"

const post_getReceipts = (tkn, data) => {
    const url_getReceipts = process.env.Solu_externo + '/proveedores/formularios/asignacion_comprobantes/actualizar'
    fetch( url_getReceipts , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( receipts => receipts.json())
    .then( ({asignacionesPend: receipts}) => {
        // Eliminar filas viejas
        const ids = ['credit-tbody', 'debit-tbody']
        ids.forEach(id => {
            const tbody = document.getElementById(id)
            if (tbody.children.length >= 1) {
                const elements = tbody.getElementsByClassName('delete-row')
                while (elements.length > 0) elements[0].remove()
            }
        })

        // Resetear inputs de totales
        document.getElementById('total-credit').value = ''
        document.getElementById('total-debit').value = ''
        document.getElementById('total-difference').value = ''
        sumarImporteCredit(0, true)
        sumarImporteDebit(0, true)
        restarImporteCredit(0, true)
        restarImporteDebit(0, true)

        // Organizar arreglos dependiendo de credito y debito
        const arrCredit = receipts.filter(receipt => receipt.debe === 0)
        const arrDebit = receipts.filter(receipt => receipt.debe !== 0)

        // Función para imprimir elementos en la tabla
        function printReceipts(arr, notElementId, tfootElementId, tbodyElementId) {
            const notElement = document.getElementById(notElementId)
            const tfootElement = document.getElementById(tfootElementId)
            if (arr.length) {
                notElement.classList.add('d-none')
                arr.forEach(element => {
                    const tbody = document.getElementById(tbodyElementId)
                    const { id, fecha, comprobante, total, pendiente } = element
                    printElementTables(tbody, tfootElement, id, fecha, comprobante, total, pendiente)
                })
            } else {
                tfootElement.classList.add('d-none')
                notElement.classList.remove('d-none')
            }
        }

        // Imprimir arreglos en las tablas correspondientes
        printReceipts(arrCredit, 'not-credit', 'credit-tfoot', 'credit-tbody')
        printReceipts(arrDebit, 'not-debit', 'debit-tfoot', 'debit-tbody')

        // Click sobre checkboxes
        getCheckboxesCredit()
        getCheckboxesDebit()

        // Agregar la clase 'd-none' a los elementos del cargador
        Array.from(loader).forEach(element => {
            // console.log(element.tagName)
            element.classList.add('d-none')
        })
    })
    .catch( err => {
        console.log( err )
        Array.from(loader).forEach(element => {
            // console.log(element.tagName)
            element.classList.remove('d-none')
        })
    })
}

// Imprimir datos en las tablas
const printElementTables = ( tbody, tfoot, id, fecha, comprobante, total, pendiente ) => {
    const row = document.createElement('tr')
    row.className = 'delete-row'

    const row_data_1 = document.createElement('td')
    row_data_1.innerHTML = `<input type="checkbox" name='checkbox-${id}' id='${id}'>`

    const row_data_2 = document.createElement('td')
    row_data_2.textContent = fecha.slice(0, 10)

    const row_data_3 = document.createElement('td')
    row_data_3.textContent = comprobante

    const row_data_4 = document.createElement('td')
    row_data_4.textContent = format_number(total)

    const row_data_5 = document.createElement('td')
    row_data_5.id = `tr-${id}`
    row_data_5.textContent = format_number(pendiente)
    
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    
    tbody.appendChild(row)
    tfoot.classList.remove('d-none')
}

const tkn = getParameter('tkn')
const loader = document.getElementsByClassName('loadingx')
const loaderfoot = document.getElementsByClassName('loading')
const form = document.getElementById('form')
form.addEventListener('submit', event => {
    Array.from(loader).forEach(element => {
        // console.log(element.tagName)
        element.classList.remove('d-none')
    })

    Array.from(loaderfoot).forEach(element => {
        // console.log(element.tagName)
        element.classList.add('d-none')
    })

    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const cuenta = formData.get('account')
    const cliente = formData.get('supplier')
    const ccosto = Number(formData.get('business'))
    const dfecha = formData.get('periodStart').split('-').reverse().join('/')
    const hfecha = formData.get('periodEnd').split('-').reverse().join('/')
    const orden = Number(formData.get('orden-fecha'))

    const data = {
      cuenta,
      cliente,
      ccosto,
      dfecha,
      hfecha,
      orden
    }
    // console.log( data )
    post_getReceipts( tkn, data )
})


// Conseguir checkboxes de Credito
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

// Sumar Credito
let importeCredit = 0
const sumarImporteCredit = (importe, reset) => {
    if ( reset ) {
        importeCredit = 0
    }
    importeCredit += importe
    return importeCredit
} 

// Restar Credito
const restarImporteCredit = (importe, reset) => {
    if ( reset ) {
        importeCredit = 0
    }
    importeCredit -= importe
    return importeCredit
}

// Conseguir checkboxes de Debito
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
// Sumar Debito
const sumarImporteDebit = (importe, reset) => {
    if ( reset ) {
        importeDebit = 0
    }
    importeDebit += importe
    return importeDebit
} 

// Restar debito
const restarImporteDebit = (importe, reset) => {
    if ( reset ) {
        importeDebit = 0
    }
    importeDebit -= importe
    return importeDebit
}

// Calcular diferencia entre credito y debito
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

// Boton para grabar
const post_recordButton = (tkn, data) => {
    console.log(data);
    const url_recordButton = process.env.NewSolu_externo + '/proveedores/formularios/asignacion_comprobantes/actualizar'
    fetch( url_recordButton , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ({ resultado, mensaje}) => {
        console.log(resultado, mensaje)
        alert(`Resultado: ${resultado} \nMensaje: ${mensaje}`)

        const cuenta = document.getElementById('account').value
        const cliente = document.getElementById('supplier').value
        const ccosto = Number(document.getElementById('business').value)
        const dfecha = (document.getElementById('periodStart').value).split('-').reverse().join('/')
        const hfecha = (document.getElementById('periodEnd').value).split('-').reverse().join('/')
        const orden = Number(document.getElementById('orden-fecha').value)

        const data = {
            cuenta,
            cliente,
            ccosto,
            dfecha,
            hfecha,
            orden,
        }
        document.getElementById('total-credit').value = ''
        document.getElementById('total-debit').value = ''
        document.getElementById('total-difference').value = ''
    
        // console.table( data )
        post_getReceipts( tkn, data )
    })
    .catch( err => {
        console.log( err )
    })
}

// Ejecutar boton grabar
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
    post_recordButton( tkn, data )
})