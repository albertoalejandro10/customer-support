const getParameter = parameterName => {
    const parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}

const format_number = importeNeto => 
    new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(importeNeto)

const reverseFormatNumber = val => {
    const group = new Intl.NumberFormat('de').format(1111).replace(/1/g, '')
    const decimal = new Intl.NumberFormat('de').format(1.1).replace(/1/g, '')
    let reversedVal = val.replace(new RegExp('\\' + group, 'g'), '')
    reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.')
    return parseFloat(reversedVal) || 0
}

const totalCredit = document.getElementById('total-credit')
const totalDebit = document.getElementById('total-debit')
const totalDifference = document.getElementById('total-difference')
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
        // console.log(receipts)
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
        totalCredit.value = ''
        totalDebit.value = ''
        totalDifference.value = ''
        updateImporte('credit', undefined, undefined, true)
        updateImporte('debit', undefined, undefined, true)

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
                    const { id, fecha, comprobante, total, pendiente, idvenc } = element
                    printElementTables(tbody, tfootElement, id, fecha, comprobante, total, pendiente, idvenc)
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
        getCheckboxes('credit')
        getCheckboxes('debit')

        // Agregar la clase 'd-none' a los elementos del cargador
        Array.prototype.forEach.call(loader, element => element.classList.add('d-none'))
    })
    .catch( err => {
        console.log( err )
        Array.prototype.forEach.call(loader, element => element.classList.remove('d-none'))
    })
}

// Imprimir datos en las tablas
const printElementTables = ( tbody, tfoot, id, fecha, comprobante, total, pendiente, idvenc ) => {
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
    row_data_5.idVenc =  idvenc
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
    event.preventDefault()
    Array.prototype.forEach.call(loader, element => element.classList.remove('d-none'))
    Array.prototype.forEach.call(loaderfoot, element => element.classList.add('d-none'))

    const formData = new FormData(event.currentTarget)
    const data = getData(formData)
    // console.log( data )
    post_getReceipts( tkn, data )
})

const getCheckboxes = type => {
    const checkboxes = document.querySelectorAll(`#${type}-table input[type='checkbox']`)
    const total = document.getElementById(`total-${type}`)

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener("click", event => {
            const totalTarget = document.getElementById(`tr-${event.target.id}`).textContent
            const trTotal = Number(reverseFormatNumber(totalTarget))
            if (event.target.checked) {
                total.value = format_number(updateImporte(type, trTotal, 'add'))
            } else {
                total.value = format_number(updateImporte(type, trTotal, 'subtract'))
            }
            calculateDifferenceBetweenCreditAndDebit()
        })
    })
}

let importe = {credit: 0, debit: 0}
const updateImporte = (type, importeValue = 0, operation = 'add', reset = false) => {
    if (reset) {
        importe[type] = 0
    } else {
        importe[type] = (operation === 'add') ? importe[type] + importeValue : importe[type] - importeValue
    }
    return importe[type]
}

// Calcular diferencia entre credito y debito
const calculateDifferenceBetweenCreditAndDebit = () => {
    const credito = Number(reverseFormatNumber(totalCredit.value)), debito = Number(reverseFormatNumber(totalDebit.value))
    totalDifference.value = format_number(credito >= debito ? credito - debito : debito - credito)
}

// Boton para grabar
const post_recordButton = (tkn, data) => {
    const url_recordButton = process.env.Solu_externo + '/proveedores/formularios/asignacion_comprobantes/grabar'
    fetch( url_recordButton , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( record => record.json() )
    .then( ({ resultado, mensaje}) => {
        // console.log(resultado, mensaje)
        alert(`Resultado: ${resultado} \nMensaje: ${mensaje}`)

        const formData = new FormData(document.getElementById('form'))
        const data = getData(formData)

        totalCredit.value = ''
        totalDebit.value = ''
        totalDifference.value = ''
    
        // console.table( data )
        post_getReceipts( tkn, data )
    })
    .catch( err => {
        console.log( err )
    })
}

const getData = formData => {
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
    return data
}

// Ejecutar boton grabar
document.getElementById("record").addEventListener("click", () => {
    const checkboxesCredit = document.querySelectorAll("#credit-table input[type='checkbox']:checked")
    const checkboxesDebit = document.querySelectorAll("#debit-table input[type='checkbox']:checked")

    const comprobantesCredit = getComprobantes(checkboxesCredit, 0)
    const comprobantesDebit = getComprobantes(checkboxesDebit, 1)

    if ( ! comprobantesCredit.length ) return alert('Debe marcar al menos dos comprobantes para asignar')
    if ( ! comprobantesDebit.length ) return alert('Debe marcar al menos dos comprobantes para asignar')

    const comprobantes = [...comprobantesCredit, ...comprobantesDebit]
    const fecha = new Date().toLocaleDateString('en-GB')
    const data = { fecha, comprobantes }
    
    // console.log(data)
    post_recordButton( tkn, data )
})

const getComprobantes = (checkboxes, debe) => {
    return [...checkboxes].reduce((acc, checkbox) => {
        const totalTarget = document.getElementById(`tr-${checkbox.id}`).textContent
        const idVenc = document.getElementById(`tr-${checkbox.id}`).idVenc
        const importePendiente = Number(reverseFormatNumber(totalTarget))
        acc.push({
            id: Number(checkbox.id),
            importePendiente,
            idVenc,
            debe
        })
        return acc
    }, [])
}