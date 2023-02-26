import { getParameter } from "../../jsgen/Helper"
import { get_accounts, get_startPeriod, get_customers } from "../../jsgen/Apis-Helper"

// Listado unidades de negocios
export const get_businessUnits = tkn => {
    const url_getBusinessUnits = process.env.Solu_externo + '/listados/get_unidades_negocio'
    fetch( url_getBusinessUnits, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const business = resp
        for (const element of business) {
            const { id, nombre } = element
            // console.log(id, nombre)
            if ( nombre.toLowerCase() != 'todos') {
                const select = document.querySelector('#business')
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
    get_accounts( tkn )
    get_customers( tkn )
    get_businessUnits( tkn )
    get_startPeriod( tkn )
}