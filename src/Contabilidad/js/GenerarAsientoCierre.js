import { getParameter } from "../../jsgen/Helper"

// Function to get exercise state
const get_exerciseState = async tkn => {
  try {
    let response = await fetch(process.env.Solu_externo + '/contabilidad/asiento/estado', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      },
    })
    let { cerrado } = await response.json()
    return cerrado
  } catch (error) {
    console.error(error.message)
  }
}

// Function to get accounts plan
const get_accountsPlan = async tkn => {
  try {
    const response = await fetch(process.env.Solu_externo + '/listados/get_plan_cuenta', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      },
      body: JSON.stringify({
        "tipo": 1,
        "alfa": 1,
        "todos": 1
      })
    })
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Could not get accounts: ${error}`)
  }
}

const tkn = getParameter('tkn')
if ( tkn ) {
  Promise.all([get_exerciseState(tkn), get_accountsPlan(tkn)])
    .then(([state, accounts]) => {
      const cancelClosureElement = document.getElementById('cancel-closure')
      const generateClosureElement = document.getElementById('generate-closure')
      state ? cancelClosureElement.classList.remove('d-none') : cancelClosureElement.classList.add('d-none')
      state ? generateClosureElement.classList.add('d-none') : generateClosureElement.classList.remove('d-none')

      const data = accounts.map(({ codigo, nombre }) => ({
        id: codigo,
        text: nombre
      }))

      const combo_configs = {
        allowClear: true,
        language: {
          noResults: () => "No se encontraron resultados",
        },
        placeholder: 'Buscar cuenta',
        data,
      }
      $("#result-account").select2(combo_configs)
        .on('select2:open', () => $(".select2-search__field")[0].focus())
        .on("select2-clearing", () => { $(this).val(null).trigger("change") })
    })
    .catch(error => {
      console.error(`Could not update account select: ${error}`)
    })
}

const post_generateClosure = data => {
  const url_postGenerateClosure = process.env.Solu_externo + '/contabilidad/asiento/generar_anular_cierre'
  fetch( url_postGenerateClosure , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify(data)
  })
  .then( closure => closure.json())
  .then( ({nro, descripcion}) => {
    alert(`Número: ${nro} \nDescripción: ${descripcion}`)
    if (nro === -1) return
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

// const get_searchText = () => {
//   // Obtén los elementos del DOM
//   const searchInput = document.getElementById('search-user')
//   const select = document.getElementById('result-account')
//   // Guarda las opciones originales del select
//   const originalOptions = Array.from(select.options)
//   // Agrega el event listener al input de búsqueda
//   searchInput.addEventListener('input', event => {
//     const searchTerm = event.currentTarget.value.toLowerCase()
//     // Filtra las opciones
//     const filteredOptions = originalOptions.filter(option => {
//       const optionText = option.text.toLowerCase()
//       return optionText.includes(searchTerm)
//     })
  
//     // Limpia el select
//     select.innerHTML = ''
  
//     // Agrega las opciones filtradas al select
//     for (const option of filteredOptions) {
//       select.appendChild(option)
//     }
//   })
// }