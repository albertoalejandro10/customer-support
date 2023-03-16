import { getParameter } from "../../jsgen/Helper"
// import { get_startMonth } from "../../jsgen/Apis-Helper"

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
    for (const shipping of shippings) {
      const { id, nombre } = shipping
      // console.log(id, nombre)
      const select = document.querySelector('#shipping-type')
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
  get_shippings(tkn)
  get_conditions(tkn)
  get_customerGroup(tkn)
}