import { getParameter } from "../../jsgen/Helper"
import { get_rubros, get_salesLine } from "../../jsgen/Apis-Helper"

// Listado Listas
const get_lists = tkn => {
    const url_getLists = process.env.Solu_externo + '/listados/productos/get_listas'
    fetch( url_getLists, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( lists => lists.json() )
    .then( lists => {
        for (const list of lists) {
            const { id, nombre } = list

            if ( ! (id === 0) ) {
                // console.log(id, nombre)
                const select = document.querySelector('#list')
                let option = document.createElement("option")
                option.setAttribute("data-tokens", nombre)
                option.value = id
                option.textContent = nombre
                
                select.appendChild( option )
            }

        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_rubros( tkn )
    get_salesLine( tkn )
    get_lists( tkn )
}

const today = new Date().toLocaleDateString('en-GB')
const date = today.split('/').reverse().join('-')
const dateElement = document.getElementById('to-date')
dateElement.value = date