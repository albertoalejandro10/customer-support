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
    //console.log( avisos )
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
      //console.log(aviso)
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

const printTable = (aviso) => {
  // Imprimir datos en la tabla
  const row = document.createElement('tr')

  const row_data_1 = document.createElement('td')
  row_data_1.textContent = aviso.nombre

  //Creacion columna tipo de envio
  const row_data_te = document.createElement('td')
  //Valida el tipo de envio
  if(aviso.tipoEnvioId == 1)
    row_data_te.innerHTML = `<i class="text-secondary fa fa-envelope fa-md" aria-hidden="true"></i> ${aviso.tipoEnvio}`
  else
    row_data_te.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="10,0,256,256" width="14px" height="14px" class="mr-1"><g fill="#25d366" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M19.077,4.928c-2.082,-2.083 -4.922,-3.134 -7.904,-2.894c-4.009,0.322 -7.523,3.11 -8.699,6.956c-0.84,2.748 -0.487,5.617 0.881,7.987l-1.296,4.303c-0.124,0.413 0.253,0.802 0.67,0.691l4.504,-1.207c1.459,0.796 3.101,1.215 4.773,1.216h0.004c4.195,0 8.071,-2.566 9.412,-6.541c1.306,-3.876 0.34,-7.823 -2.345,-10.511zM16.898,15.554c-0.208,0.583 -1.227,1.145 -1.685,1.186c-0.458,0.042 -0.887,0.207 -2.995,-0.624c-2.537,-1 -4.139,-3.601 -4.263,-3.767c-0.125,-0.167 -1.019,-1.353 -1.019,-2.581c0,-1.228 0.645,-1.832 0.874,-2.081c0.229,-0.25 0.499,-0.312 0.666,-0.312c0.166,0 0.333,0 0.478,0.006c0.178,0.007 0.375,0.016 0.562,0.431c0.222,0.494 0.707,1.728 0.769,1.853c0.062,0.125 0.104,0.271 0.021,0.437c-0.083,0.166 -0.125,0.27 -0.249,0.416c-0.125,0.146 -0.262,0.325 -0.374,0.437c-0.125,0.124 -0.255,0.26 -0.11,0.509c0.146,0.25 0.646,1.067 1.388,1.728c0.954,0.85 1.757,1.113 2.007,1.239c0.25,0.125 0.395,0.104 0.541,-0.063c0.146,-0.166 0.624,-0.728 0.79,-0.978c0.166,-0.25 0.333,-0.208 0.562,-0.125c0.229,0.083 1.456,0.687 1.705,0.812c0.25,0.125 0.416,0.187 0.478,0.291c0.062,0.103 0.062,0.603 -0.146,1.186z"></path></g></g></svg>  ${aviso.tipoEnvio}`
    //row_data_te.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg"  viewBox="4 0 48 48" width="17px" height="17px" clip-rule="evenodd"><path fill="#fff" d="M4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98c-0.001,0,0,0,0,0h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303z"/><path fill="#fff" d="M4.868,43.803c-0.132,0-0.26-0.052-0.355-0.148c-0.125-0.127-0.174-0.312-0.127-0.483l2.639-9.636c-1.636-2.906-2.499-6.206-2.497-9.556C4.532,13.238,13.273,4.5,24.014,4.5c5.21,0.002,10.105,2.031,13.784,5.713c3.679,3.683,5.704,8.577,5.702,13.781c-0.004,10.741-8.746,19.48-19.486,19.48c-3.189-0.001-6.344-0.788-9.144-2.277l-9.875,2.589C4.953,43.798,4.911,43.803,4.868,43.803z"/><path fill="#cfd8dc" d="M24.014,5c5.079,0.002,9.845,1.979,13.43,5.566c3.584,3.588,5.558,8.356,5.556,13.428c-0.004,10.465-8.522,18.98-18.986,18.98h-0.008c-3.177-0.001-6.3-0.798-9.073-2.311L4.868,43.303l2.694-9.835C5.9,30.59,5.026,27.324,5.027,23.979C5.032,13.514,13.548,5,24.014,5 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974C24.014,42.974,24.014,42.974,24.014,42.974 M24.014,4C24.014,4,24.014,4,24.014,4C12.998,4,4.032,12.962,4.027,23.979c-0.001,3.367,0.849,6.685,2.461,9.622l-2.585,9.439c-0.094,0.345,0.002,0.713,0.254,0.967c0.19,0.192,0.447,0.297,0.711,0.297c0.085,0,0.17-0.011,0.254-0.033l9.687-2.54c2.828,1.468,5.998,2.243,9.197,2.244c11.024,0,19.99-8.963,19.995-19.98c0.002-5.339-2.075-10.359-5.848-14.135C34.378,6.083,29.357,4.002,24.014,4L24.014,4z"/><path fill="#40c351" d="M35.176,12.832c-2.98-2.982-6.941-4.625-11.157-4.626c-8.704,0-15.783,7.076-15.787,15.774c-0.001,2.981,0.833,5.883,2.413,8.396l0.376,0.597l-1.595,5.821l5.973-1.566l0.577,0.342c2.422,1.438,5.2,2.198,8.032,2.199h0.006c8.698,0,15.777-7.077,15.78-15.776C39.795,19.778,38.156,15.814,35.176,12.832z"/><path fill="#fff" fill-rule="evenodd" d="M19.268,16.045c-0.355-0.79-0.729-0.806-1.068-0.82c-0.277-0.012-0.593-0.011-0.909-0.011c-0.316,0-0.83,0.119-1.265,0.594c-0.435,0.475-1.661,1.622-1.661,3.956c0,2.334,1.7,4.59,1.937,4.906c0.237,0.316,3.282,5.259,8.104,7.161c4.007,1.58,4.823,1.266,5.693,1.187c0.87-0.079,2.807-1.147,3.202-2.255c0.395-1.108,0.395-2.057,0.277-2.255c-0.119-0.198-0.435-0.316-0.909-0.554s-2.807-1.385-3.242-1.543c-0.435-0.158-0.751-0.237-1.068,0.238c-0.316,0.474-1.225,1.543-1.502,1.859c-0.277,0.317-0.554,0.357-1.028,0.119c-0.474-0.238-2.002-0.738-3.815-2.354c-1.41-1.257-2.362-2.81-2.639-3.285c-0.277-0.474-0.03-0.731,0.208-0.968c0.213-0.213,0.474-0.554,0.712-0.831c0.237-0.277,0.316-0.475,0.474-0.791c0.158-0.317,0.079-0.594-0.04-0.831C20.612,19.329,19.69,16.983,19.268,16.045z" clip-rule="evenodd"/></svg> ${aviso.tipoEnvio}`


  const row_data_2 = document.createElement('td')
  const row_data_2_anchor = document.createElement('a')
  row_data_2_anchor.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EditarAvisos.html?id=${aviso.id}&tipoEnvioId=${aviso.tipoEnvioId}&tkn=${tkn}`
  
  const buttonModified = document.createElement('button')
  buttonModified.type = 'button'
  buttonModified.classList.add('btn')

  //Valida los flags para habilitar y deshabilitar el boton de edicion
  /*if(aviso.editar != true){
    buttonModified.classList.add('btn-secondary')
    //buttonModified.setAttribute('disabled', 'true')
    buttonModified.classList.add('cursor-default')
  }else{*/
  buttonModified.classList.add('btn-primary')
  //}

  buttonModified.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Editar`
  row_data_2_anchor.appendChild(buttonModified)

  const row_data_3_anchor = document.createElement('a')
  row_data_3_anchor.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAviso.html?id=${aviso.id}&tipoEnvioId=${aviso.tipoEnvioId}&tkn=${tkn}`
  
  const buttonSend = document.createElement('button')
  buttonSend.type = 'button'
  buttonSend.classList.add('btn')

  //Valida los flags para habilitar y deshabilitar el boton de envío
  if(aviso.habilitado != true){
    buttonSend.classList.add('btn-secondary')
    buttonSend.setAttribute('disabled', 'true')
    buttonSend.classList.add('cursor-default')
  }else{
    buttonSend.classList.add('btn-success')
  }

  buttonSend.innerHTML = `<i class="fa-solid fa-cloud-arrow-up"></i> Enviar`
  row_data_3_anchor.appendChild(buttonSend)
  
  row_data_2.appendChild(row_data_2_anchor)
  row_data_2.appendChild(row_data_3_anchor)
  row.appendChild(row_data_te)
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