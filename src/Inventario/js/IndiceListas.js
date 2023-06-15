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
  
  const buttonInsert = Object.assign(document.createElement('button'), {
    title: 'Insertar índice',
    type: 'button',
    id,
    name: nombre.trim(),
    innerHTML: '<i class="fa-solid fa-plus mx-0 mx-0"></i>',
    className: 'btn btn-primary table-button'
  })
  buttonInsert.setAttribute('option', insertOption)
  buttonInsert.setAttribute('index', index)

  const buttonEdit = Object.assign(document.createElement('button'), {
    title: 'Editar índice',
    type: 'button',
    id,
    name: nombre.trim(),
    innerHTML: '<i class="fa-solid fa-pen-to-square mx-0 mx-0"></i>',
    className: 'btn btn-success table-button'
  })
  buttonEdit.setAttribute('index', index)
  
  const buttonDelete = Object.assign(document.createElement('button'), {
    title: 'Eliminar índice',
    type: 'button',
    id,
    name: nombre.trim(),
    innerHTML: '<i class="fa-solid fa-minus mx-0"></i>',
    className: 'btn btn-danger table-button'
  })
  buttonDelete.setAttribute('option', deleteOption)
  buttonDelete.setAttribute('index', index)
  
  const row_data_3 = document.createElement('td')
  row_data_3.appendChild(buttonInsert)
  row_data_3.appendChild(buttonEdit)
  row_data_3.appendChild(buttonDelete)

  
  row.appendChild(row_data_1)
  row.appendChild(row_data_2)
  row.appendChild(row_data_3)
  document.getElementById('full-tbody').appendChild(row)
}

// Declare a global variable to store the fetched data
let fetchedData;

// Fetch the data and store it in the global variable
(async () => {
  const response = await fetch(process.env.NewSolu_externo + '/inventario/formularios/get_indices', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  });
  const data = await response.json();
  fetchedData = data;

  // Use the fetched data in your code
  console.log(fetchedData);
})();

// const get_indexes = tkn => {
//   fetch(process.env.NewSolu_externo + '/inventario/formularios/get_indices', {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${tkn}`
//     }
//   })
//   .then(indexes => indexes.json())
//   .then(({indices: indexes}) => {
//     // console.log(indexes)
//     // Eliminar elementos de la tabla
//     const tableHeaderRowCount = 1
//     const table = document.getElementById('full-table')
//     const rowCount = table.rows.length
//     for (let i = tableHeaderRowCount; i < rowCount; i++) {
//       table.deleteRow(tableHeaderRowCount)
//     }
    
//     for (const {id, nombre: name, indice: index} of indexes) {
//       printIndexesOnTable(id, name, index)
//     }
//     get_tableButtons()
//   })
//   .catch( error => console.log(error))
// }

const tkn = getParameter('tkn')
// if ( tkn ) {
//   get_indexes( tkn )
// }

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
      const id = event.currentTarget.getAttribute('id')
      const name = event.currentTarget.getAttribute('name')
      const index = event.currentTarget.getAttribute('index')
      console.log(id);
      console.log(name);
      console.log(index);
      // console.log(event.currentTarget.getAttribute('id'))
      // console.log(event.currentTarget.getAttribute('option'))
      if ( Number(event.currentTarget.getAttribute('option')) === insertOption) {
        // insertIntoApi(id, name, index)
        return
      }
      if ( Number(event.currentTarget.getAttribute('option')) === editOption) {
        console.log('edit button')
        return
      }
      if ( Number(event.currentTarget.getAttribute('option')) === deleteOption) {
        deleteIndex(id, name, index)
      }
    })
  }
}

const deleteIndex = (id, name, index) => {
  
}