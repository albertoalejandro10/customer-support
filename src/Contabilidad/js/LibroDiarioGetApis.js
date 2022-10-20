import { getParameter } from "../../jsgen/Helper"
import { get_startMonth, get_businessUnits } from "../../jsgen/Apis-Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_startMonth( tkn )
    get_businessUnits( tkn )
}