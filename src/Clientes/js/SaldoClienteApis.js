import { getParameter } from "../../jsgen/Helper"

// Listado unidades de negocios
const get_BusinessUnits = tkn => {
    const url_getBusinessUnits = 'https://www.solucioneserp.net/listados/get_unidades_negocio'
    fetch( url_getBusinessUnits, {
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

            const select = document.querySelector('#business')
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

// Listado tipos clientes todos
const get_AllCustomersType = tkn => {
    const url_getAllCustomersType = 'https://www.solucioneserp.net/listados/get_tipos_clientes_todos'
    fetch( url_getAllCustomersType, {
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
            const { id, detalle } = element
            // console.log(id, detalle)

            const select = document.querySelector('#customer-type')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", detalle)
            option.value = id
            option.textContent = detalle.replace('(', '').replace(')', '')
            
            select.appendChild( option )

            const selectDefault = 1
            if ( id === selectDefault ) {
                select.value = 1
            }
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado grupos clientes
const get_CustomersGroup = tkn => {
    const url_getCustomersGroup = 'https://www.solucioneserp.net/listados/get_grupos_clientes'
    fetch( url_getCustomersGroup, {
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
            const { id, nombre, tipo } = element
            // console.log(id, nombre, tipo)

            const select = document.querySelector('#customer-groups')
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

// Listado estados deudores
const get_DebtStates = tkn => {
    const url_getDebtStates = 'https://www.solucioneserp.net/listados/get_estados_deudores'
    fetch( url_getDebtStates, {
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
            const { codigo, estado } = element
            // console.log(codigo, estado)

            const select = document.querySelector('#state')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", estado)
            option.value = codigo
            option.textContent = estado
            
            select.appendChild( option )
        }
    })
    .catch( err => {
        console.log( err )
    })
}


// Listado deudores
const get_DebtCollectors = tkn => {
    const url_getDebtCollectors = 'https://www.solucioneserp.net/listados/get_cobradores'
    fetch( url_getDebtCollectors, {
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

            const select = document.querySelector('#debt-collector')
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

// Listado saldo orden
const get_BalanceOrder = tkn => {
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
    get_BusinessUnits( tkn )
    get_AllCustomersType( tkn )
    get_CustomersGroup( tkn )
    get_DebtCollectors( tkn )
    get_BalanceOrder( tkn )
    get_DebtStates( tkn )
}

const today = new Date().toLocaleDateString('en-GB')
const year = today.slice(6)
const todayDefault = '01/01/' + year
const startDate = todayDefault.split('/').reverse().join('-')
const periodStart = document.getElementById('periodStart')
periodStart.value = startDate

// End Period
const endDate = today.split('/').reverse().join('-')
const periodEnd = document.getElementById('periodEnd')
periodEnd.value = endDate