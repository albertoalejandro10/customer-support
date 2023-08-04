import { getParameter } from "./Helper"

const formLower = document.getElementById('form-lower')
formLower.innerHTML = 
`    
<div class="col-12">
  <div class="row align-items-end">
    <div class="col-4 text-left">
      <p id="companyName" class="mb-0"></p>
    </div>
      <div class="col-4 align-items-center" >
      <h6 id="nameExercise" class="font-weight-bolder text-center mt-2 text-secondary"></h6>
    </div>
    <div class="col-4 text-right">
      <p id="timeExercise" class="mb-0"></p>
    </div>
  </div>
</div>
`

window.get_userFooter = tkn => {
  fetch( process.env.Solu_externo + '/session/login_sid' , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    }
  })
  .then( resp => {
    if (resp.ok) {
      return resp.json()
    } else {
      throw new Error(resp.status)
    }
  } )
  .then( ({ estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre }) => {
    // console.log( estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre )
    const nameExercise = document.getElementById('nameExercise')
    nameExercise.textContent = ejercicioNombre

    // Get day and full time
    const today = new Date()
    const day = today.toLocaleDateString('en-GB')
    const fullTime = today.toLocaleTimeString()

    const companyName = document.getElementById('companyName')
    companyName.textContent = `${empresaNombre} - ${usuarioNombre} - ${day} ${fullTime}`

    const timeExercise = document.getElementById('timeExercise')
    timeExercise.textContent = `${ejercicioInicio} - ${ejercicioCierre}`
  })
}

// Si viene tkn en la URL, se ejecuta
const tkn = getParameter( 'tkn' )
if ( tkn ) {
  get_userFooter(tkn)
}