import { get_businessUnits, get_customersGroups, get_startMonth } from "../../jsgen/Apis-Helper"
import { getParameter } from "../../jsgen/Helper"

// Listado comprobantes de ventas
const get_salesDocs = tkn => {
    const url_getSalesDocs = process.env.Solu_externo + '/listados/get_doc_ventas'
    fetch( url_getSalesDocs, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( customers => customers.json() )
    .then( customers => {
        for (const customer of customers) {
            const { id, nombre } = customer
            // console.log(id, nombre)

            const select = document.querySelector('#voucher')
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
    get_startMonth( tkn )
    get_salesDocs( tkn )
    get_businessUnits( tkn )
    get_customersGroups( tkn )
}