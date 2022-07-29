import { getParameter } from "../../jsgen/Helper"
import { get_startPeriod, get_businessUnits, get_coins, get_customers, get_status } from "../../jsgen/Apis-Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_businessUnits( tkn )
    get_startPeriod( tkn )
    get_status( tkn )
    get_customers( tkn )
    get_coins( tkn )
}