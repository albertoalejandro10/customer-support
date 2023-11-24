import { getParameter } from "../../jsgen/Helper"

// Obtén la cadena de consulta de la URL actual
//const queryString = window.location.search;
// Crea un objeto URLSearchParams con la cadena de consulta
//const parametrosGet = new URLSearchParams(queryString);


// Listado envios
const get_shippings = tkn => {
  const url_getShippings = process.env.Solu_externo + '/maestros/clientes/get_tipos_Envio'
  fetch( url_getShippings, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      }
  })
  .then( shippings => shippings.json() )
  .then( ({tiposEnvio}) => {
    const shippings = tiposEnvio
    //console.log(shippings)
    const select = document.querySelector('#shipping-type')

    //Verifica si es nueva plantilla o si es para editar
    //if(parametrosGet.has('tipoEnvioId')){
      /* let tipoEnvioId = parametrosGet.get('tipoEnvioId')
      let option = document.createElement("option")
      option.setAttribute("data-tokens", 'E-mail')
      option.value = tipoEnvioId
      option.textContent = shippings[parseInt(tipoEnvioId)-1].nombre
      select.appendChild( option )
      select.setAttribute('disabled','true') */
    //}else{ 
      //Todas las opciones de Envio    
      for (const shipping of shippings) {
        const { id, nombre } = shipping
        // console.log(id, nombre)
        let option = document.createElement("option")
        option.setAttribute("data-tokens", nombre)
        option.value = id
        option.textContent = nombre
        select.appendChild( option )
      }
      
    //}
    //******************************************** */
    //Agregado forsozamente el tipo de Envío WSP
    //Luego habria que borrarlo
    /* const select = document.querySelector('#shipping-type')
    let option = document.createElement("option")
    option.setAttribute("data-tokens", 'WhatsApp')
    option.value = 2
    option.textContent = "WhatsApp"
    select.appendChild( option ) */
    //****************************************************** */


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

// Listado grupo de clientes
const get_customerTypes = tkn => {
  const url_getCustomerTypes = process.env.Solu_externo + '/maestros/clientes/get_tipos_cliente'
  fetch( url_getCustomerTypes, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      }
  })
  .then( customerTypes => customerTypes.json() )
  .then( ({tiposCliente}) => {
    const customerTypes = tiposCliente
    for (const customerType of customerTypes) {
      const { id, nombre } = customerType
      // console.log(id, nombre)
      const select = document.querySelector('#customer-types')
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
  get_shippings(tkn)
  get_conditions(tkn)
  get_customerGroup(tkn)
  get_customerTypes(tkn)
}



//EVENTOS - Desarrollo Isma
const tipo_envio = document.querySelector("#shipping-type")
tipo_envio.addEventListener("change", ()=>{
  if(tipo_envio.value == 1){
    //Email
    document.querySelector("#area-email").classList.remove("d-none")
    document.querySelector("#area-wsp").classList.add("d-none")
  }else{
    //WhatsApp
    document.querySelector("#area-wsp").classList.remove("d-none")
    document.querySelector("#area-email").classList.add("d-none")
  }

})