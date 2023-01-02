import { get_fieldList, get_lists, get_operations, get_provider, get_rounding, get_rubros, get_salesLine } from "../../jsgen/Apis-Helper"
import { getParameter } from "../../jsgen/Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_fieldList( tkn )
    get_lists( tkn )
    get_operations( tkn )
    get_rounding( tkn )
    get_provider( tkn )
    get_rubros( tkn )
    get_salesLine( tkn )
}