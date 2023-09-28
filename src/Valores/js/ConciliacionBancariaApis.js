import { getParameter } from "../../jsgen/Helper"
import { get_businessUnitsBankReconciliation, get_bankAccountsBankReconciliation, get_orderBankReconciliation } from "../../jsgen/Apis-Helper-BancaValores"

const today = new Date().toLocaleDateString('en-GB')
document.getElementById('date').value = today.split('/').reverse().join('-')

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
  get_businessUnitsBankReconciliation(tkn)
  get_bankAccountsBankReconciliation(tkn)
  get_orderBankReconciliation(tkn)
}