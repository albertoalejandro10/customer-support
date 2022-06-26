import { getParameter, get_StartPeriod } from "../../jsgen/Helper"
import { get_businessUnits, get_debtCollector, get_allCustomersType, get_customersGroups, get_status } from '../../jsgen/Apis-Helper'

// Listado saldo orden
const get_balanceOrder = tkn => {
    const url_getBalanceOrder = 'https://www.solucioneserp.net/reportes/clientes/get_saldo_orden_listado'
    fetch( url_getBalanceOrder, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const customers = resp
        for (const element of customers) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#orden-by')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            
            select.appendChild( option )

            const selectDefault = 2
            if ( id === selectDefault ) {
                select.value = 2
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
    get_StartPeriod( tkn )
    get_businessUnits( tkn )
    get_allCustomersType( tkn )
    get_customersGroups( tkn )
    get_debtCollector( tkn )
    get_balanceOrder( tkn )
    get_status( tkn )
}