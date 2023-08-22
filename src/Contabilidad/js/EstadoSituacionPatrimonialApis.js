import { getParameter } from "../../jsgen/Helper"
import { get_startMonth, get_businessUnits, get_costCenter } from "../../jsgen/Apis-Helper"

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
  get_businessUnits(tkn)
  get_startMonth(tkn)
  get_costCenter(tkn)
}