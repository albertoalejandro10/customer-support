import { getParameter, format_number, reverseFormatNumber, calcularImporteTotal, restarImporteTotal } from "../../jsgen/Helper"

// *Conseguir movimientos validados
const post_getMovements = (tkn, data) => {
    document.getElementById('loader').classList.remove('d-none')
    const url_getMovements = 'https://www.solucioneserp.net/bancosyvalores/conciliar_tarjetas/get_movimientos'
    fetch( url_getMovements , {
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
        // Eliminar elementos de la tabla
        const tableHeaderRowCount = 1
        const table = document.getElementById('movements-table')
        const rowCount = table.rows.length
        for (let i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount)
        }
        
        if ( ! resp.length ) {
            document.getElementById('not-movements').classList.remove('d-none')
            document.getElementById('loader').classList.add('d-none')
            document.getElementById('assess').disabled = true
            return
        }

        let count = 0
        for (const element of resp) {
            if (element.id === -1) {
                count++
                element.identifierOnTable = count
            }
            element.identifierOnTable = count
        }
        
        for (const element of resp) {
            printElementTables(element)
        }
        printFooterTable()
        getCheckboxes()
        showHideElementsTable()

        document.getElementById('not-movements').classList.add('d-none')
        document.getElementById('loader').classList.add('d-none')
        document.getElementById('assess').disabled = false
    })
    .catch( err => {
        console.log( err )
        document.getElementById('loader').classList.add('d-none')
        document.getElementById('not-movements').classList.remove('d-none')
        document.getElementById('assess').disabled = true
    })
}

// *Imprimir cuerpo de la tabla con sus datos
const printElementTables = ({id, fechaPago, vencimiento, numero, importe, nombre, cliente, tarjetaId, identifierOnTable}) => {
    const row = document.createElement('tr')

    const row_data_0 = document.createElement('td')
    row_data_0.innerHTML = `<button type="button" id='${id}' identifierOnTable='${identifierOnTable}'>+</button>`
    row_data_0.className = 'expand-agrupation'

    const row_data_1 = document.createElement('td')
    row_data_1.textContent = fechaPago

    const row_data_2 = document.createElement('td')
    row_data_2.textContent = vencimiento

    const row_data_3 = document.createElement('td')
    row_data_3.innerHTML = numero

    const row_data_4 = document.createElement('td')
    row_data_4.textContent = nombre

    const row_data_5 = document.createElement('td')
    row_data_5.textContent = cliente

    const row_data_6 = document.createElement('td')
    row_data_6.id = `tr-${id}`
    row_data_6.textContent = `${format_number(importe)}`

    const row_data_7 = document.createElement('td')
    row_data_7.innerHTML = `<input type="checkbox" name='checkbox-${id}' id='${id}' fechaPago='${fechaPago}' vencimiento='${vencimiento}' tarjetaId='${tarjetaId}' sumar='noSumar' identifier='${identifierOnTable}'>`

    if (!numero.includes('#')) {
        row.className = 'd-none'
        row_data_7.innerHTML = `<input type="checkbox" name='checkbox-${id}' id='${id}' fechaPago='${fechaPago}' vencimiento='${vencimiento}' tarjetaId='${tarjetaId}' sumar='sumar' identifier='${identifierOnTable}'>`
    }
    
    row.appendChild(row_data_0)
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    
    document.getElementById('movements-tbody').appendChild(row)
}

// * Imprimir pie de tabla
const printFooterTable = () => {
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.textContent = 'Total conciliado'
    row_data_1.colSpan = 6
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = '0,00'
    row_data_2.id = 'total'
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    document.getElementById('movements-tfoot').appendChild(row)
}

const tkn = getParameter('tkn')
// * Boton actualizar
const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    linea = []
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    
    const grupoId = Number(formData.get('group'))
    const hastaFecha = formData.get('to-date').split('-').reverse().join('/')
    const data = {
        grupoId,
        hastaFecha,
        movValidados: false
    }
    // console.log(data)
    post_getMovements( tkn, data )
    document.getElementById('to-date-table').value = hastaFecha.split('/').reverse().join('-')
})

// * Conseguir todos los checkboxes de la tabla
const getCheckboxes = () => {
    const total = document.getElementById('total')
    getTopGroupsCheckboxes(total)
    getCheckboxesPrices(total)
}

// * Primeros elementos de los grupos
const getTopGroupsCheckboxes = total => {
    const checkboxes = document.querySelectorAll("[sumar='noSumar']")
    checkboxes.forEach(checkElement => {
        checkElement.addEventListener('click', event => {
            const identifier = event.target.getAttribute('identifier')
            const target = Array.from(document.querySelectorAll(`#movements-table [identifier='${identifier}']`))
            target.shift()
            if ( checkElement.checked ) {
                checkAll(target, total)
            } else {
                uncheckAll(target, total)
            }
        })
    })
}

