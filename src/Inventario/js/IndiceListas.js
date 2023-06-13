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

const get_indices = tkn => {
  fetch(process.env.NewSolu_externo + '/inventario/formularios/get_indices', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then(indices => indices.json())
  .then( indices => {
    console.log(indices)
  })
  .catch( error => console.log(error))
}

// Boton actualizar
document.getElementById('update').addEventListener('click', (event) => {
  event.preventDefault()
  get_indices( tkn )
})

const tkn = getParameter('tkn')
if ( tkn ) {
  get_indices( tkn )
}