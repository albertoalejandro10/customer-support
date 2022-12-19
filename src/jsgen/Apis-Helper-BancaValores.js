// Listado de cuentas estado (Valores)
export const get_statusAccount = tkn => {
    const url_getStatusAccount = 'https://www.solucioneserp.net/bancosyvalores/reportes/get_cuentas_estado'
    fetch( url_getStatusAccount, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const statusAccounts = resp
        for (const element of statusAccounts) {
            const { codigo, nombre } = element
            // console.log(codigo, nombre)
            const select = document.querySelector('#status')
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

// Listado de tipos de periodo (Valores)
export const get_periodType = tkn => {
    const url_getPeriodType = 'https://www.solucioneserp.net/bancosyvalores/reportes/get_tipos_periodo'
    fetch( url_getPeriodType, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const periodTypes = resp
        for (const element of periodTypes) {
            const { codigo, nombre } = element
            // console.log(codigo, nombre)
            const select = document.querySelector('#period-type')
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
// Listado de orden (Valores)
export const get_order = tkn => {
    const url_getOrder = 'https://www.solucioneserp.net/bancosyvalores/reportes/get_tipos_orden'
    fetch( url_getOrder, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const Orders = resp
        for (const element of Orders) {
            const { codigo, nombre } = element
            // console.log(codigo, nombre)
            const select = document.querySelector('#order')
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
// Listado de Valor (Valores)
export const get_value = tkn => {
    const url_getValue = 'https://www.solucioneserp.net/bancosyvalores/reportes/get_tipos_valores'
    fetch( url_getValue, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const values = resp
        for (const element of values) {
            const { id, nombre } = element
            // console.log(id, nombre)
            const select = document.querySelector('#value')
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

/*
    *bancosyvalores/conciliar_tarjetas/get_grupos_tarjetas
*/
export const get_cardGroups = tkn => {
    const url_getCardGroups = 'https://www.solucioneserp.net/bancosyvalores/conciliar_tarjetas/get_grupos_tarjetas'
    fetch( url_getCardGroups, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const cardGroups = resp
        for (const element of cardGroups) {
            const { id, codigo, nombre } = element
            // console.log(id, codigo, nombre)
            const select = document.querySelector('#group')
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