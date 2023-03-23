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
    const checkboxes = Array.from(document.querySelectorAll("#full-table input[type='checkbox']"))
    checkboxes.forEach(checkbox => {
      checkbox.disabled = false
      checkbox.checked = false
    })
    linea = []

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
    getAllCheckboxes()
  })
  .catch( err => err )
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
  const targets = Array.from(document.querySelectorAll("#full-table input[type='checkbox']"))
  targets.shift()
  if (topCheckbox.checked) {
    checkAll(targets)
  } else {
    uncheckAll(targets)
  }
})

let linea = []
const checkAll = targets => {
  targets.forEach(target => {
    target.checked = true
    target.disabled = true
    linea.push(Number(target.id))
  })
}

const uncheckAll = targets => {
  targets.forEach(target => {
    target.checked = false
    target.disabled = false
    linea.shift(Number(target.id))
  })
}

// get all checkboxes in grid
const getAllCheckboxes = () => {
  const checkboxes = Array.from(document.querySelectorAll("#full-table input[type='checkbox']"))
  const topCheckbox = checkboxes.shift()
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', event => {
      const isAllCheckboxesChecked = checkboxes.filter(checkbox => checkbox.checked === true)
      topCheckbox.disabled = true
      if (isAllCheckboxesChecked.length === 0) {topCheckbox.disabled = false}
      if(event.target.checked) {
        linea.push(Number(event.target.id))
      } else {
        linea.shift(Number(event.target.id))
      }
    })
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
  // console.log( {avisoDatos} )
  get_customers( tkn, {avisoDatos} )
})

const id = getParameter('id')
document.getElementById('send-mail').addEventListener('click', () => {
  fetch( process.env.Solu_externo + '/maestros/clientes/get_avisoId' , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify({avisoId: id})
  })
  .then( notice => notice.json() )
  .then( ({avisoDatos, resultado}) => {
    if (!resultado === 'ok') return
    if (linea.length === 0) return alert('Debe marcar al menos un cliente')
    const {titulo, mensaje} = avisoDatos
    const data = {
      "avisoDatos":{
          titulo,
          mensaje,
      },
      "clientes": linea
    }
    // console.log(data)
    sendNotice(data)
  })
  .catch( err => err)
})

const sendNotice = data => {
  fetch( process.env.Solu_externo + '/formularios/clientes/enviar_aviso' , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify(data)
  })
  .then( sendNotice => sendNotice.json())
  .then( ({resultado, mensaje}) => {
    if (!resultado === 'ok') return
    alert(`${resultado} - ${mensaje}`)
  })
}