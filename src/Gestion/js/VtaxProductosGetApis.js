import { get_branchOffices, get_debtCollector, get_docsTypes, get_rubros, get_salesLine } from "../../jsgen/Apis-Helper"
import { getParameter, get_StartPeriod } from "../../jsgen/Helper"

// Listado tipos de clientes
const get_customersType = tkn => {
    const url_getCustomersType = process.env.Solu_externo + '/listados/get_tipos_clientes'
    fetch( url_getCustomersType, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const customersType = resp
        for (const element of customersType) {
            const { id, detalle } = element
            // console.log(id, detalle)

            const select = document.querySelector('#customer-type')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", detalle)
            option.value = id
            option.textContent = detalle
            
            select.appendChild( option )
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado de tipos de Precios
const get_pricesTypes = tkn => {
    const url_getPricesTypes = process.env.Solu_externo + '/listados/ventas/get_tipos_precio'
    fetch( url_getPricesTypes, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const pricesTypes = resp
        for (const element of pricesTypes) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#price')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            
            select.appendChild( option )
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
    get_debtCollector( tkn )
    get_pricesTypes( tkn )

    get_StartPeriod( tkn )
    get_salesLine( tkn )
    get_customersType( tkn )

    get_branchOffices( tkn )
    get_docsTypes( tkn )
}