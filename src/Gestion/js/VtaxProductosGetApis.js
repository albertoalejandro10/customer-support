import { getParameter, get_StartPeriod } from "../../jsgen/Helper"

// Listado de Rubros
const get_Rubros = tkn => {
    const url_getRubros = 'https://www.solucioneserp.net/listados/productos/get_rubros'
    fetch( url_getRubros, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const entries = resp
        for (const element of entries) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#entry')
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

// Listado de Lineas
const get_Lines = tkn => {
    const url_getLines = 'https://www.solucioneserp.net/listados/productos/get_rubros'
    fetch( url_getLines, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const lines = resp
        for (const element of lines) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#sellers')
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

// Listado tipos de clientes
const get_CustomersType = tkn => {
    const url_getCustomersType = 'https://www.solucioneserp.net/listados/get_tipos_clientes'
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

// Listado tipos de clientes
const get_DocsTypes = tkn => {
    const url_getDocsTypes = 'https://www.solucioneserp.net/listados/ventas/get_tipos_documento'
    fetch( url_getDocsTypes, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const docsTypes = resp
        for (const element of docsTypes) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#documents')
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

// Listado de Lineas de Ventas
const get_SalesLines = tkn => {
    const url_getSalesLines = 'https://www.solucioneserp.net/listados/get_cobradores'
    fetch( url_getSalesLines, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const salesLines = resp
        for (const element of salesLines) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#line-sales')
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

// Listado de Subsidiarias
const get_Subsidiaries = tkn => {
    const url_getSubsidiaries = 'https://www.solucioneserp.net/listados/get_sucursales'
    fetch( url_getSubsidiaries, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const subsidiaries = resp
        for (const element of subsidiaries) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#subsidiary')
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

// Listado de tipos de Precios
const get_PricesTypes = tkn => {
    const url_getPricesTypes = 'https://www.solucioneserp.net/listados/ventas/get_tipos_precio'
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
    get_Rubros( tkn )
    get_Lines( tkn )
    get_CustomersType( tkn )
    get_SalesLines( tkn )
    get_DocsTypes ( tkn )
    get_Subsidiaries( tkn )
    get_PricesTypes( tkn )
    get_StartPeriod( tkn )
}