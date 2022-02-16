import * as bootstrap from 'bootstrap'
import * as selectpicker from 'bootstrap-select'

// Fetch para traer datos de clientes (detalle y id)
fetch(`https://62048c21c6d8b20017dc3571.mockapi.io/api/v1/productos`)
    .then( resp => resp.json() )
    .then( resp => {
        const products = resp
        for ( let element of products ) {

            // Desestructuracion del objeto element
            const { detalle, id } = element
            console.log(detalle, Number(id))

            let select = document.querySelector('.selectpicker')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", detalle)
            option.setAttribute("data-content", detalle)
            option.value = id
            option.textContent = detalle

            select.appendChild( option )

        }
    })