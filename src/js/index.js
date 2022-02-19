import * as bootstrap from 'bootstrap'
import * as bootstrapSelect from 'bootstrap-select'

// Fetch para traer datos de clientes (nombre y id)
fetch(`https://62048c21c6d8b20017dc3571.mockapi.io/api/v1/customers`)
.then( resp => resp.json() )
.then( resp => {
    const customers = resp
    for ( let element of customers ) {

        // Desestructuracion del objeto element
        const { nombre, id } = element
        // console.log(nombre, Number(id))

        let select = document.querySelector('.picker')
        let option = document.createElement("option")
        // option.setAttribute("data-tokens", nombre)
        // option.setAttribute("data-content", nombre)
        option.setAttribute("name", nombre)
        option.value = id
        option.textContent = nombre
        
        select.appendChild( option )
    }
})

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
        for ( let element of services) {
            
            let tbody = document.getElementById('tbody')
            if ( tbody.children.length === 1) {
                let item = document.getElementById('delete-row')
                tbody.removeChild(item)
            }

            // Desestructuracion del objeto element
            const {codigoServ, nombreServ, precioServ, cantidad, vencimiento, id, clienteid} = element
            // console.log( codigoServ, nombreServ, precioServ, cantidad, vencimiento, id, clienteid )

            // Formatear - Fecha de vencimiento
            let vencimientoServ = vencimiento.slice(0, 10)
            
            // Calcular - Importe total
            calcularImporteTotal( precioServ )
            
            // Imprimir datos en la tabla
            let row = document.createElement('tr')
            row.id = 'delete-row'

            let row_data_1 = document.createElement('td')
            let row_data_1_anchor = document.createElement('a')
            row_data_1_anchor.href = `/service.html?id=${id}`
            row_data_1_anchor.textContent = `${ codigoServ }`
            row_data_1.appendChild(row_data_1_anchor)

            let row_data_2 = document.createElement('td')
            row_data_2.textContent = `${ nombreServ }`

            let row_data_3 = document.createElement('td')
            row_data_3.textContent = `${ vencimientoServ }`

            let row_data_4 = document.createElement('td')
            row_data_4.textContent = `${ cantidad }`

            let row_data_5 = document.createElement('td')
            row_data_5.textContent = `${ precioServ }`
            
            row.appendChild(row_data_1)
            row.appendChild(row_data_2)
            row.appendChild(row_data_3)
            row.appendChild(row_data_4)
            row.appendChild(row_data_5)
            
            tbody.appendChild(row)

            // Imprimir importe total
            let importe = document.querySelector('#importeTotal')
            importe.textContent = importeTotal.toFixed(2)
            importeTotal = 0
            
        }
    })
}

let importeTotal = 0
const calcularImporteTotal = precioServ => {
    importeTotal += precioServ
    return importeTotal
}

// Si viene id en la URL, se ejecuta.
if ( window.location.search ) {
    const id = getParameter('id')
    customerPromise(id)
}

// Imprimir nombre del cliente 
// if ( window.location.search ) {
//     let customerName = document.getElementsByClassName('customerName')
//     let i = 0
//     do {
//         customerName[i].textContent = (getParameter('name')).replace('-', ' ')
//         i++
//     } while ( i < customerName.length)
// }