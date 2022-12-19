import { getParameter } from "../../jsgen/Helper"
import { get_cardGroups } from "../../jsgen/Apis-Helper-BancaValores"


// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_cardGroups( tkn )
}
document.getElementById('to-date').value = (new Date().toLocaleDateString('en-GB')).split('/').reverse().join('-')