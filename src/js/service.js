import * as bootstrap from 'bootstrap'

// Conseguir parametros del URL
const getParameter = parameterName => {
    let parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}
// console.log(Number(getParameter('id')))
// console.log(getParameter('name'))

// Formatear input cantidad - Es copiado.
class CampoNumerico {

    constructor(selector) {
        this.nodo = document.querySelector(selector);
        this.valor = '';
        
        this.empezarAEscucharEventos();
    }

    empezarAEscucharEventos() {
        this.nodo.addEventListener('keydown', function(evento) {
        const teclaPresionada = evento.key;
        const teclaPresionadaEsUnNumero =
            Number.isInteger(parseInt(teclaPresionada));

        const sePresionoUnaTeclaNoAdmitida = 
            teclaPresionada != 'ArrowDown' &&
            teclaPresionada != 'ArrowUp' &&
            teclaPresionada != 'ArrowLeft' &&
            teclaPresionada != 'ArrowRight' &&
            teclaPresionada != 'Backspace' &&
            teclaPresionada != 'Delete' &&
            teclaPresionada != 'Enter' &&
            !teclaPresionadaEsUnNumero;
        const comienzaPorCero = 
            this.nodo.value.length === 0 &&
            teclaPresionada == 0;

        if (sePresionoUnaTeclaNoAdmitida || comienzaPorCero) {
            evento.preventDefault(); 
        } else if (teclaPresionadaEsUnNumero) {
            this.valor += String(teclaPresionada);
        }

        }.bind(this));

        this.nodo.addEventListener('input', function(evento) {
        const cumpleFormatoEsperado = new RegExp(/^[1-9]+/).test(this.nodo.value);

        if (!cumpleFormatoEsperado) {
            this.nodo.value = this.valor;
        } else {
            this.valor = this.nodo.value;
        }
        }.bind(this));
    }
}

new CampoNumerico('#quantity')

// Funcion fetch para traer servicios, si viene id en la URL
const servicePromise = id => {
    fetch(`https://62048c21c6d8b20017dc3571.mockapi.io/api/v1/customers/${id}/Services`)
        .then( resp => resp.json( ))
        .then( resp => {
            const services = resp
            for ( let element of services ) {
                

                const { observacion, nombreServ, cantidad, tipo, precioServ, vencimiento, activo, id } = element
                // console.log( observacion, nombreServ, cantidad, tipo, precioServ, vencimiento, activo )

                let customer = document.getElementById('customer')
                customer.textContent = `nombre ${id}`

                let observation = document.getElementById('observation')
                observation.value = observacion

                let description = document.getElementById('description')
                description.value = nombreServ
                
                let quantity = document.getElementById('quantity')
                quantity.value = cantidad

                let expiration = document.getElementById('expiration')
                expiration.value = vencimiento.slice(0, 10)

                let selectType = document.getElementById('type')
                if ( tipo === 'tipo 2' ) {
                    selectType.value = 2
                    let price = document.getElementById('netPrice')
                    price.value = precioServ
                    return visibleInput('netPrice')
                }

                if ( tipo === 'tipo 3' ) {
                    selectType.value = 3
                    let discountRate = document.getElementById('discountRate')
                    discountRate.value = precioServ
                    return visibleInput('discountRate')
                }

            }
        })
}

// Insertar href dentro de tag anchor.
const redirectToIndex = document.getElementById('redirectToIndex')
redirectToIndex.href = `/index.html?id=${getParameter('id')}&name=nombre-${getParameter('id')}`

// Cuando el usuario selecciona una opcion del combo productos, se ejecuta esta funcion.
let select = document.getElementById('product')
select.addEventListener('change', event => {
    // Si el valueSelected esta vacio, retorno.
    if ( event.currentTarget.options[select.selectedIndex].value === '') return

    // Si existe valueSelected, obtengo el valor.
    let selectedOption = event.currentTarget.options[select.selectedIndex]
    // console.log(selectedOption.value + ': ' + selectedOption.text)

    const selectedText = selectedOption.text
    printDescription(selectedText)
})

// Funcion para insertar texto en descripcion
const printDescription = text => {
    let descriptionValue = document.getElementById('description')
    if (descriptionValue.value === '') return descriptionValue.value = text    
}

// Obtener el valor de la opcion seleccionada por el usuario
let selectType = document.getElementById('type')
selectType.addEventListener('change', event => {
    if ( event.currentTarget.options[selectType.selectedIndex].value === "1" ) return visibleInput('listPrice')
    if ( event.currentTarget.options[selectType.selectedIndex].value === "2" ) return visibleInput('netPrice')
    if ( event.currentTarget.options[selectType.selectedIndex].value === "3" ) return visibleInput('discountRate')
})

// Remover clase d-none de precio neto y % descuento.
let netPrice = document.getElementsByClassName('priceNet')
let discountRate = document.getElementsByClassName('rateDiscount')
const visibleInput = type => {

    if ( type === 'listPrice') {
        for ( const element of netPrice ) {
            element.classList.add('d-none')
        }

        for ( const element of discountRate ) {
            element.classList.add('d-none')
        }
    }

    if ( type === 'netPrice') {
        let i = 0
        do {
            netPrice[i].classList.remove('d-none')
            discountRate[i].classList.add('d-none')
            i++
        } while ( i < netPrice.length )
    }

    if ( type === 'discountRate' ) {
        let i = 0
        do {
            discountRate[i].classList.remove('d-none')
            netPrice[i].classList.add('d-none')
            i++
        } while ( i < discountRate.length )
    }
}

// Formatear input precio neto
let netPriceInput = document.getElementById('netPrice')
netPriceInput.addEventListener('blur', () => {
    netPriceInput.value = parseFloat(netPriceInput.value).toFixed(2)
})

// Si en la URL viene id y nombre, ejecuto esto.
if ( getParameter('id') && getParameter('name') ) {
    const deleteButton = document.getElementById('deleteService')
    deleteButton.disabled = true
    const customer = document.getElementById('customer')
    customer.textContent = (getParameter('name')).replace('-', ' ')
}

// Si en la URL viene solo id, ejecuto esto.
if ( getParameter('id') && ! getParameter('name') ) {
    const addButton = document.getElementById('addService')
    addButton.disabled = true
    servicePromise(getParameter('id'))
}



// Method DELETE
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

// Metodo POST
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