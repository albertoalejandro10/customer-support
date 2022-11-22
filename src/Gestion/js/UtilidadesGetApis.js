import { getParameter } from "../../jsgen/Helper"
import { get_startMonth, get_rubros, get_salesLine, get_branchOffices, get_docsTypes } from "../../jsgen/Apis-Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_startMonth( tkn )
    get_rubros( tkn )
    get_salesLine( tkn )
    get_branchOffices( tkn )
    get_docsTypes( tkn )
}