import { getParameter } from "../../jsgen/Helper"

const insertOption = 1
const editOption = 2
const deleteOption = 3
const printIndexesOnTable = (id, nombre, index) => {
  const row = document.createElement('tr')
  const row_data_1 = document.createElement('td')
  row_data_1.textContent = nombre
  const row_data_2 = document.createElement('td')
  row_data_2.innerHTML = index

  const buttonInsert = document.createElement('button')
  buttonInsert.title = 'Insertar índice'
  buttonInsert.type = 'button'
  buttonInsert.id = id
  buttonInsert.setAttribute('option', insertOption);
  buttonInsert.innerHTML = '<i class="fa-solid fa-plus mx-0"></i>'
  buttonInsert.className = 'btn btn-primary table-button'
  
  const buttonEdit = document.createElement('button')
  buttonEdit.title = 'Editar índice'
  buttonEdit.type = 'button'
  buttonEdit.id = id
  buttonEdit.setAttribute('option', editOption);
  buttonEdit.innerHTML = '<i class="fa-solid fa-pen-to-square mx-0"></i>'
  buttonEdit.className = 'btn btn-success table-button'
  
  const buttonDelete = document.createElement('button')
  buttonDelete.title = 'Eliminar índice'
  buttonDelete.type = 'button'
  buttonDelete.id = id
  buttonDelete.setAttribute('option', deleteOption)
  buttonDelete.innerHTML = '<i class="fa-solid fa-minus mx-0"></i>'
  buttonDelete.className = 'btn btn-danger table-button'
  
  const row_data_3 = document.createElement('td')
  row_data_3.appendChild(buttonInsert)
  row_data_3.appendChild(buttonEdit)
  row_data_3.appendChild(buttonDelete)

  
  row.appendChild(row_data_1)
  row.appendChild(row_data_2)
  row.appendChild(row_data_3)
  document.getElementById('full-tbody').appendChild(row)
}

const get_indexes = tkn => {
  fetch(process.env.NewSolu_externo + '/inventario/formularios/get_indices', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then(indexes => indexes.json())
  .then(({indices: indexes}) => {
    // console.log(indexes)
    // Eliminar elementos de la tabla
    const tableHeaderRowCount = 1
    const table = document.getElementById('full-table')
    const rowCount = table.rows.length
    for (let i = tableHeaderRowCount; i < rowCount; i++) {
      table.deleteRow(tableHeaderRowCount)
    }
    
    for (const {id, nombre: name, indice: index} of indexes) {
      printIndexesOnTable(id, name, index)
    }
    get_tableButtons()
  })
  .catch( error => console.log(error))
}

const tkn = getParameter('tkn')
if ( tkn ) {
  get_indexes( tkn )
}

// Boton actualizar
document.getElementById('update').addEventListener('click', (event) => {
  event.preventDefault()
  get_indexes( tkn )
})

const get_tableButtons = () => {
  const buttons = document.querySelectorAll('#full-table button')
  for (const button of buttons) {
    button.addEventListener("click", event => {
      event.preventDefault()
      // console.log(event.currentTarget.getAttribute('id'));
      // console.log(event.currentTarget.getAttribute('option'));
      if ( Number(event.currentTarget.getAttribute('option')) === insertOption) {
        console.log('insert button');
      }
      if ( Number(event.currentTarget.getAttribute('option')) === editOption) {
        console.log('edit button');
      }
      if ( Number(event.currentTarget.getAttribute('option')) === deleteOption) {
        console.log('delete button');
      }
    })
  }
}