const formLower = document.getElementById('form-lower')
formLower.innerHTML = 
`    
<div class="col-12">
    <div class="row align-items-center">
        <div class="col-sm">
        &nbsp;
        </div>
        <div class="col-sm">
            <h6 id="nameExercise" class="font-weight-bolder text-center mt-2"></h6>
        </div>
        <div class="col-sm text-right">
            <p id="userName" class="mb-0"></p>
        </div>
    </div>
</div>
<div class="col-12">
    <div class="row align-items-end">
        <div class="col-6 text-left">
            <p id="companyName" class="mb-0"></p>
        </div>
        <div class="col-6 text-right">
            <p id="timeExercise" class="mb-0"></p>
        </div>
    </div>
</div>
`

const tknUserPromise = tkn => {
    const url_getUser = 'https://www.solucioneserp.net/session/login_sid'
    fetch( url_getUser , {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const users = resp

        const { estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre } = users
        // console.log( estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre )

        const nameExercise = document.getElementById('nameExercise')
        nameExercise.textContent = ejercicioNombre

        const userName = document.getElementById('userName')
        userName.textContent = usuarioNombre

        const today = new Date()
        const day = today.getDate()
        const month = today.getMonth()
        const year = today.getFullYear()
        const fullDate = `${day}/${month+1}/${year}`

        const hours = today.getHours()
        const minutes = today.getMinutes()
        const seconds = today.getSeconds()

        const fullTime = `${getFullTime(hours)}:${minutes}:${seconds}`

        const companyName = document.getElementById('companyName')
        companyName.textContent = `${empresaNombre} - ${fullDate} ${fullTime}`

        const timeExercise = document.getElementById('timeExercise')
        timeExercise.textContent = `${ejercicioInicio} - ${ejercicioCierre}`
    })
}

// Get Full Date
const getFullTime = hours => {
    let timeValue= 0
    if ( hours > 0 && hours <= 12 ) {
        timeValue = hours
    } else if ( hours > 12 ) {
        timeValue = (hours - 12)
    } else {
        timeValue = 12
    }
    return timeValue
}

// Conseguir parametros del URL
const getParameter = parameterName => {
    let parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}

const tkn = getParameter('tkn')
// Si viene tkn en la URL, se ejecuta
if ( tkn ) {
    const tokenBearer = document.getElementById('tokenBearer')
    tokenBearer.value = tkn
    tknUserPromise(tkn)
}