import { getParameter } from "../../jsgen/Helper"

//Array de ejercicios
const array_exercises = []


// Listado de Ejercicios
window.get_exercises = tkn => {
    const url_getExercises = process.env.Solu_externo + '/utilidades/ejercicio/get_ejercicios'
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
            //Arrelgo de ejercicios
            array_exercises.push(element)
            
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
    const url_postModifiedExercise = process.env.Solu_externo + '/utilidades/ejercicio/modificar_ejercicio_usuario'
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

    console.log(array_exercises)

    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const ejercicioId = Number(formData.get('exercise'))
    const data = { ejercicioId }
    // console.table( data )
    post_modifiedExercise( tkn, data )

    //Obtiene eobjeto selecionado
    let excersice = array_exercises.find(objeto => objeto.id == ejercicioId)

    //Agrega src al iframe
    var iframe = document.querySelector("#iframe")
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    var url = `../../gestionw/tranejer_ext.asp?nejercicio=${String(excersice.ejercicio).substring(0,String(excersice.ejercicio).indexOf(" -->"))}&ejerini=${new Date(excersice.inicio).toLocaleDateString('es-ar',options)}&ejercie=${new Date(excersice.cierre).toLocaleDateString('es-ar',options)}&ejer=${excersice.id}`
    iframe.setAttribute("src", url)
    console.log(iframe)


    //Reload del pie del formulario
    get_UserFooter(tkn)


})


//const url = ~/gestionw/tranejer_ext.asp?nejercicio=var1&ejerini=var2&ejercie=var3