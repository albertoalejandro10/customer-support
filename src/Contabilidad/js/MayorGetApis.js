import { getParameter } from "../../jsgen/Helper"
import { get_businessUnits, get_coins, get_startMonth, get_costCenter } from "../../jsgen/Apis-Helper"

// Listado Análisis de cuenta (Mayor de cuentas)
const get_AccountPlan = tkn => {
    const url_getAccountPlan = 'https://www.solucioneserp.net/listados/get_plan_cuenta'
    fetch( url_getAccountPlan, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            "tipo": 1,
            "alfa": 1,
            "todos": 1
        })
    })
    .then( resp => resp.json() )
    .then( resp => {
        const accountPlan = resp
        for (const element of accountPlan) {
            const { id, codigo, nombre } = element
            // console.log(id, codigo, nombre)
            const select = document.querySelector('#account')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = codigo
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
    // Informacion del periodo desde-hasta
    get_startMonth( tkn )
    // U. de negocio:
    get_businessUnits( tkn )
    // Moneda:
    get_coins( tkn )
    // Analisis de cuenta
    get_costCenter( tkn )
    // Listado de cuentas
    get_AccountPlan(tkn)
}