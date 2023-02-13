import { getParameter } from "../../jsgen/Helper"
import { get_accountsPayableBalance, get_businessUnits, get_startMonth } from "../../jsgen/Apis-Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_businessUnits( tkn )
    get_startMonth( tkn )
    get_accountsPayableBalance( tkn )
}