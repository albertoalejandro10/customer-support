import * as bootstrap from 'bootstrap'

// Conseguir parametros del URL
const getParameter = parameterName => {
    let parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}

// El usuario selecciona una opcion del combo clientes. Filtrar el id y nombre para enviarlo a service.html
const newServiceButton = document.getElementById('newServiceButton')
const selectedInput = document.getElementById('clientes')
selectedInput.addEventListener('change', event => {
    // Si el valueSelected esta vacio, retorno.
    if ( event.currentTarget.options[selectedInput.selectedIndex].value === '') return
    // Si existe valueSelected, obtengo el valor.
    const selectedOption = event.currentTarget.options[selectedInput.selectedIndex]
    const selectedName = (selectedOption.textContent).replaceAll(' ', '+')
    // console.log( selectedOption.value, getParameter('tkn'), selectedName )
    customerPromise(selectedOption.value, getParameter('tkn'), selectedName)
    
    const customerSelected = document.getElementById('customer')
    customerSelected.value = (selectedOption.text).replace(' ', '-')

    newServiceButton.disabled = false
})

// Fetch para imprimir datos del servicio
const customerPromise = (id, tkn, name) => {
    fetch( `http://200.10.111.185:8182/maestros/servicios_clientes/get_servicios`, {
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

        // Eliminar filas viejas
        const tbody = document.getElementById('tbody')
        const elements = document.getElementsByClassName('delete-row')
        if ( tbody.children.length >= 1) {
            while (elements.length > 0) elements[0].remove()
            let importe = document.getElementById('importeTotal')
            importe.textContent = ''
        }

        for (const element of Linea) {
            // Desestructuracion del objeto element
            const { Id, ClienteID, Codigo, Detalle, Cantidad, Importe, Vencimiento, Observacion, Comptipo, Lista, Abono } = element
            // console.log( Id, ClienteID, Codigo, Detalle, Cantidad, Importe, Vencimiento, Observacion, Comptipo, Lista, Abono )
            
            // Imprimir datos en la tabla
            let row = document.createElement('tr')
            row.className = 'delete-row'

            let row_data_1 = document.createElement('td')
            let row_data_1_anchor = document.createElement('a')
            row_data_1_anchor.href = `/service.html?id=${Id}&idcliente=${ClienteID}&name=${name}&codigo=${(Codigo).trim()}&tkn=${tkn}`
            row_data_1_anchor.textContent = `${ Codigo }`
            row_data_1.appendChild(row_data_1_anchor)

            let row_data_2 = document.createElement('td')
            row_data_2.textContent = `${ Detalle }`

            let row_data_3 = document.createElement('td')
            row_data_3.textContent = `${ Vencimiento }`

            let row_data_4 = document.createElement('td')
            row_data_4.textContent = `${ Cantidad }`

            let row_data_5 = document.createElement('td')
            row_data_5.textContent = `${ Importe.toFixed(2) }`
            
            row.appendChild(row_data_1)
            row.appendChild(row_data_2)
            row.appendChild(row_data_3)
            row.appendChild(row_data_4)
            row.appendChild(row_data_5)
            
            tbody.appendChild(row)

            // Calcular e imprimir importeTotal
            calcularImporteTotal( Importe )
            let importe = document.querySelector('#importeTotal')
            importe.textContent = importeTotal.toFixed(2)
        }
        importeTotal = 0
    })
    .catch( err => console.log( err ))
}

// Calcular importe total
let importeTotal = 0
const calcularImporteTotal = precioServ => {
    importeTotal += precioServ
    return importeTotal
}

const id = getParameter('id')
const tkn = getParameter('tkn')
const name = getParameter('name')

// Si viene id, name y tkn en la URL, se ejecuta.
if ( id && name && tkn) {
    const parameterName = (name).replaceAll(' ', '+')
    customerPromise(id, tkn, parameterName)
}