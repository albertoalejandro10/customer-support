import { getParameter, format_number, format_token } from "../../jsgen/Helper"

const post_getDiaryBook = (tkn, data) => {
    const url_getDiaryBook = process.env.Solu_externo + '/contabilidad/reportes/get_librodiario'
    fetch( url_getDiaryBook , {
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
        // Eliminar tablas previas
        const tableHeaderRowCount = 1
        const table = document.getElementById('full-table')
        const rowCount = table.rows.length
        for (let i = tableHeaderRowCount; i < rowCount; i++) {
            table.deleteRow(tableHeaderRowCount)
        }

        if ( ! resp.length ) {
            document.getElementById('not-movements').classList.remove('d-none')
            removeLoader()
            return
        }

        let count = 0
        const debeAsset = []
        const haberAsset = []
        resp.map(element => {
            const { linea } = element
            linea.map( x => {
                let { importe, debe } = x
                importe = Number(importe)
                if ( debe === '1') debeAsset.push(importe)
                if ( debe === '0' ) haberAsset.push(importe)
            })
            createsTableBodies(count)
            addData(count, element)
            count++
        })
        addAssets(debeAsset, haberAsset)

        document.getElementById('btn_print').disabled = false
        document.getElementById('api-error').classList.add('d-none')
        document.getElementById('not-movements').classList.add('d-none')
        removeLoader()
    })
    .catch( err => {
        // console.log( err )
        document.getElementById('api-error').classList.remove('d-none')
        document.getElementById('btn_print').disabled = true
        Array.from(loader).forEach(element => {
            // console.log(element.tagName)
            element.classList.remove('d-none')
        })
    })
}

const removeLoader = () => {
    Array.from(loader).forEach(element => {
        // console.log(element.tagName)
        element.classList.add('d-none')
    })
}

const createsTableBodies = count => {
    const tableBody = document.createElement('tbody')
    tableBody.id = `tbody-${count}`
    document.getElementById('full-table').append(tableBody)
}

const addData = (count, element) => {
    const {id, asiento, linkAsiento, fecha, linea} = element
    addSeats(count, id, asiento, linkAsiento, fecha)
    for (const e of linea) {
        // console.log(`Cuenta (${count}): `,e)
        addInfo(count, e)
    }
}

const addSeats = (count, id, asiento, linkAsiento, fecha) => {
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.classList.add('first-td')
    if (Number(id)) {
        row_data_1.innerHTML = '<a href="" onclick="window.open(\'' + format_token(linkAsiento) + '\', \'newwindow\', \'width=1200,height=800\');return false;" target="_blank">'+ asiento +'</a>'
    } else {
        row_data_1.textContent = asiento
    }
    const row_data_2 = document.createElement('td')
    row_data_2.classList.add('first-td')
    row_data_2.textContent = fecha
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)

    let empty = []
    const startSpots = 3
    const enoughSpots = 7
    fillEmptySpaces(row, empty, startSpots, enoughSpots)
    document.getElementById(`tbody-${count}`).appendChild(row)
}

const addInfo = (count, linea) => {
    const { codigo, planCuenta, detalle, importe, debe } = linea
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.textContent = ''
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = ''
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)

    const row_data_3 = document.createElement('td')
    row_data_3.textContent = codigo
    const row_data_4 = document.createElement('td')
    row_data_4.textContent = planCuenta
    const row_data_5 = document.createElement('td')
    row_data_5.textContent = detalle
    const row_data_6 = document.createElement('td')
    row_data_6.textContent = (debe === '1') ? format_number(importe) : ''
    const row_data_7 = document.createElement('td')
    row_data_7.textContent = (debe === '0') ? format_number(importe) : ''
    
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    document.getElementById(`tbody-${count}`).appendChild(row)
}

const addAssets = (debeAsset, haberAsset) => {
    const tableFooter = document.createElement('tfoot')
    tableFooter.id = `tfoot`
    document.getElementById('full-table').append(tableFooter)

    const row = document.createElement('tr')
    let empty = []
    const startSpots = 1
    const enoughSpots = 3
    fillEmptySpaces(row, empty, startSpots, enoughSpots)

    const row_data_3 = document.createElement('td')
    row_data_3.textContent = 'Totales'
    row.appendChild(row_data_3)

    const row_data_5 = document.createElement('td')
    row_data_5.textContent = ''
    const row_data_6 = document.createElement('td')
    row_data_6.textContent = format_number(debeAsset.reduce((a, b) => a + b, 0))
    const row_data_7 = document.createElement('td')
    row_data_7.textContent = format_number(haberAsset.reduce((a, b) => a + b, 0))
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    document.getElementById(`tfoot`).appendChild(row)
}

const fillEmptySpaces = (row, empty, startSpots, enoughSpots) => {
    for (let i = startSpots; i <= enoughSpots; i++) {
        empty[i] = document.createElement('td')
        empty[i].textContent = ''
        row.appendChild(empty[i])
    }
}

// Boton Actualizar
const loader = document.getElementsByClassName('loadingx')
const $form = document.getElementById('form')
const tkn = getParameter('tkn')
$form.addEventListener('submit', event => {
    Array.from(loader).forEach(element => {
        // console.log(element.tagName)
        element.classList.remove('d-none')
    })

    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const unidadNegocioId = Number(formData.get('business'))
    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const agrupaMes = formData.get('month') === 'on' ? true : false

    const data = {
        unidadNegocioId,
        fechaDesde,
        fechaHasta,
        agrupaMes
    }
    // console.log(data)
    post_getDiaryBook( tkn, data )
})

// Boton Imprimir
document.getElementById("btn_print").onclick = () => redirectPrint()
const redirectPrint = () => {
    const unidadNegocioId = Number(document.getElementById('business').value)
    const fechaDesde = (document.getElementById('periodStart').value).split('-').reverse().join('/')
    const fechaHasta = (document.getElementById('periodEnd').value).split('-').reverse().join('/')
    const agrupaMes = document.getElementById('month').checked
    const data = {
        unidadNegocioId,
        fechaDesde,
        fechaHasta,
        agrupaMes,
    }

    // console.table( data )
    let returnURL = window.location.protocol + '//' + window.location.host + process.env.VarURL + '/Contabilidad/VerLibroDiario.html?'
    for (const property in data) {
        returnURL += `${property}=${data[property]}&`
    }
    const fullURL = returnURL + 'tkn=' + tkn
    setTimeout(() => window.open(fullURL, '_blank', 'toolbar=0,location=0,menubar=0'), 1000)
}