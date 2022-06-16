import { getParameter } from "../../jsgen/Helper"
import { get_customers, get_businessUnits, get_status, get_coins, get_startMonth, get_branchOffices, get_debtCollector } from "../../jsgen/Apis-Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    // Informacion del periodo desde-hasta
    get_startMonth( tkn )
    // Rellenar select2-Clientes
    get_customers( tkn )
    // U. de negocio:
    get_businessUnits( tkn )
    // Estado:
    get_status( tkn )
    // Moneda:
    get_coins( tkn )
    // Cobrador:
    get_debtCollector( tkn )
    // Sucursal:
    get_branchOffices( tkn )
}