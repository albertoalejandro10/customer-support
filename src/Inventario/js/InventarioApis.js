import { get_deposits, get_rubros, get_salesLine } from "../../jsgen/Apis-Helper"
import { getParameter } from "../../jsgen/Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_rubros( tkn )
    get_salesLine( tkn )
    get_deposits( tkn )
}

const today = new Date().toLocaleDateString('en-GB')
const date = today.split('/').reverse().join('-')
const dateElement = document.getElementById('to-date')
dateElement.value = date