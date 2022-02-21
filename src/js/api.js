import { getParameter } from "./service"

const deleteService = document.getElementById('deleteService')
deleteService.onclick = () => {
    const id = getParameter('id')
    fetch(`https://62048c21c6d8b20017dc3571.mockapi.io/api/v1/customers/${id}/Services/${id}`, {
        method: 'DELETE',
    })
    .then( resp => resp.json() )
    .then( resp => {
        console.log(resp)
        alert('Información eliminada exitosamente')
        location.reload()
    })
    .catch( err => {
        console.log( err )
    })

    deleteService.disabled = 'true'
}

const $form = document.querySelector('#form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const id = getParameter('id')
    const clienteid = getParameter('id')
    const codigoServ = `nombre ${id}`
    const nombreServ = formData.get('description')
    const precioServ = Number(formData.get('netPrice'))
    const cantidad = Number(formData.get('quantity'))
    const vencimiento = formData.get('expiration')
    const tipo = false
    const activo = false
    const observacion = formData.get('observation')

    const data = { codigoServ, observacion, nombreServ, cantidad, tipo, precioServ, vencimiento, activo, id, clienteid }

    fetch(`https://62048c21c6d8b20017dc3571.mockapi.io/api/v1/customers/${id}/Services`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        console.log(resp)
        alert('Información cargada exitosamente')
        location.reload()
    })
    .catch( err => {
        console.log( err )
    })
})