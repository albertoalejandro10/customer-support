import { getParameter, get_StartPeriod } from "../../jsgen/Helper"
import { get_businessUnits, get_debtCollector, get_allCustomersType, get_customersGroups, get_status } from '../../jsgen/Apis-Helper'

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_StartPeriod( tkn )
    get_businessUnits( tkn )
    get_allCustomersType( tkn )
    get_customersGroups( tkn )
    get_debtCollector( tkn )
    get_status( tkn )
}