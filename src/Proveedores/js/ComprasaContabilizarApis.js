import { getParameter } from "../../jsgen/Helper"
import { get_businessUnitsWithoutAll, get_seatType } from "../../jsgen/Apis-Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_businessUnitsWithoutAll( tkn )
    get_seatType( tkn )
}
document.getElementById('seat-date').value = (new Date().toLocaleDateString('en-GB')).split('/').reverse().join('-')