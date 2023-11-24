import { getParameter } from "../../jsgen/Helper"

// Mostrar el modal automáticamente al cargar la página
window.onload = function() {
  var miModal = new bootstrap.Modal(document.getElementById('estadoEnvios'));
  miModal.show();
};

//variable que indica el top de envios completados que devolvera
const tope=5

// Listado envios
const get_customerTypes = tkn => {
  const url_getShippings = process.env.Solu_externo + '/maestros/clientes/get_tipos_cliente'
  fetch( url_getShippings, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then( customerTypes => customerTypes.json() )
  .then( ({tiposCliente}) => {
    for (const tipoCliente of tiposCliente) {
      const { id, nombre } = tipoCliente
      // console.log(id, nombre)
      const select = document.querySelector('#customer-type')
      let option = document.createElement("option")
      option.setAttribute("data-tokens", nombre)
      option.value = id
      option.textContent = nombre
      select.appendChild( option )
    }
  })
  .catch( err => {
    console.log( err )
  })
}

// Listado condiciones
const get_conditions = tkn => {
  const url_getConditions = process.env.Solu_externo + '/maestros/clientes/get_condiciones'
  fetch( url_getConditions, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then( conditions => conditions.json() )
  .then( ({condiciones}) => {
    const conditions = condiciones
    for (const condition of conditions) {
      const { id, nombre } = condition
      // console.log(id, nombre)
      const select = document.querySelector('#condition')
      let option = document.createElement("option")
      option.setAttribute("data-tokens", nombre)
      option.value = id
      option.textContent = nombre
      select.appendChild( option )
    }
  })
  .catch( err => {
    console.log( err )
  })
}

// Listado grupo de clientes
const get_customerGroup = tkn => {
  const url_getCustomerGroup = process.env.Solu_externo + '/maestros/clientes/get_grupos_cliente'
  fetch( url_getCustomerGroup, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      }
  })
  .then( customerGroups => customerGroups.json() )
  .then( ({gruposCliente}) => {
    const customerGroups = gruposCliente
    for (const customerGroup of customerGroups) {
      const { id, nombre } = customerGroup
      // console.log(id, nombre)
      const select = document.querySelector('#customer-group')
      let option = document.createElement("option")
      option.setAttribute("data-tokens", nombre)
      option.value = id
      option.textContent = nombre
      select.appendChild( option )
    }
  })
  .catch( err => {
    console.log( err )
  })
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {

  //Desarrollo ISMA
  getEstadoEnvio(tkn)
  
  
  //PARTE DEL ALBERTO
  get_customerTypes(tkn)
  get_conditions(tkn)
  get_customerGroup(tkn)
}



//DESARROLLO ISMA

//Obtiene estado de los envios
function getEstadoEnvio(tkn){

  //Mostramos spinner
  document.querySelector("#loader-estado-envio").classList.remove("d-none")

  //Consumo api
  let url = process.env.Solu_externo + '/formularios/clientes/get_estados_envios'
  fetch( url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      },
      body: `{ "completados": ${tope}}`
  })
  .then( response => response.json() )
  .then( data => {
    //console.log(data)
    insertTitle(data.mensaje)
    insertNota(data.nota)
    createTable(data.envios,data.pendientes)
    
    //Ocultamos spinner
    document.querySelector("#loader-estado-envio").classList.add("d-none")
    
  })
  .catch( err => {
    console.log( err )
  })


}

function insertTitle(text){
  document.querySelector("#title-estado-envio").textContent = text
}

function insertNota(text){
  document.querySelector("#nota-estado-envio").textContent = "Nota: " + text
}

