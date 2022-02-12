import * as bootstrap from 'bootstrap';
import * as bootstrapSelect from 'bootstrap-select';

fetch(`https://62048c21c6d8b20017dc3571.mockapi.io/api/v1/customers`)
    .then( resp => resp.json() )
    .then( resp => {
        const customers = resp
        customers.forEach(element => {
            const { nombre, id } = element
            // console.log(nombre, Number(id))
            // let select = document.getElementById("clientes")
            let select = document.querySelector('.selectpicker')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.setAttribute("data-content", nombre)
            option.value = id
            option.textContent = nombre

            select.appendChild(option)
        })
    })



fetch(`https://62048c21c6d8b20017dc3571.mockapi.io/api/v1/customers/1/Services`)
    .then( resp => resp.json() )
    .then( resp => {
        const array = resp
        array.forEach(element => {
            const {codigoServ, nombreServ, precioServ, cantidad, vencimiento, id, clienteid} = element
            // console.log(codigoServ, nombreServ, precioServ, cantidad, vencimiento, id, clienteid)
            let tbody = document.getElementById('tbody')
            let row = document.createElement('tr')

            let row_data_1 = document.createElement('td')
            row_data_1.innerHTML = `${codigoServ}`

            let row_data_2 = document.createElement('td')
            row_data_2.innerHTML = `${nombreServ}`

            let row_data_3 = document.createElement('td')
            row_data_3.innerHTML = `${vencimiento}`

            let row_data_4 = document.createElement('td')
            row_data_4.innerHTML = `${cantidad}`

            let row_data_5 = document.createElement('td')
            row_data_5.innerHTML = `${precioServ}`

            row.appendChild(row_data_1)
            row.appendChild(row_data_2)
            row.appendChild(row_data_3)
            row.appendChild(row_data_4)
            row.appendChild(row_data_5)

            tbody.appendChild(row)
        })
    });