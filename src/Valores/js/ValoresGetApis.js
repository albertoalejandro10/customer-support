import { getParameter } from "../../jsgen/Helper"
import { get_businessUnits, get_startMonth } from "../../jsgen/Apis-Helper"
import { get_statusAccount, get_periodType, get_order, get_value, get_detValues } from "../../jsgen/Apis-Helper-BancaValores"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    // Informacion del periodo desde-hasta
    get_startMonth( tkn )
    // U. de negocio:
    get_businessUnits( tkn )
    // Estado:
    get_statusAccount( tkn )
    // Periodo:
    get_periodType( tkn )
    // Order:
    get_order( tkn )
    // Value:
    get_value( tkn )
    // Det-Values:
    get_detValues( tkn )
}