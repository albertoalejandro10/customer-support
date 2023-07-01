import { capitalize } from "lodash"

const getParameter = parameterName => {
  const parameters = new URLSearchParams( window.location.search )
  return parameters.get( parameterName )
}

const get_activeCompanies = tkn => {
  const url_getActiveCompanies = process.env.Solu_externo + '/utilidades/empresas/activas'
  fetch( url_getActiveCompanies, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then( companies => companies.json())
  .then( ({empresasActivas: companies}) => {
    get_usersGroup(companies[0].cdbase)
    for (const {cdbase: nameCompany} of companies) {
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
  fetch(process.env.Solu_externo + `/utilidades/grupousuarios`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then(usersGroup => usersGroup.json())
  .then(({grupoUsuarios: usersGroup}) => {
    const select = document.querySelector('#usersGroup')
    while ( select.options.length > 0 ) {
      select.removeChild(select.options[0])
    }
    if ( !usersGroup ) {
      alert('Esta empresa no tiene grupo de usuarios, no podras ingresar un nuevo usuario.')
      return
    }
    for (const userGroup of usersGroup) {
      const {id, nombre} = userGroup
      let option = document.createElement("option")
      option.setAttribute("data-tokens", nombre)
      option.value = id
      option.textContent = capitalize(nombre)
      select.appendChild( option )
    }
  })
  .catch(error => console.error(error))
}

// Method post - grabar nuevoUsuario
const form = document.querySelector('#form')
form.addEventListener('submit', event => {
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
  fetch( process.env.Solu_externo + '/utilidades/usuario/agregar' , {
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