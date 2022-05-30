import { getParameter } from "../../jsgen/Helper"

// Listado Rubros
const get_Entry = tkn => {
    const url_getEntry = 'https://www.solucioneserp.net/listados/productos/get_rubros'
    fetch( url_getEntry, {
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

// Listado lineas
const get_Lines = tkn => {
    const url_getLines = 'https://www.solucioneserp.net/listados/productos/get_lineas'
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

            const select = document.querySelector('#line')
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

// Listado depositos
const get_Deposits = tkn => {
    const url_getDeposits = 'https://www.solucioneserp.net/listados/get_depositos'
    fetch( url_getDeposits, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const deposits = resp
        for (const element of deposits) {
            const { id, nombre } = element

            const select = document.querySelector('#deposit')
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
    get_Entry( tkn )
    get_Lines( tkn )
    get_Deposits( tkn )
}

const today = new Date().toLocaleDateString('en-GB')
const date = today.split('/').reverse().join('-')
const dateElement = document.getElementById('to-date')
dateElement.value = date