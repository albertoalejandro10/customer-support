import { getParameter } from "../../jsgen/Helper"

const get_customers = (tkn, data) => {
  const url_getCustomers = process.env.Solu_externo + '/formularios/clientes/get_clientes'
  fetch( url_getCustomers , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify(data)
  })
  .then( customers => customers.json() )
  .then( ({resultado, clientes}) => {
    if (!resultado === 'ok') return
    // console.log(resultado, clientes)
    document.getElementById('send-mail').disabled = false
    topCheckbox.disabled = false

    // Eliminar elementos de la tabla
    const tableHeaderRowCount = 1
    const table = document.getElementById('full-table')
    const rowCount = table.rows.length
    for (let i = tableHeaderRowCount; i < rowCount; i++) {
        table.deleteRow(tableHeaderRowCount)
    }

    for (const customer of clientes) {
      printCustomersOnTable(customer)
    }
  })
  .catch( err => {
  })
}

const printCustomersOnTable = ({id, nombre}) => {
  const row = document.createElement('tr')

  const row_data_1 = document.createElement('td')
  row_data_1.textContent = nombre

  const row_data_2 = document.createElement('td')
  row_data_2.innerHTML = `<input type="checkbox" name='checkbox-${id}' id='${id}'>`
  
  row.appendChild(row_data_1)
  row.appendChild(row_data_2)
  
  document.getElementById('full-tbody').appendChild(row)
}

const topCheckbox = document.getElementById('checkAllCheckboxes')
topCheckbox.addEventListener('click', () => {
  const targets = Array.from(document.querySelectorAll(`#full-table input[type='checkbox']`))
  targets.shift()
  if (topCheckbox.checked) {
    checkAll(targets)
  } else {
    uncheckAll(targets)
  }
})

const checkAll = targets => {
  targets.forEach(checkElement => {
    checkElement.checked = true
  })
}

const uncheckAll = targets => {
  targets.forEach(checkElement => {
    checkElement.checked = false
  })
}

// * Conseguir todos los checkboxes de la tabla
const getCheckboxes = () => {
  target.forEach(checkElement => {
    checkElement.checked = true
    checkElement.disabled = true
    document.getElementById(`fechaPago-${checkElement.id}`).textContent = fechaPagoDefault
    const totalTarget = document.getElementById(`tr-${checkElement.id}`).textContent
    const trTotal = Number(reverseFormatNumber(totalTarget, 'de'))
    total.value = format_number(calcularImporteTotal(trTotal))
    getLineaToAPI(checkElement, true)
    document.getElementById('total').textContent = total.value === '-0,00' ? '0,00' : total.value
})
}

// Boton actualizar
const tkn = getParameter('tkn')
const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)

  const tipoEnvioId = 1
  const tipoClienteId = Number(formData.get('customer-type'))
  const grupoClienteId = Number(formData.get('customer-group'))
  const condicionId = Number(formData.get('condition'))
  const valor = Number(formData.get('value-x'))

  const avisoDatos = {
    tipoEnvioId,
    tipoClienteId,
    grupoClienteId,
    condicionId,
    valor
  }
  console.log( {avisoDatos} )
  get_customers( tkn, {avisoDatos} )
})