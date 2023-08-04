import { getParameter } from "../../jsgen/Helper"

const loader = document.getElementById('loader')
let ejercicio_id = 0
const get_userInfo = tkn => {
  loader.classList.remove('d-none')
  fetch( process.env.Solu_externo + '/session/login_sid' , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then( user => user.json())
  .then( ({id_cliente: id_usuario, ejercicioNombre, ejercicioInicio, ejercicioCierre}) => {
    // console.log(ejercicioNombre, ejercicioInicio, ejercicioCierre)
    document.getElementById('exercise').innerHTML = `${ejercicioNombre} - <span>${ejercicioInicio} a ${ejercicioCierre}</span>`
    get_data({id_usuario: 31})
  })
}

const tkn = getParameter('tkn')
get_userInfo( tkn )

// Extraer la configuración de las opciones de fetch
const fetchOptions = (method, body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  }
  if (body) options.body = JSON.stringify(body)
  return options
}

const get_data = async id => {
  try {
    const responses = await Promise.all([
      fetch(process.env.Solu_externo + '/contabilidad/cierreperiodo/listar_periodos', fetchOptions('POST', id)),
      fetch(process.env.Solu_externo + '/contabilidad/cierreperiodo/listar_relaciones', fetchOptions('GET'))
    ])

    const data = await Promise.all(responses.map(response => {
      if (!response.ok) throw new Error(`API request failed with status ${response.status}`)
      return response.json()
    }))

    const [{ejercicio_id, periodos}, {relaciones: relations}] = data

    const objRelations = relations.reduce((obj, item) => {
      obj[item.id] = item
      return obj
    }, {})

    const result = periodos.map( item => {
      return {
        nombre: objRelations[item.tabla_rel_id].nombre,
        periodo: item.periodo,
        tabla_rel_id: objRelations[item.tabla_rel_id].id,
        cierre: item.cierre
      }
    })

    const table = document.getElementById('full-table')
    let rowCount = table.rows.length
    while (--rowCount) {
      table.deleteRow(rowCount)
    }

    reestructuring_object(ejercicio_id, result)
  } catch (error) {
    // Si hay un error, lo capturamos aquí
    console.error(error)
  }
}

const reestructuring_object = (exercise_id, results) => {
  ejercicio_id = exercise_id
  // console.log(ejercicio_id)
  let groupedByPeriod = {}
  groupedByPeriod = results.reduce((acc, curr) => {
    if (!acc[curr.periodo]) {
      acc[curr.periodo] = []
    }
    acc[curr.periodo].push({
      nombre: curr.nombre,
      tabla_rel_id: curr.tabla_rel_id,
      cierre: curr.cierre
    })
    return acc
  }, groupedByPeriod)

  const finalObject = Object.entries(groupedByPeriod).map(([periodo, opciones]) => ({
    periodo,
    opciones
  }))
  finalObject.forEach(item => {
    item.opciones.sort((a, b) => a.nombre.localeCompare(b.nombre))
  })
  // console.log(finalObject)
  print_tableInfo(finalObject)
}

const print_tableInfo = periods => {
  for (let [index, {periodo: period, opciones: options}] of periods.entries()) {

    let year = (String(period)).substring(0, 4)
    let month = (String(period)).substring(4) - 1
    const date = format_date(new Date(year, month))

    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.textContent = date
    row.appendChild(row_data_1)
    
    options.forEach(({ tabla_rel_id, cierre }) => {
      const rowData = document.createElement('td')
      rowData.innerHTML = `<input item=${period} tabla_rel_id=${tabla_rel_id} cierre=${cierre} type="checkbox" ${cierre == 1 ? "checked" : ""}></input>`
      row.appendChild(rowData)
    })

    const row_data_2 = document.createElement('td')
    row_data_2.innerHTML = `<input item=${period} type="checkbox" id=${index}></input>`
    row.appendChild(row_data_2)
    document.getElementById(`tbody-table`).appendChild(row)
    loader.classList.add('d-none')
  } 
  get_checkboxesWithIds()
}

const format_date = date => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  let month = months[date.getMonth()]
  let year = date.getFullYear()
  return `${month} ${year}`
}

// Boton Actualizar
const form = document.getElementById('form')
form.addEventListener('submit', event => {
  event.preventDefault()
  get_userInfo(tkn)
})

document.getElementById('record').addEventListener('click', event => {
  event.preventDefault()
  const periodos = get_periodsToApi()
  const data = {
    ejercicio_id,
    periodos
  }
  // console.log(data)
  post_dataToApi(data)
})

const get_periodsToApi = () => {
  const allCheckboxes = Array.from(document.querySelectorAll('input[type="checkbox"]:not([id])'))
  const periods = allCheckboxes.map(checkbox => {
    let cierre = 0
    if (checkbox.checked) {
      cierre = 1
    }
    return {
      item: Number(checkbox.getAttribute('item')),
      configuracion: [
        {
          tabla_rel_id: Number(checkbox.getAttribute('tabla_rel_id')),
          cierre
        }
      ]
    }
  })

  let map = new Map()
  for (let period of periods) {
    if (!map.has(period.item)) {
      map.set(period.item, { item: period.item, configuracion: []})
    }
    map.get(period.item).configuracion = map.get(period.item).configuracion.concat(period.configuracion)
  }
  let uniqueArr = Array.from(map.values())
  return uniqueArr
}

const post_dataToApi = data => {
  const url_record = process.env.Solu_externo + '/contabilidad/cierreperiodo/grabar'
  fetch( url_record , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify(data)
  })
  .then( record => record.json())
  .then(({resultado, mensaje}) => {
    alert(`Resultado: ${resultado} \nMensaje: ${mensaje}`)
    get_userInfo(tkn)
  })
  .catch( err => {
    console.log( err )
  })
}

const get_checkboxesWithIds = () => {
  const checkboxesWithId = Array.from(document.querySelectorAll('input[type="checkbox"][id]'))
  checkboxesWithId.forEach(checkbox => {
    checkbox.addEventListener('click', event => {
      const rowItem = event.currentTarget.getAttribute('item')
      const checkboxesSameItem = Array.from(document.querySelectorAll(`input[type="checkbox"][item="${rowItem}"]:not([id])`))
      checkboxesSameItem.forEach(checkboxItem => {
        checkboxItem.checked = event.currentTarget.checked
      })
    })
  })
}