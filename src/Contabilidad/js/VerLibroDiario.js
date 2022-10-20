import { getParameter, format_number } from "../../jsgen/Helper"

const tkn = getParameter('tkn')
const startDate = getParameter('fechaDesde')
const lastDate = getParameter('fechaHasta')
document.getElementById('date').textContent = `${startDate} - ${lastDate}`

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
        // console.log( estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre )
        document.getElementById('name-company').textContent = empresaNombre
        document.getElementById('cuit-company').textContent = empresaCUIT
    })
    .catch( err => {
        console.log( 'Error en el llamado a la API: ', err )
    })
}
get_userData( tkn )

const get_diaryBook = ( tkn, data ) => {
    const url_getDiaryBook = 'https://www.solucioneserp.net/contabilidad/reportes/get_librodiario'
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
        let count = 0
        resp.map(element => {
            let debeAsset = 0
            let haberAsset = 0
            const { linea } = element
            linea.map( x => {
                let { importe, debe } = x
                importe = Number(importe)
                if ( debe === '1') {debeAsset += importe}
                if ( debe === '0' ) { haberAsset += importe }
            })
            console.log(debeAsset)
            console.log(haberAsset)
            createsTableBodies(count)
            addData(count, element)
            addAssets(count, debeAsset, haberAsset)
            count++
        })
        // addAssets(debeAsset, haberAsset)
    })
    .catch( err => {
        console.log( err )
    })
}

const createsTableBodies = count => {
    const tableBody = document.createElement('tbody')
    tableBody.id = `tbody-${count}`
    document.getElementById('full-table').append(tableBody)
}

const addData = (count, element) => {
    const {asiento, fecha, linea} = element
    // addSeats(count, asiento, linkAsiento, fecha)
    for (let [index, e] of linea.entries()) {
        // console.log(`Cuenta (${count}): `,e)
        addInfo(index, count, asiento, fecha, e)
    }
}

const addInfo = (index, count, asiento, fecha, linea) => {
    const { codigo, planCuenta, detalle, importe, debe } = linea
    // console.log(asiento, fecha, codigo, planCuenta, detalle, importe, debe)
    const row = document.createElement('tr')
    if ( index === 0 ) {
        const row_data_1 = document.createElement('td')
        row_data_1.classList.add('first-td')
        row_data_1.innerHTML = asiento.trim()
        const row_data_2 = document.createElement('td')
        row_data_2.classList.add('first-td')
        row_data_2.textContent = fecha
        row.appendChild(row_data_1)
        row.appendChild(row_data_2)
    } else {
        const row_data_1 = document.createElement('td')
        row_data_1.textContent = ''
        const row_data_2 = document.createElement('td')
        row_data_2.textContent = ''
        row.appendChild(row_data_1)
        row.appendChild(row_data_2)
    }

    const row_data_3 = document.createElement('td')
    row_data_3.textContent = codigo
    const row_data_4 = document.createElement('td')
    row_data_4.textContent = planCuenta
    const row_data_5 = document.createElement('td')
    row_data_5.textContent = detalle
    const row_data_6 = document.createElement('td')


    row_data_6.textContent = (debe === '1') ? format_number(importe) : '0,00'
    const row_data_7 = document.createElement('td')
    row_data_7.textContent = (debe === '0') ? format_number(importe) : '0,00'
    
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    document.getElementById(`tbody-${count}`).appendChild(row)
}

const addAssets = (count, debeAsset, haberAsset) => {
    const row = document.createElement('tr')
    row.classList.add('last-tr')
    const row_data_1 = document.createElement('td')
    row_data_1.textContent = 'TOTAL ASIENTO'
    row_data_1.classList.add('first-td')
    row.appendChild(row_data_1)
    let empty = []
    const startSpots = 2
    const enoughSpots = 5
    fillEmptySpaces(row, empty, startSpots, enoughSpots)
    const row_data_6 = document.createElement('td')
    row_data_6.textContent = format_number(debeAsset)
    row_data_6.classList.add('first-td')
    const row_data_7 = document.createElement('td')
    row_data_7.textContent = format_number(haberAsset)
    row_data_7.classList.add('first-td')
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    document.getElementById(`tbody-${count}`).appendChild(row)
}

const fillEmptySpaces = (row, empty, startSpots, enoughSpots) => {
    for (let i = startSpots; i <= enoughSpots; i++) {
        empty[i] = document.createElement('td')
        empty[i].textContent = ''
        row.appendChild(empty[i])
    }
}

const get_dataFromURL = () => {
    const query = window.location.search.substring(1)
    const arrData = query.split('&')
    let data = {}
    for (const element of arrData) {
        const pair = element.split('=')
        const [ property, value ] = pair
        data[`${property}`] = value
    }
    // console.log( data )
    get_diaryBook( tkn, data )
}
get_dataFromURL()

document.getElementById('btn_print').onclick = () => {
    const printContents = document.getElementById('printableArea').innerHTML
    const originalContents = document.body.innerHTML
    document.body.innerHTML = printContents
    window.print()
    document.body.innerHTML = originalContents
}