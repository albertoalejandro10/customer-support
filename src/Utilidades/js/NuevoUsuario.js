import { capitalize } from "lodash";
import { getParameter } from "../../jsgen/Helper";

const get_activeCompanies = tkn => {
  const url_getActiveCompanies = 'https://apisdesa.solucioneserp.net/Soluciones/utilidades/empresas/activas'
  fetch( url_getActiveCompanies, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then( companies => companies.json())
  .then( ({empresasActivas: companies}) => {
    // console.log(companies[0].cdbase)
    get_usersGroup(companies[0].cdbase)
    for (const {cdbase: nameCompany} of companies) {
      // console.log(nameCompany)
      const select = document.querySelector('#activeCompanies')
      let option = document.createElement("option")
      option.setAttribute("data-tokens", nameCompany)
      option.textContent = capitalize(nameCompany)
      select.appendChild( option )
    }
  })
  .catch( err => {
    console.log( err )
  })
}

const tkn = getParameter('tkn')
if ( tkn ) {
  get_activeCompanies( tkn )
}

document.getElementById('activeCompanies').addEventListener('change', event => {
  const selectedValue = event.target.value
  get_usersGroup(selectedValue)
})

const get_usersGroup = target => {
  const data = {
    'cdbase': target
  }
  fetch(`https://apisdesa.solucioneserp.net/Soluciones/utilidades/grupousuarios`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then(usersGroup => usersGroup.json())
  .then(({grupoUsuarios: usersGroup}) => {
    for (const userGroup of usersGroup) {
      const {id, nombre} = userGroup
      const select = document.querySelector('#usersGroup')
      let option = document.createElement("option")
      option.setAttribute("data-tokens", nombre)
      option.value = id
      option.textContent = capitalize(nombre)
      select.appendChild( option )
    }
  })
  .catch(error => console.error(error))
}

// Method post - grabar servicioid
const $form = document.querySelector('#form')
$form.addEventListener('submit', event => {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  const usuario_name = formData.get('userName').toLocaleLowerCase()
  const cdbase = formData.get('activeCompanies').toLocaleLowerCase()
  const gid = Number(formData.get('usersGroup'))

  const data = {
    usuario_name,
    gid,
    cdbase
  }
  // console.table( data )
  fetch( process.env.NewSolu_externo + '/utilidades/usuario/agregar' , {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then( resp => resp.json() )
  .then( ({usuario_id, resultado, mensaje}) => {
    // console.log(usuario_id, resultado, mensaje)
    if ( usuario_id === -1 ) {
      alert(`Resultado: ${resultado} \nMensaje: ${mensaje}`)
      return
    }
    alert(`Resultado: ${resultado} \nMensaje: ${mensaje}`)
    location.reload()
  })
  .catch( error => console.log(error))
})