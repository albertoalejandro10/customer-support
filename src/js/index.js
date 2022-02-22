import * as bootstrap from 'bootstrap'

// Conseguir parametros del URL
const getParameter = parameterName => {
    let parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}

// El usuario selecciona una opcion del combo clientes. Filtrar el id y nombre para enviarlo a service.html
let selectedInput = document.getElementById('clientes')
selectedInput.addEventListener('change', event => {
    // Si el valueSelected esta vacio, retorno.
    if ( event.currentTarget.options[selectedInput.selectedIndex].value === '') return
    // Si existe valueSelected, obtengo el valor.
    let selectedOption = event.currentTarget.options[selectedInput.selectedIndex]
    customerPromise(selectedOption.value)
    
    let customerSelected = document.getElementById('customer')
    customerSelected.value = (selectedOption.text).replace(' ', '-')
})


// Fetch para traer e imprimir datos de los servicios del cliente. 
const customerPromise = id => {
    fetch(`https://62048c21c6d8b20017dc3571.mockapi.io/api/v1/customers/${id}/Services`)
    .then( resp => resp.json() )
    .then( resp => {
        const services = resp

        // Delete old rows
        const tbody = document.getElementById('tbody')
        const elements = document.getElementsByClassName('delete-row')
        if ( tbody.children.length >= 1) {
            while (elements.length > 0) elements[0].remove()
            let importe = document.getElementById('importeTotal')
            importe.textContent = ''
        }

        for ( let element of services) {

            // Desestructuracion del objeto element
            const { codigoServ, nombreServ, precioServ, cantidad, vencimiento, id, clienteid } = element
            // console.log( codigoServ, nombreServ, precioServ, cantidad, vencimiento, id, clienteid )
            
            // Imprimir datos en la tabla
            let row = document.createElement('tr')
            row.className = 'delete-row'

            let row_data_1 = document.createElement('td')
            let row_data_1_anchor = document.createElement('a')
            row_data_1_anchor.href = `/service.html?id=${id}`
            row_data_1_anchor.textContent = `${ codigoServ }`
            row_data_1.appendChild(row_data_1_anchor)

            let row_data_2 = document.createElement('td')
            row_data_2.textContent = `${ nombreServ }`

            let row_data_3 = document.createElement('td')
            row_data_3.textContent = `${ formatDate(vencimiento) }`

            let row_data_4 = document.createElement('td')
            row_data_4.textContent = `${ cantidad }`

            let row_data_5 = document.createElement('td')
            row_data_5.textContent = `${ precioServ.toFixed(2) }`
            
            row.appendChild(row_data_1)
            row.appendChild(row_data_2)
            row.appendChild(row_data_3)
            row.appendChild(row_data_4)
            row.appendChild(row_data_5)
            
            tbody.appendChild(row)

            // Calcular e imprimir importeTotal
            calcularImporteTotal( precioServ )
            let importe = document.querySelector('#importeTotal')
            importe.textContent = importeTotal.toFixed(2)
        }
        importeTotal = 0
    })
    .catch(error => console.error(error))
}

// Calcular importe total
let importeTotal = 0
const calcularImporteTotal = precioServ => {
    importeTotal += precioServ
    return importeTotal
}

// Formatear vencimiento
const formatDate = vencimiento => {
    vencimiento.slice(0, 10)

    const datePart = vencimiento.match(/\d+/g),
    year = datePart[0].substring(0),
    month = datePart[1],
    day = datePart[2]

    return day+'/'+month+'/'+year
}

// Si viene id en la URL, se ejecuta.
if ( window.location.search ) {
    const id = getParameter('id')
    customerPromise(id)
}