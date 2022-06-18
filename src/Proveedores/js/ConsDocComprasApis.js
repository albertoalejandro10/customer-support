import { getParameter } from "../../jsgen/Helper"
import { get_businessUnits, get_startMonth, get_purchaseDocuments } from "../../jsgen/Apis-Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_startMonth( tkn )
    get_businessUnits( tkn )
    get_purchaseDocuments( tkn )
}