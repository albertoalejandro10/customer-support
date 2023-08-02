import { getParameter } from "../../jsgen/Helper"

const get_exerciseState = async tkn => {
  try {
    let response = await fetch(process.env.Solu_externo + '/contabilidad/asiento/estado', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      },
    })
    let state = await response.json()
    return state.cerrado
  } catch (error) {
    console.error(error.message)
  }
}

// Listado plan de cuentas
const get_accountPlan = async tkn => {
  try {
    let response = await fetch(process.env.Solu_externo + '/listados/get_plan_cuenta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      },
      body: JSON.stringify({
        "tipo": 1,
        "alfa": 1
      })
    })
    let accountPlan = await response.json()
    return accountPlan
  } catch (error) {
    console.error(error.message)
  }
}

const tkn = getParameter('tkn')
if ( tkn ) {
  Promise.all([get_exerciseState(tkn), get_accountPlan(tkn)])
    .then(([cerrado, accountsPlan]) => {
      if (cerrado) {
        document.getElementById('cancel-closure').classList.remove('d-none')
        document.getElementById('generate-closure').classList.add('d-none')
      }
      for (const {codigo, nombre} of accountsPlan) {
        if (codigo === '') continue
        const select = document.querySelector('#result-account')
        let option = document.createElement("option")
        option.setAttribute("data-tokens", codigo)
        option.value = codigo
        option.textContent = nombre
        select.appendChild(option)
      }
      get_searchText()
    })
    .catch(err => {
      console.log(err)
    })
}

const post_generateClosure = data => {
  const url_postGenerateClouse = process.env.Solu_externo + '/contabilidad/asiento/generar_anular_cierre'
  fetch( url_postGenerateClouse , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify(data)
  })
  .then( resp => resp.json())
  .then( ({nro, descripcion}) => {
    alert(`Número: ${nro} \nDescripción: ${descripcion}`)
    generateButton.classList.toggle('d-none', nro !== 1)
    cancelButton.classList.toggle('d-none', nro === 1)
  })
  .catch( err => {
      console.log( err )
  })
}

const form = document.getElementById('form')
const handleButtonClick = (event, generarcierre) => {
  if (!form.reportValidity()) {
    return
  }
  event.preventDefault()
  const formData = new FormData(form)
  const cuenta = formData.get('result-account')
  const data = {
    cuenta,
    generarcierre
  }
  // console.log(data)
  post_generateClosure(data)
}

const generateButton = document.getElementById('generate-closure')
const cancelButton = document.getElementById('cancel-closure')
generateButton.addEventListener('click', event => {
  handleButtonClick(event, true)
})

cancelButton.addEventListener('click', event => {
  handleButtonClick(event, false)
})

const get_searchText = () => {
  // Obtén los elementos del DOM
  const searchInput = document.getElementById('search-user')
  const select = document.getElementById('result-account')
  // Guarda las opciones originales del select
  const originalOptions = Array.from(select.options)
  // Agrega el event listener al input de búsqueda
  searchInput.addEventListener('input', event => {
    const searchTerm = event.currentTarget.value.toLowerCase()
    // Filtra las opciones
    const filteredOptions = originalOptions.filter(option => {
      const optionText = option.text.toLowerCase()
      return optionText.includes(searchTerm)
    })
  
    // Limpia el select
    select.innerHTML = ''
  
    // Agrega las opciones filtradas al select
    for (const option of filteredOptions) {
      select.appendChild(option)
    }
  })
}