import { getParameter } from "../../jsgen/Helper"
import { get_startPeriod, get_businessUnits, get_coins, get_suppliers, get_status } from "../../jsgen/Apis-Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_businessUnits( tkn )
    get_coins( tkn )
    get_suppliers( tkn )
    get_startPeriod( tkn )
    get_status( tkn )
}