import { getParameter, format_number, reverseFormatNumber, calcularImporteTotal, restarImporteTotal } from "../../jsgen/Helper"

// *Conseguir ventas por contabilizar
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
            return
        }
        
        for (const element of resp) {
            printElementTables(element)
        }
        printFooterTable()
        getCheckboxes()
        
        document.getElementById('not-movements').classList.add('d-none')
        document.getElementById('loader').classList.add('d-none')
    })
    .catch( err => {
        console.log( err )
        document.getElementById('loader').classList.add('d-none')
        document.getElementById('not-movements').classList.remove('d-none')
    })
}

// *Imprimir datos en la primera tabla
const printElementTables = ({id, fechaPago, vencimiento, numero, importe, nombre, cliente, tarjetaId}) => {
    const row = document.createElement('tr')
    row.className = 'delete-row'

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
    row_data_7.innerHTML = `<input type="checkbox" name='checkbox-${id}' id='${id}' fechaPago=${fechaPago} vencimiento=${vencimiento} tarjetaId=${tarjetaId}>`
    
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    
    document.getElementById('movements-tbody').appendChild(row)
}

const printFooterTable = () => {
    const row = document.createElement('tr')
    row.className = 'delete-row'

    const row_data_1 = document.createElement('td')
    row_data_1.textContent = 'Total conciliado'
    row_data_1.colSpan = 5

    const row_data_2 = document.createElement('td')
    row_data_2.textContent = '0,00'
    row_data_2.id = 'total'
    
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)

    document.getElementById('movements-tfoot').appendChild(row)
}

const tkn = getParameter('tkn')
// *Boton contabilizar
const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const grupoId = Number(formData.get('group'))
    const data = {
        grupoId,
        movValidados: true
    }
    // console.log(data)
    post_getMovements( tkn, data )
    document.getElementById('to-date-table').textContent = formData.get('to-date').split('-').reverse().join('/')
})

// * Conseguir todos los checkboxes de la tabla
const getCheckboxes = () => {
    const checkboxes = document.querySelectorAll("#movements-table input[type='checkbox']")
    const total = document.getElementById('total')
    
    for (let element of checkboxes) {
        element.addEventListener("click", event => {
            const totalTarget = document.getElementById(`tr-${event.target.id}`).textContent
            const trTotal = (Number(reverseFormatNumber(totalTarget, 'de')))
            if ( event.target.checked ) {
                total.value = format_number(calcularImporteTotal(trTotal))
                getLineaToAPI(event.target, true)
            } else {
                total.value = format_number(restarImporteTotal(trTotal))
                getLineaToAPI(event.target, false)
            }
            document.getElementById('total').textContent = total.value === '-0,00' ? '0,00' : total.value
        })
    }
}

let linea = []
const getLineaToAPI = (value, isChecked) => {
    const id = value.getAttribute('id')
    if ( isChecked ) {
        const fechaPago = value.getAttribute('fechapago')
        const vencimiento = value.getAttribute('vencimiento')
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