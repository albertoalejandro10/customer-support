import { getParameter } from "../../jsgen/Helper"

// Listado plan de cuentas
const get_accountPlan = tkn => {
  const url_getAccountPlan = process.env.Solu_externo + '/listados/get_plan_cuenta'
  fetch( url_getAccountPlan, {
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
  .then( accountPlan => accountPlan.json())
  .then( accountsPlan => {
    // console.log(accountsPlan)
    for (const {codigo, nombre} of accountsPlan) {
      const select = document.querySelector('#result-account')
      let option = document.createElement("option")
      option.setAttribute("data-tokens", codigo)
      option.value = codigo
      option.textContent = nombre
      select.appendChild( option )
    }
  })
  .catch( err => {
    console.log( err )
  })
}

const tkn = getParameter('tkn')
if ( tkn ) {
  get_accountPlan( tkn )
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
    switch(nro) {
      case -1:
      case 4073:
        generateButton.classList.add('d-none')
        cancelButton.classList.remove('d-none')
        break
      case 1:
        generateButton.classList.remove('d-none')
        cancelButton.classList.add('d-none')
        break
    }
  })
  .catch( err => {
      console.log( err )
  })
}

const form = document.getElementById('form')
const handleButtonClick = (event, generarcierre) => {
  if (!form.reportValidity()) {
    return;
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