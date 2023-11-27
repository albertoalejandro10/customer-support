import { getParameter } from "../../jsgen/Helper"
import { get_deposits, get_voucherType, get_products, get_startMonth } from "../../jsgen/Apis-Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
	get_deposits( tkn )
	get_voucherType( tkn )
	get_products( tkn )
	get_startMonth( tkn )
}