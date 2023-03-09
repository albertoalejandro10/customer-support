import { getParameter } from "../../jsgen/Helper"

let editor
ClassicEditor
    .create(document.querySelector('#editor'), {
    })
    .then( newEditor => {
        editor = newEditor
    })
    .catch( error => {
        console.error( error )
    })

let id = getParameter('id')
const tkn = getParameter('tkn')
if (!id) document.getElementById('delete').disabled = true

const notices = (id, tkn) => {
    const url_getNotices = process.env.Solu_externo + '/maestros/clientes/get_avisoId'
    fetch( url_getNotices , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            "avisoId": id
        })
    })
    .then( notices => notices.json() )
    .then( notices => {
        // console.log(notices)
        const {avisoDatos, resultado} = notices
        const { aviso, titulo, mensaje } = avisoDatos
        if ( resultado === 'ok' ) {
            document.getElementById('name').value = aviso
            document.getElementById('matter').value = titulo
            editor.setData(mensaje)
        }
    })
}
notices(id, tkn)

// Method post - Delete servicioid
const deleteNotice = document.getElementById('delete')
deleteNotice.onclick = () => {

    const result = confirm('¿Esta seguro?')
    if ( !result ) return

    const url_deleteNotice = process.env.Solu_externo + '/maestros/clientes/guardar_aviso'
    fetch( url_deleteNotice, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            "avisoId": id,
            "accion": "DEL"
        })
    })
    .then( resp => resp.json() )
    .then( ({ resultado, mensaje}) => {
        alert(`${resultado} - ${mensaje}`)
        location.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAvisos.html?tkn=${tkn}`
    })
    .catch( err => {
        console.log( err )
    })
}

const backToList = document.getElementById('backtolist')
backToList.onclick = () => {
    location.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAvisos.html?tkn=${tkn}`
}

// Method post - grabar servicioid
const $form = document.querySelector('#form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const aviso = formData.get('name')
    const titulo = formData.get('matter')
    const mensaje = editor.getData()

    if ( ! id ) id = 0
    const data = {
        avisoId: id,
        "avisoDatos": {
            aviso,
            titulo,
            mensaje
        },
        accion: "ADD"
    }
    // console.log(data)
    addNotice(data)
})

const addNotice = data => {
    const url_addNotice = process.env.Solu_externo + '/maestros/clientes/guardar_aviso'
    fetch( url_addNotice , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ({ resultado, mensaje}) => {
        // console.log(resultado, mensaje)
        alert(`${resultado} - ${mensaje}`)
        location.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAvisos.html?tkn=${tkn}`
    })
    .catch( err => {
        console.log( err )
    })   
}