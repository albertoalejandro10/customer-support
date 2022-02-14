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

            let select = document.querySelector('.selectpicker')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.setAttribute("data-content", nombre)
            option.value = id
            option.textContent = nombre

            select.appendChild( option )
        }
    })

// Fetch para traer e imprimir datos de los servicios del cliente. 
fetch(`https://62048c21c6d8b20017dc3571.mockapi.io/api/v1/customers/1/Services`)
    .then( resp => resp.json() )
    .then( resp => {
        const services = resp
        for ( let element of services) {

            // Desestructuracion del objeto element
            const {codigoServ, nombreServ, precioServ, cantidad, vencimiento, id, clienteid} = element
            // console.log( codigoServ, nombreServ, precioServ, cantidad, vencimiento, id, clienteid )

            // Formatear - Fecha de vencimiento
            let vencimientoServ = vencimiento.slice(0, 10)

            // Calcular - Importe total
            calcularImporteTotal( precioServ )

            // Imprimir datos en la tabla
            let tbody = document.getElementById('tbody')
            let row = document.createElement('tr')

            let row_data_1 = document.createElement('td')
            row_data_1.textContent = `${ codigoServ }`

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
            importe.textContent = importeTotal
            
        }
    })


let importeTotal = 0
const calcularImporteTotal = ( precioServ ) => {
    importeTotal += precioServ
    return importeTotal
}