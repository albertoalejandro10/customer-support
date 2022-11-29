import { getParameter } from "../../jsgen/Helper"
import { get_businessUnits, get_seatType } from "../../jsgen/Apis-Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_businessUnits( tkn )
    get_seatType( tkn )
}