import { getParameter } from '../../jsgen/Helper'
import { get_startMonth, get_businessUnits, get_branchOffices, get_provinces, get_origins } from '../../jsgen/Apis-Helper'

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    // Informacion del periodo desde-hasta
    get_startMonth( tkn )
    // U. de negocio:
    get_businessUnits( tkn )
    // Sucursal:
    get_branchOffices( tkn )
    // Provincias:
    get_provinces( tkn )
    // Origenes
    get_origins( tkn )
}