// * Check all checkboxes group
const checkAll = (target, total) => {
    target.forEach(checkElement => {
        checkElement.checked = true
        checkElement.disabled = true
        const totalTarget = document.getElementById(`tr-${checkElement.id}`).textContent
        const trTotal = Number(reverseFormatNumber(totalTarget, 'de'))
        total.value = format_number(calcularImporteTotal(trTotal))
        getLineaToAPI(checkElement, true)
        document.getElementById('total').textContent = total.value === '-0,00' ? '0,00' : total.value
    })
    
}

// * Unchecked all checkboxes group
const uncheckAll = (target, total) => {
    target.forEach(checkElement => {
        checkElement.checked = false
        checkElement.disabled = false
        const totalTarget = document.getElementById(`tr-${checkElement.id}`).textContent
        const trTotal = Number(reverseFormatNumber(totalTarget, 'de'))
        total.value = format_number(restarImporteTotal(trTotal))
        getLineaToAPI(checkElement, false)
        document.getElementById('total').textContent = total.value === '-0,00' ? '0,00' : total.value
    })
}

// * Sumar y restar importes al click sobre checkboxes 
const getCheckboxesPrices = total => {
    const checkboxes = document.querySelectorAll("[sumar='sumar']")
    checkboxes.forEach(checkElement => {
        checkElement.addEventListener('click', event => {

            const identifier = event.target.getAttribute('identifier')
            const target = Array.from(document.querySelectorAll(`#movements-table [identifier='${identifier}']`))
            const top = target.shift()
            
            const totalTarget = document.getElementById(`tr-${event.target.id}`).textContent
            const trTotal = (Number(reverseFormatNumber(totalTarget, 'de')))
            
            if ( event.target.checked ) {
                top.disabled = true
                total.value = format_number(calcularImporteTotal(trTotal))
                getLineaToAPI(event.target, true)
            } else {
                const isAllCheckboxChecked = target.every(element => element.checked === true)
                const isAllCheckboxNotChecked = target.every(element => element.checked === false)
                if (isAllCheckboxChecked) {
                    top.disabled = true
                } else if (isAllCheckboxNotChecked) {
                    top.disabled = false
                }
                total.value = format_number(restarImporteTotal(trTotal))
                getLineaToAPI(event.target, false)
            }
            document.getElementById('total').textContent = total.value === '-0,00' ? '0,00' : total.value
        })
    })

}

// * get info to send to API
let linea = []
const getLineaToAPI = (value, isChecked) => {
    const id = value.getAttribute('id')
    if ( isChecked ) {
        let fechaPago = value.getAttribute('fechapago')
        let vencimiento = value.getAttribute('vencimiento')
        const tarjetaId = Number(value.getAttribute('tarjetaid'))
        const data = {
            id,
            fechaPago,
            vencimiento,
            tarjetaId,
        }
        linea.push(data)
    } else {
        linea = linea.filter( el => { return el.id != id })
    }
}


// *Boton para contabilizar movimientos validados
document.getElementById("assess").addEventListener("click", () => {
    for (const element of linea) {
        delete element.id        
    }
    const data = {
        movValidados: true,
        lineas: linea,
    }
    // console.log(data)
    post_saveReconciliation(tkn, data)
})

// *Boton para contabilizar movimientos validados
const post_saveReconciliation = (tkn, data) => {
    const url_recordedAssess = 'https://www.solucioneserp.net/bancosyvalores/conciliar_tarjetas/guardar_conciliacion'
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
        location.reload()
    })
    .catch( err => {
        console.log( err )
    })
}

const showHideElementsTable = () => {
    const allTableButtons = document.querySelectorAll('#movements-table button')
    for (const element of allTableButtons) {
        element.addEventListener('click', event => {
            const identifier = event.target.getAttribute('identifierOnTable')
            toggleTable(identifier)
            changeIcons(identifier)
        })
    }
}

// * Expand and collapse groups on table
const toggleTable = identifier => {
    const elements = document.querySelectorAll(`[identifierOnTable='${identifier}']`)
    const arrayTr = []
    elements.forEach(el => {
        arrayTr.push(el.parentElement.parentElement)
    })
    if (arrayTr[1].className === 'd-none') {
        arrayTr.shift()
        arrayTr.map(element => {
            element.className = ''
        })
    } else {
        arrayTr.shift()
        arrayTr.map(element => {
            element.className = 'd-none'
        })
    }
}

const changeIcons = identifier => {
    // * Change first group icon
    const firstElement = document.querySelector(`[identifierOnTable='${identifier}']`)
    if ( firstElement.textContent === '+' ) {
        firstElement.textContent = '-'
        firstElement.style.color = '#971e1e'
    } else {
        firstElement.textContent = '+'
        firstElement.style.color = '#192596'
    }

    // * Delete secondary groups icons 
    const elements = Array.from(document.querySelectorAll(`[identifierOnTable='${identifier}']`))
    elements.shift()
    elements.map(element => {
        element.textContent = ''
    })
}
