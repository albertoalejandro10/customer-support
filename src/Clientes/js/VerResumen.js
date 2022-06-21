import { getParameter, format_number } from "../../jsgen/Helper"

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

const tkn = getParameter('tkn')
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
    get_accountSummary( tkn, data )
}

const get_accountSummary = ( tkn, data ) => {
    const url_accountSummary = 'https://www.solucioneserp.net/reportes/clientes/get_resumen_cuenta_cliente'
    fetch( url_accountSummary , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const dataHeader = {
            fechaDesde: data.fechaDesde,
            fechaHasta: data.fechaHasta,
            cuit: resp[0].cuit,
            nombre: resp[0].nombre,
            codigo: resp[0].codigo,
            iva: resp[0].iva,
            observacion: resp[0].observacion
        }
        printHeader( dataHeader )
        printTable( resp )
    })
    .catch( err => {
        console.log( err )
    })
}

get_userData( tkn )
get_dataFromURL()

const printHeader = ({ fechaDesde, fechaHasta, cuit, nombre, codigo, iva, observacion }) => {

    document.getElementById('date').textContent = fechaDesde + ' - ' + fechaHasta
    document.getElementById('cuit').textContent = cuit

    document.getElementById('code').innerHTML = `<strong class="real-blue">${codigo}</strong>`
    document.getElementById('name').innerHTML = `<strong class="real-blue">${nombre}</strong>`
    document.getElementById('iva').innerHTML = `<strong class="real-blue">${iva}</strong>`
    document.getElementById('cuit').innerHTML = `<strong class="real-blue">${cuit}</strong>`

    if ( observacion ) {
        document.getElementById('observation').innerHTML = `<strong class="real-blue">Observación:</strong> ${observacion}`
    }
}

// Imprimir datos en la tabla
const printTable = ( resp ) => {
    let saldo = 0
    for (const element of resp) {
        const { fecha, comprobante, importeDebe, importeHaber } = element
        let row = document.createElement('tr')
    
        let row_data_1 = document.createElement('td')
        row_data_1.textContent = fecha
        
        let row_data_2 = document.createElement('td')
        row_data_2.textContent = comprobante
        
        let row_data_3 = document.createElement('td')
        row_data_3.textContent = format_number(importeDebe)
    
        let row_data_4 = document.createElement('td')
        row_data_4.textContent = format_number(importeHaber)
        
        saldo += importeDebe - importeHaber
        let row_data_5 = document.createElement('td')
        row_data_5.textContent = format_number(saldo)
        
        row.appendChild(row_data_1)
        row.appendChild(row_data_2)
        row.appendChild(row_data_3)
        row.appendChild(row_data_4)
        row.appendChild(row_data_5)
        
        document.getElementById('tbody-table').appendChild(row)
    }
    console.log( saldo )
    document.getElementById('final-summary').textContent = format_number(saldo)
}

document.getElementById('btn_print').onclick = () => {
    const printContents = document.getElementById('printableArea').innerHTML
    const originalContents = document.body.innerHTML
    document.body.innerHTML = printContents
    window.print()
    document.body.innerHTML = originalContents
}