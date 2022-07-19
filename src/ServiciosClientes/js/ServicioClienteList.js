import { getParameter, format_number } from "../../jsgen/Helper"

// Fetch para imprimir datos del servicio
const customerService = ( id, name, tkn ) => {
    const url_getServices = 'https://www.solucioneserp.net/maestros/servicios_clientes/get_servicios'
    fetch( url_getServices, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            "clienteId": id
        })
    })
    .then( resp => resp.json() )
    .then( ({ Linea }) => {
        // console.log( Linea )
        if ( Linea.length === 0 ) {
            // console.log('Empty')
            document.getElementById('no-service').classList.remove('d-none')
        }
        // Eliminar filas vieja
        const tbody = document.getElementById('tbody')
        const elements = document.getElementsByClassName('delete-row')
        if ( tbody.children.length >= 1) {
            while (elements.length > 0) elements[0].remove()
            let importe = document.getElementById('importeTotal')
            importe.textContent = ''
        }

        const importeElement = document.getElementById('importeTotal')
        for (const element of Linea) {
            // Desestructuracion del objeto element
            const { Id, ClienteID, Codigo, Detalle, Cantidad, Importe, Vencimiento, Observacion, Comptipo, Lista, Abono } = element
            // console.log( Id, ClienteID, Codigo, Detalle, Cantidad, Importe, Vencimiento, Observacion, Comptipo, Lista, Abono )
            
            // Imprimir datos en la tabla
            let row = document.createElement('tr')
            row.className = 'delete-row'

            let row_data_1 = document.createElement('td')
            let row_data_1_anchor = document.createElement('a')
            row_data_1_anchor.href = `/ServiciosClientes/ServicioClientesEdit.html?id=${ClienteID}&idservice=${Id}&name=${name}&codigo=${Codigo.trim()}&tkn=${tkn}`
            row_data_1_anchor.textContent = `${ Codigo }`
            row_data_1.appendChild(row_data_1_anchor)

            let row_data_2 = document.createElement('td')
            row_data_2.textContent = `${ Detalle }`

            let row_data_3 = document.createElement('td')
            row_data_3.textContent = `${ Vencimiento }`

            let row_data_4 = document.createElement('td')
            row_data_4.textContent = `${ Cantidad }`

            let row_data_5 = document.createElement('td')
            row_data_5.textContent = `${ format_number(Importe) }`
            
            row.appendChild(row_data_1)
            row.appendChild(row_data_2)
            row.appendChild(row_data_3)
            row.appendChild(row_data_4)
            row.appendChild(row_data_5)
            
            tbody.appendChild(row)

            // Calcular e imprimir importeTotal
            calcularImporteTotal( Importe )
            importeElement.textContent = format_number(importeTotal)
        }
        importeTotal = 0

        Array.from(loader).forEach(element => {
            // console.log(element.tagName)
            element.classList.add('d-none')
        })
    })
    .catch( err => {
        console.log('Error: ', err)
        Array.from(loader).forEach(element => {
            // console.log(element.tagName)
            element.classList.add('d-none')
        })
        document.getElementById('no-service').classList.add('d-none')
    })
}

// Calcular importe total
let importeTotal = 0
const calcularImporteTotal = importe => {
    importeTotal += importe
    return importeTotal
}

const activateNewButton = (id, name, tkn) => {
    const newService = document.getElementById('newServiceButton')
    newService.disabled = false
    newService.onclick = () => {
        let returnURL = window.location.protocol + '//' + window.location.host + `/ServiciosClientes/ServicioClientesEdit.html?id=${id}&name=${name}&tkn=${tkn}`
        setTimeout(() => location.href = returnURL, 1000)
    }
}

const id = getParameter('id')
const tkn = getParameter('tkn')
const loader = document.getElementsByClassName('loadingx')
$('#customer').on('select2:select', function (e) {
    Array.from(loader).forEach(element => {
        // console.log(element.tagName)
        element.classList.remove('d-none')
    })
    // console.log( e.params.data )
    let {id, name, text} = e.params.data
    name = name.replaceAll(' ', '+')
    customerService(id, name, tkn)
    activateNewButton(id, name, tkn)
})

const nameURL = getParameter('name')
// Si viene id, name y tkn en la URL, se ejecuta.
if ( id && tkn && nameURL ) {
    // console.log(id, tkn, parameterName)
    const parameterName = nameURL.replaceAll(' ', '+')
    customerService( id, parameterName, tkn )
    activateNewButton(id, parameterName, tkn)
}