function createTable(array, pendientes){
  //console.log(array)
  let tbody = document.querySelector("#tbody-estado-envio")
  tbody.innerHTML = ""
  
  array.forEach(element => {
    
    let row = document.createElement("tr")
    row.setAttribute("id", "veremos")
    row.setAttribute("class", "border border-b")

    let td1 = document.createElement("td")
    switch(element.estado){
      case'CANCELADO' : td1.setAttribute("class", "text-danger");break;
      case'COMPLETADO' : td1.setAttribute("class", "text-success");break;
      default : td1.setAttribute("class", "text-primary");break;

    }
    let str = element.estado.toLowerCase()
    td1.innerHTML = `${str.charAt(0).toUpperCase() + str.slice(1)}`

    let td2 = document.createElement("td")
    td2.innerHTML = `${element.asunto}`

    let td3 = document.createElement("td")
    td3.innerHTML = `${ formatearDate(element.fecha.replace("T", " ").slice(0,16))}`

    let td4 = document.createElement("td")
    td4.innerHTML = `${element.usuario}`

    let td6 = document.createElement("td")
    td6.innerHTML = `${element.correctos} / ${element.cantidad}`

    let td7 = document.createElement("td")
    td7.innerHTML = `${element.erroneos}`

    let td8 = document.createElement("td")
    td8.innerHTML = `${element.pendientes}`

    let td9 = document.createElement("td")
    td9.innerHTML = `${formatearDate(element.ultimaActualizacion.replace("T"," ").slice(0,16))}`

    let td10 = document.createElement("td")
    if(element.cancelar === true){
      td10.innerHTML = `<span class="cursor-pointer" id="correo-${element.id}" data-value="${element.id}"><i class="fa-solid fa-delete-left fa-lg" style="color: #ff2e2e;"></i></span>`
    }else{
      td10.innerHTML = `<i class="fa-solid fa-delete-left fa-lg" style="color: #f7abab;"></i>`
    }

    row.appendChild(td1)
    row.appendChild(td2)
    row.appendChild(td3)
    row.appendChild(td4)
    row.appendChild(td6)
    row.appendChild(td7)
    row.appendChild(td8)
    row.appendChild(td9)
    row.appendChild(td10)

    tbody.appendChild(row)

    //EVENTO para cancelar el envio
    let cancel = document.querySelector(`#correo-${element.id}`)
    if(cancel!=null){
      cancel.addEventListener("click", ()=>{
        cancelEnvio(cancel.getAttribute("data-value"))
      })
    }


  });


  //Evalua si hay procesos en ejecucion
  /* if(parseInt(pendientes)==0){
    document.querySelector("#continue-estado-envio").classList.remove("d-none")
    document.querySelector("#close-estado-envio").classList.remove("d-none")
  } */
}

//Cancela envio de correo
function cancelEnvio(id){

  //Muestro LOADER
  document.querySelector("#loader-estado-envio").classList.remove("d-none")

  //Consumo api
  let url = process.env.Solu_externo + '/formularios/clientes/cancelar_envio'
  fetch( url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      },
      body: `{ "id": ${parseInt(id)}}`
  })
  .then( response => response.json() )
  .then( data => {
    //console.log(data)
    
    alert(data.resultado + "\n" + data.mensaje)
    

    //Oculta LOADER
    document.querySelector("#loader-estado-envio").classList.add("d-none")
    
    //Invoca nuevamente a la API
    getEstadoEnvio(tkn)

    /* insertTitle(data.mensaje)
    insertNota(data.nota)
    createTable(data.envios,data.pendientes) */
 
     
     
   })
   
 
   .catch( err => {
     console.log( err )
   })
}

function formatearDate(fechaOriginal){
  // Dividir la fecha y hora original en partes
  let partes = fechaOriginal.split(' ');

  // Obtener la fecha en formato "YYYY-MM-DD"
  let fecha = partes[0];

  // Dividir la fecha en partes "YYYY", "MM" y "DD"
  let [anio, mes, dia] = fecha.split('-');

  // Obtener la hora en formato "HH:MM"
  let hora = partes[1];

  // Formatear la fecha en "DD/MM/YYYY HH:MM"
  let fechaFormateada = `${dia}/${mes}/${anio} ${hora}hs`;

  return fechaFormateada;
}



//EVENTOS
let view = document.querySelector("#view-envios")
view.addEventListener("click", function(){
  const tkn = getParameter('tkn')
  if ( tkn ) {
    getEstadoEnvio(tkn)

  }
}); 
  