import { getParameter } from "../../jsgen/Helper"

const editOption = 1
const deleteOption = 2
const createEditButton = (id, nombre, index) => {
  const buttonEdit = Object.assign(document.createElement('button'), {
    title: 'Editar índice',
    type: 'button',
    id: `edit-${id}`,
    name: nombre.trim(),
    innerHTML: '<i class="fa-solid fa-pen-to-square mx-0"></i>',
    className: 'btn btn-warning table-button'
  })
  buttonEdit.setAttribute('option', editOption)
  buttonEdit.setAttribute('index', index)
  return buttonEdit
}

const createDeleteButton = (id, nombre, index) => {
  const buttonDelete = Object.assign(document.createElement('button'), {
    title: 'Eliminar índice',
    type: 'button',
    id: `delete-${id}`,
    name: nombre.trim(),
    innerHTML: '<i class="fa-solid fa-minus mx-0"></i>',
    className: 'btn btn-danger table-button'
  })
  buttonDelete.setAttribute('option', deleteOption)
  buttonDelete.setAttribute('index', index)
  return buttonDelete
}

const printIndexesOnTable = (id, nombre, index) => {
  const row = document.createElement('tr')
  const row_data_1 = document.createElement('td')
  row_data_1.textContent = nombre
  const row_data_2 = document.createElement('td')
  row_data_2.innerHTML = index

  const buttonEdit = createEditButton(id, nombre, index)
  const buttonDelete = createDeleteButton(id, nombre, index)
  
  const row_data_3 = document.createElement('td')
  row_data_3.appendChild(buttonEdit)
  row_data_3.appendChild(buttonDelete)
  
  row.appendChild(row_data_1)
  row.appendChild(row_data_2)
  row.appendChild(row_data_3)
  document.getElementById('full-tbody').appendChild(row)
}

async function fetchData() {
  const response = await fetch(process.env.NewSolu_externo + '/inventario/formularios/get_indices', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  const data = await response.json()
  return data
}

const firstCallToApi = () => {
  fetchData().then((fetchedData) => {
    const {indices: indexes} = fetchedData
    const tableHeaderRowCount = 1
    const table = document.getElementById('full-table')
    while (table.rows.length > tableHeaderRowCount) {
      table.deleteRow(tableHeaderRowCount)
    }
    
    for (const {id, nombre: name, indice: index} of indexes) {
      printIndexesOnTable(id, name, index)
    }
    get_tableButtons()
  })
}

const tkn = getParameter('tkn')
if ( tkn ) {
  firstCallToApi()
}

// Boton actualizar
document.getElementById('update').addEventListener('click', event => {
  event.preventDefault()
  fetchData().then(() => {
    firstCallToApi()
  })
})

const get_tableButtons = () => {
  const buttons = document.querySelectorAll('#full-table button')
  for (const button of buttons) {
    button.addEventListener("click", event => {
      event.preventDefault()
      if ( confirm('¿Estás seguro de que quieres hacer esto?') ) {
        let id = event.currentTarget.getAttribute('id')
        id = id.split('-')
        id = Number(id[id.length - 1])
        if ( Number(event.currentTarget.getAttribute('option')) === editOption) {
          editIndex(id)
        }
        if ( Number(event.currentTarget.getAttribute('option')) === deleteOption) {
          deleteIndex(id)
        }
      } else {
        return
      }
    })
  }
}

const form = document.getElementById('form')
form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const name = formData.get('name')
    const index = Number(formData.get('index'))
    const data = {
      id: 0,
      nombre: name,
      indice: index
    }
    fetchData().then((fetchedData) => {
      const {indices: indexes} = fetchedData
      indexes.push(data)
      const newJson = {
        indices: indexes
      }
      postApi(newJson, tkn)
    })
})

const editIndex = id => {
  const button = document.getElementById(`edit-${id}`)
  const row = button.parentNode.parentNode
  const newRow = row.cloneNode(true)
  newRow.classList.add('bg-light')
  // Modifica la fila clonada
  newRow.cells[0].innerHTML = '<input type="text" class="form-control" value="' + row.cells[0].innerHTML + '">'
  newRow.cells[1].innerHTML = '<input type="number" class="form-control" value="' + row.cells[1].innerHTML + '">'

  // Inserta la fila clonada debajo de la fila original
  row.parentNode.insertBefore(newRow, row.nextSibling)

  // Agrega un botón de guardar cambios
  newRow.cells[2].innerHTML = '<button class="btn btn-success" id="saveEditChanges"><i class="fa-solid fa-floppy-disk"></i>Guardar</button>'

  document.getElementById('saveEditChanges').addEventListener('click', event => {
    saveEditChanges(id, event.target)
  })
}

const saveEditChanges = (id, button) => {
  const row = button.parentNode.parentNode // Obtiene la fila en la que se encuentra el botón
  fetchData().then((fetchedData) => {
    const { indices: indexes } = fetchedData
    const index = indexes.findIndex(obj => {
      return obj.id === id
    })

    if (index !== -1) {
      indexes[index].nombre = row.cells[0].querySelector('input').value
      indexes[index].indice = Number(row.cells[1].querySelector('input').value)
    }
    const newJson = {
      indices: indexes
    }
    postApi(newJson, tkn)
  })
  // Elimina la fila clonada
  row.parentNode.removeChild(row)
}

const deleteIndex = id => {
  fetchData().then((fetchedData) => {
    const { indices: indexes } = fetchedData
    const newArray = indexes.filter(element => element.id !== id)
    const newJson = {
      indices: newArray
    }
    postApi(newJson, tkn)
  })
}

const postApi = async(data, tkn) => {
  try {
    const response = await fetch(process.env.NewSolu_externo + '/inventario/formularios/guardar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      },
      body: JSON.stringify(data)
    })

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const jsonResponse = await response.json()
    const { resultado, mensaje } = jsonResponse
    alert(`Resultado: ${resultado} \nMensaje: ${mensaje}`)
    location.reload()
  } catch (error) {
    console.error(error)
  }
}