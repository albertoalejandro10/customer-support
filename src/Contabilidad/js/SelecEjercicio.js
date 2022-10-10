import { getParameter } from "../../jsgen/Helper"

// Listado de Ejercicios
const get_exercises = tkn => {
    const url_getExercises = 'https://www.solucioneserp.net/utilidades/ejercicio/get_ejercicios'
    fetch( url_getExercises, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const exercises = resp
        for (const element of exercises) {
            const { id, ejercicio, inicio, cierre } = element
            // console.log(id, ejercicio, inicio, cierre)
            const select = document.querySelector('#exercise')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", id)
            option.value = id
            option.textContent = ejercicio
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
    get_exercises( tkn )
}

const post_modifiedExercise = (tkn, data) => {
    const url_postModifiedExercise = 'https://www.solucioneserp.net/utilidades/ejercicio/modificar_ejercicio_usuario'
    fetch( url_postModifiedExercise , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( resp => resp.json())
    .then( resp => {
        document.getElementById('sucess').classList.remove('d-none')
        document.getElementById('error').classList.add('d-none')
    })
    .catch( err => {
        console.log( err )
        document.getElementById('error').classList.remove('d-none')
        document.getElementById('sucess').classList.add('d-none')
    })
}

// Boton actualizar
const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const ejercicioId = Number(formData.get('exercise'))
    const data = { ejercicioId }
    // console.table( data )
    post_modifiedExercise( tkn, data )
})