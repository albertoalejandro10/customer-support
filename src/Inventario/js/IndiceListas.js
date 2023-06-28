const getParameter = parameterName => {
  const parameters = new URLSearchParams( window.location.search )
  return parameters.get( parameterName )
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
  buttonDelete.setAttribute('index', index)
  return buttonDelete
}

// Imprimir indices en la tabla
const printIndexesOnTable = (id, nombre, index) => {
  const row = document.createElement('tr')
  row.id = id
  const row_data_1 = document.createElement('td')
  row_data_1.textContent = nombre
  row_data_1.setAttribute('contenteditable', 'true')
  const row_data_2 = document.createElement('td')
  row_data_2.innerHTML = index
  row_data_2.setAttribute('contenteditable', 'true')

  const buttonDelete = createDeleteButton(id, nombre, index)
  
  const row_data_3 = document.createElement('td')
  row_data_3.appendChild(buttonDelete)
  
  row.appendChild(row_data_1)
  row.appendChild(row_data_2)
  row.appendChild(row_data_3)
  document.getElementById('full-tbody').appendChild(row)
}

async function fetchData() {
  const response = await fetch(process.env.Solu_externo + '/inventario/formularios/get_indices', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  const data = await response.json()
  return data
}

const table = document.getElementById('full-table')
const firstCallToApi = () => {
  document.getElementById('loader').classList.remove('d-none')
  fetchData().then((fetchedData) => {
    const {indices: indexes} = fetchedData
    const tableHeaderRowCount = 1
    while (table.rows.length > tableHeaderRowCount) {
      table.deleteRow(tableHeaderRowCount)
    }
    
    for (const {id, nombre: name, indice: index} of indexes) {
      printIndexesOnTable(id, name, index)
    }
    get_deleteButton()
    editIndex()
    document.getElementById('loader').classList.add('d-none')
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

const get_deleteButton = () => {
  const buttons = document.querySelectorAll('#full-table button')
  for (const button of buttons) {
    button.addEventListener("click", event => {
      event.preventDefault()
      const name = event.currentTarget.getAttribute('name')
      const index = event.currentTarget.getAttribute('index')
      if ( confirm(`Seguro deseas eliminar el índice: ${name} - ${index} ?`) ) {
        let id = event.currentTarget.getAttribute('id')
        id = id.split('-')
        id = Number(id[id.length - 1])
        deleteIndex(id)
      } else {
        return
      }
    })
  }
}

// Añadir indice
document.getElementById('addIndex').addEventListener('click', () => {
  const newRow = table.insertRow(-1)
  const firstCell = newRow.insertCell(0)
  const secondCell = newRow.insertCell(1)
  const thirdCell = newRow.insertCell(2)

  // Crea los elementos input y el botón
  const name = document.createElement('input')
  name.type = 'text'
  name.id = 'getName'
  name.classList.add('form-control')
  const index = document.createElement('input')
  index.type = 'text'
  index.pattern = '[0-9.,]+'
  index.id = 'getIndex'
  index.classList.add('form-control')
  const saveIndexButton = document.createElement('button')
  saveIndexButton.id = 'saveIndexButton'
  saveIndexButton.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>Guardar'
  saveIndexButton.classList.add('btn')
  saveIndexButton.classList.add('btn-success')

  // Agrega los elementos a las celdas
  firstCell.appendChild(name)
  secondCell.appendChild(index)
  thirdCell.appendChild(saveIndexButton)
  document.getElementById('getIndex').addEventListener('keypress', event => {
    formatIndex(event)
  })
  saveIndex()
})

// Permitir numeros, comas y puntos.
const formatIndex = event => {
  const key = event.key
  if (!key.match(/^[0-9.,]+$/)) {
    event.preventDefault()
  }
}

const isValidName = name => {
  // Comprueba si el valor es nulo, tiene una longitud de 0 o solo contiene espacios en blanco
  if (name == null || name.length === 0 || /^\s+$/.test(name)) {
    alert('[ERROR] Porfavor, el campo nombre no puede estar vacío.')
    return false
  }
  return true
}

const isValidIndex = index => {
  // Comprueba que el indice no este vacio y solo contenga numeros, punto o coma.
  if (!index || !index.match(/^(\d+(?:[.,]\d{1,})?)$/)) {
    alert('[ERROR] Por favor, el campo índice no puede estar vacío y solo puede contener números, un punto o una coma.')
    return false
  }
  return true
}

// Validación y llamada a postApi.
const saveIndex = () => {
  document.getElementById('saveIndexButton').addEventListener('click', () => {
    const name = document.getElementById('getName').value
    let isValid = isValidName(name)
    if ( isValid === false ) { return }
    const index = document.getElementById('getIndex').value
    isValid = isValidIndex(index)
    if ( isValid === false ) { return }

    const data = {
      id: 0,
      nombre: name,
      indice: parseFloat(index.replace(',', '.'))
    }
    fetchData().then((fetchedData) => {
      const { indices: indexes } = fetchedData
      indexes.push(data)
      const newJson = {
        indices: indexes
      }
      // console.log(newJson)
      postApi(newJson, tkn)
    })
  })
}

const editIndex = () => {
  // Obtén todas las row de la tabla
  const rows = document.getElementsByTagName('tr')
  let originalValue = ''
  let editingCell = null

  function enableEditing(event) {
    const row = event.target.parentElement
    const cells = row.getElementsByTagName('td')

    for ( const [index, cell] of Array.from(cells).entries()) {
      // Verifica si la celda no es la ultima en la fila
      if ( index !== cells.length - 1 ) {
        cell.contentEditable = 'true'
      }
    }
  }

  function saveOriginalValue(event) {
    originalValue = event.target.textContent
    editingCell = event.target
  }

  function restoreOriginalValue() {
    if (editingCell) {
      editingCell.textContent = originalValue
      editingCell.contentEditable = 'false'
      editingCell = null
    }
  }

  function handleClickOutside(event) {
    if (!event.target.closest('table')) {
      restoreOriginalValue()
    }
  }

  // Función para manejar el evento de presionar la tecla Enter
  function sendData(event) {
    const cell = event.target
    
    // Verificar si se presionó la tecla Enter
    if (event.key === 'Enter') {
      // Cancelar el comportamiento predeterminado (agregar una nueva línea)
      event.preventDefault()
      
      // Enviar los datos modificados a la API
      const row = cell.parentElement
      const modifiedData = Array.from(row.getElementsByTagName('td')).map(td => td.textContent)
      const [nombre, indice] = modifiedData
      let isValid = isValidName(nombre)
      if ( isValid === false ) { return }
      isValid = isValidIndex(indice)
      if ( isValid === false ) { return }


      fetchData().then((fetchedData) => {
        const { indices: indexes } = fetchedData
        const index = indexes.findIndex(obj => {
          return obj.id === Number(row.id)
        })
    
        if (index !== -1) {
          indexes[index].nombre = nombre
          indexes[index].indice = parseFloat(indice.replace(',', '.'))
        }
        const newJson = {
          indices: indexes
        }
        // console.log(newJson)
        postApi(newJson, tkn)
      })
      
      cell.contentEditable = 'false'
      editingCell = null
    }
  }

  for (let row of rows) {
    row.addEventListener('dblclick', enableEditing)
    
    const cells = row.getElementsByTagName('td')
    for (const [index, cell] of Array.from(cells).entries()) {
      // Verifica si la celda no es la ultima en la fila
      if ( index !== cells.length -1 ) {
        cell.addEventListener('keydown', sendData)
        cell.addEventListener('focus', saveOriginalValue)
      }
      // Agregar el controlador de eventos de formatIndex a la segunda celda de cada fila
      if ( index === 1 ) {
        cell.addEventListener('keypress', event => {
          formatIndex(event)
        })
      }
    }
  }
  document.addEventListener('mousedown', handleClickOutside)
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
    const response = await fetch(process.env.Solu_externo + '/inventario/formularios/guardar', {
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