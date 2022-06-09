import { getParameter } from "../../jsgen/Helper"
import { get_startPeriod, get_businessUnits,  } from "../../jsgen/Apis-Helper"

// Conseguir documentos de compra
const get_purchaseDocuments = tkn => {
    const url_getPurchaseDocuments = 'https://www.solucioneserp.net/listados/get_doc_compras'
    fetch( url_getPurchaseDocuments, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const documents = resp
        for (const element of documents) {
            const { id, nombre } = element
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
    // get_startPeriod( tkn )
    get_businessUnits( tkn )
    get_purchaseDocuments( tkn )
}

const today = new Date().toLocaleDateString('en-GB')
const monthYear = today.slice(2)
const todayDefault = '01' + monthYear
const startDate = todayDefault.split('/').reverse().join('-')
const periodStart = document.getElementById('periodStart')
periodStart.value = startDate
// periodStart.disabled = true

// End Period
const endDate = today.split('/').reverse().join('-')
const periodEnd = document.getElementById('periodEnd')
periodEnd.value = endDate
// periodEnd.disabled = true