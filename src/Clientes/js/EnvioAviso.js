import { getParameter } from "../../jsgen/Helper"

const backToList = document.getElementById('backToList')
backToList.onclick = () => {
  location.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAvisos.html?tkn=${tkn}`
}

let customers = []
let maximumCustomers = 0
const get_customers = async (tkn, data) => {
  const url_getCustomers = process.env.Solu_externo + '/formularios/clientes/get_clientes'
  try {
    const response = await fetch( url_getCustomers , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      },
      body: JSON.stringify(data)
    })
    const {resultado: result, clientes, maximoClientes} = await response.json()
    customers = clientes
    maximumCustomers = maximoClientes
    if (result !== 'ok') return
    document.getElementById('send-mail').disabled = false
    topCheckbox.disabled = false
    document.querySelectorAll("#full-table input[type='checkbox']").forEach(checkbox => {
      checkbox.disabled = false
      checkbox.checked = false
    })

    const table = document.getElementById('full-table')
    while(table.rows.length > 1) {
      table.deleteRow(1)
    }
    customers.forEach(customer => printCustomersOnTable(customer))
    if (customers.length > maximumCustomers) {
      const checkboxes = document.querySelectorAll("#full-table input[type='checkbox']")
      checkboxes.forEach((checkbox, index) => {
        if (index !== 0) {
          checkbox.disabled = true
        }
      })
    }
    linea = []
    getAllCheckboxes()
    const titleCustomers = document.getElementById('title-customers')
    titleCustomers.classList.remove('d-none')
    titleCustomers.innerHTML = `Se encontraron ${customers.length} clientes/Seleccionados <span id='selected-count'>0</span>`
  } catch (err) {
    console.error(err)
  }
}

const printCustomersOnTable = ({id, nombre}) => {
  const row = document.createElement('tr')
  row.innerHTML = `<td>${nombre}</td><td><input type="checkbox" name='checkbox-${id}' id='${id}'></td>`
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
  document.getElementById('selected-count').textContent = linea.length
}

const uncheckAll = targets => {
  targets.forEach(target => {
    target.checked = false
    target.disabled = false
    linea = linea.filter(id => id !== Number(target.id))
  })
  document.getElementById('selected-count').textContent = linea.length
}

const getAllCheckboxes = () => {
  const checkboxes = Array.from(document.querySelectorAll("#full-table input[type='checkbox']"))
  const topCheckbox = checkboxes.shift()
  if ( customers.length < maximumCustomers ) {
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('click', event => {
        const isAllCheckboxesChecked = checkboxes.filter(checkbox => checkbox.checked === true)
        topCheckbox.disabled = true
        if (isAllCheckboxesChecked.length === 0) {topCheckbox.disabled = false}
        if(event.target.checked) {
          linea.push(Number(event.target.id))
        } else {
          linea = linea.filter(id => id !== Number(event.target.id))
        }
        document.getElementById('selected-count').textContent = linea.length
      })
    })
  } else {
    topCheckbox.addEventListener('click', event => {
      if (event.target.checked) {
        checkboxes.map( checkbox => {
          checkbox.checked = true
          checkbox.disabled = true
        })
      } else {
        checkboxes.map( checkbox => {
          checkbox.checked = false
          checkbox.disabled = true
        })
      }
    })
  }
}

// Boton actualizar
const tkn = getParameter('tkn')
const form = document.getElementById('form')
form.addEventListener('submit', event => {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)

  const tipoEnvioId = 1
  const tipoClienteId = Number(formData.get('customer-type'))
  const grupoClienteId = Number(formData.get('customer-group'))
  const condicionId = Number(formData.get('condition'))
  const valor = Number(formData.get('value-x'))

  const nroLiquidacion = Number(formData.get('liquidation-number'))
  const nroAsiento = Number(formData.get('seat-number'))
  const estadoEnvio = Number(formData.get('sent-status'))
  const adjunto = formData.get('attachment')
  const nroComprobante = Number(formData.get('receipt-number'))
  const cliente = formData.get('customer')

  const avisoDatos = {
    tipoEnvioId,
    tipoClienteId,
    grupoClienteId,
    condicionId,
    valor,
    nroLiquidacion,
    nroAsiento,
    estadoEnvio,
    adjunto,
    nroComprobante,
    cliente
  }
  // console.log( {avisoDatos} )
  get_customers( tkn, {avisoDatos} )
})

const get_data = id => {
  fetch( process.env.Solu_externo + '/maestros/clientes/get_avisoId' , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify({avisoId: id})
  })
  .then( notice => notice.json())
  .then( ({avisoDatos}) => {
    // console.log(avisoDatos)
    const {adjunto, aviso, condicionId, fechaInicio, grupoClienteId, mensaje, periodicidad, tipoClienteId, tipoEnvioId, titulo, valor} = avisoDatos
    document.getElementById('title-name').textContent = aviso
    document.getElementById('condition').value = condicionId
    document.getElementById('customer-group').value = grupoClienteId
    document.getElementById('attachment').value = adjunto
    document.getElementById('value-x').value = valor
    document.getElementById('customer-type').value = tipoClienteId
    document.getElementById('sent-status').value = tipoEnvioId
  })
}

const id = getParameter('id')
if ( id ) {
  get_data( id )
}

document.getElementById('send-mail').addEventListener('click', () => {
  fetch( process.env.Solu_externo + '/maestros/clientes/get_avisoId' , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify({avisoId: id})
  })
  .then( notice => notice.json())
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
    if ( !resultado === 'ok' ) return
    alert(`${resultado} - ${mensaje}`)
  })
}

const ids = ['liquidation-number', 'receipt-number', 'seat-number']
ids.forEach(id => {
  document.getElementById(id).onkeydown = event => {
    if (event.key === '-') {
      event.preventDefault()
    }
  }
})