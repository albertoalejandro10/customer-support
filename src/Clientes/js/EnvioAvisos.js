import { getParameter } from "../../jsgen/Helper"

const loader = document.getElementsByClassName('loadingx')
// Fetch para imprimir datos del servicio
const notices = tkn => {
  loader[0].classList.remove('d-none')
  const url_getNotices = process.env.Solu_externo + '/maestros/clientes/get_avisos'
  fetch( url_getNotices, {
      method: 'GET',
      headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then( notices => {
    if (notices.ok) {
      return notices.json()
    } else {
      throw new Error(notices.status)
    }
  })
  .then( ({avisos}) => {
    // console.log( avisos )
    if ( avisos.length === 0 ) {
      document.getElementById('no-notices').classList.remove('d-none')
    } else {
      document.getElementById('no-notices').classList.add('d-none')
    }

    // Eliminar tablas previas
    const table = document.getElementById('full-table')
    let rowCount = table.rows.length
    while (--rowCount) {
      table.deleteRow(rowCount)
    }

    for (const aviso of avisos) {
      printTable(aviso)
    }

    loader[0].classList.add('d-none')
  })
  .catch( err => {
    console.log('Error: ', err)
    loader[0].classList.add('d-none')
    document.getElementById('no-notices').classList.add('d-none')
  })
}

const printTable = ({id, nombre}) => {
  // Imprimir datos en la tabla
  const row = document.createElement('tr')

  const row_data_1 = document.createElement('td')
  row_data_1.textContent = nombre

  const row_data_2 = document.createElement('td')
  const row_data_2_anchor = document.createElement('a')
  row_data_2_anchor.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EditarAvisos.html?id=${id}&tkn=${tkn}`
  
  const buttonModified = document.createElement('button')
  buttonModified.type = 'button'
  buttonModified.classList.add('btn')
  buttonModified.classList.add('btn-primary')
  buttonModified.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editar`
  row_data_2_anchor.appendChild(buttonModified)

  const row_data_3_anchor = document.createElement('a')
  row_data_3_anchor.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAviso.html?id=${id}&tkn=${tkn}`
  
  const buttonSend = document.createElement('button')
  buttonSend.type = 'button'
  buttonSend.classList.add('btn')
  buttonSend.classList.add('btn-success')
  buttonSend.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Enviar`
  row_data_3_anchor.appendChild(buttonSend)
  
  row_data_2.appendChild(row_data_2_anchor)
  row_data_2.appendChild(row_data_3_anchor)
  row.appendChild(row_data_1)
  row.appendChild(row_data_2)
  
  tbody.appendChild(row)
}

const tkn = getParameter('tkn')
if ( tkn ) {
  notices( tkn )
}

document.getElementById('update').onclick = () => {
  notices( tkn )
}

document.getElementById('newNotice').onclick = () => {
  location.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EditarAvisos.html?tkn=${tkn}`
}