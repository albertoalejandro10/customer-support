import { getParameter } from "../../jsgen/Helper"
import { get_businessUnits, get_startMonth } from "../../jsgen/Apis-Helper"
import { get_accountsLibroBanco, get_operationsLibroBanco } from "../../jsgen/Apis-Helper-BancaValores"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
	get_businessUnits( tkn )
	get_startMonth( tkn )
	get_accountsLibroBanco( tkn )
	get_operationsLibroBanco( tkn )
}