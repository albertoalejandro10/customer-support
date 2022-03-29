import * as bootstrap from 'bootstrap'

// Conseguir parametros del URL
const getParameter = parameterName => {
    let parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}

// Fetch para traer servicios, si viene id en la URL
const servicePromise = ( id, tkn ) => {
    const url_getService = 'https://www.solucioneserp.net/maestros/servicios_clientes/get_servicioid'
    fetch( url_getService , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            "idServicio": id
        })
    })
    .then( resp => resp.json() )
    .then( ( [service] ) => {

            const { codigo, detalle, cantidad, fechaVencimiento, activo, abono, mesAbono, vencActivo, precioNeto, precioFijo } = service
            // console.log( codigo, detalle, cantidad, fechaVencimiento, activo, abono, mesAbono, vencActivo, precioNeto, precioFijo )

            const observation = document.getElementById('observation')
            observation.value = codigo.trim()

            const description = document.getElementById('description')
            description.value = detalle.trim()

            $('.selectpicker').selectpicker({title: `${detalle.trim()}`}).selectpicker('refresh')

            const quantity = document.getElementById('quantity')
            quantity.value = cantidad

            const expiration = document.getElementById('expiration')
            const formatExpiration = fechaVencimiento.split('/').reverse().join('-')
            expiration.value = formatExpiration

            // const selectType = document.getElementById('type')
            // if ( Comptipo === 'tipo 2' ) {
            //     selectType.value = 2
            //     let price = document.getElementById('netPrice')
            //     price.value = precioServ
            //     return visibleInput('netPrice')
            // }

            // if ( Comptipo === 'tipo 3' ) {
            //     selectType.value = 3
            //     let discountRate = document.getElementById('discountRate')
            //     discountRate.value = precioServ
            //     return visibleInput('discountRate')
            // }

            if ( abono ) {
                const abonoElement = document.getElementById('abonoChoice')
                abonoElement.checked = true
            }

            if ( activo ) {
                const activoElement = document.getElementById('activoChoice')
                activoElement.checked = true
            }
    })
}

// Cuando el usuario selecciona una opcion del combo productos, se ejecuta esta funcion.
const select = document.getElementById('product')
select.addEventListener('change', event => {
    // Si el valueSelected esta vacio, retorno.
    if ( event.currentTarget.options[select.selectedIndex].value === '') return

    // Si existe valueSelected, obtengo el valor.
    let selectedOption = event.currentTarget.options[select.selectedIndex]
    const selectedText = selectedOption.text
    printDescription(selectedText)

    const codeElement = document.getElementById('codigo')
    const code = (event.currentTarget.options[select.selectedIndex]).getAttribute('data-code')
    codeElement.value = code
})

// Funcion para insertar texto en descripcion
const printDescription = text => {
    let descriptionValue = document.getElementById('description')
    if (descriptionValue.value === '') return descriptionValue.value = text    
}

// Obtener el valor de la opcion seleccionada por el usuario
const selectType = document.getElementById('type')
selectType.addEventListener('change', event => {
    if ( event.currentTarget.options[selectType.selectedIndex].value === "1" ) return visibleInput('listPrice')
    if ( event.currentTarget.options[selectType.selectedIndex].value === "2" ) return visibleInput('netPrice')
    if ( event.currentTarget.options[selectType.selectedIndex].value === "3" ) return visibleInput('discountRate')
})

// Remover clase d-none de precio neto y % descuento.
const netPrice = document.getElementsByClassName('priceNet')
const discountRate = document.getElementsByClassName('rateDiscount')
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
const netPriceInput = document.getElementById('netPrice')
netPriceInput.addEventListener('blur', () => {
    netPriceInput.value = parseFloat(netPriceInput.value).toFixed(2)
})

const id = getParameter('id')
const idService = getParameter('idservice')
const name = getParameter('name')
const parameterName = (name).replaceAll(' ', '+')
const tkn = getParameter('tkn')

const tokenBearer = document.getElementById('tokenBearer')
tokenBearer.value = tkn

// Insertar href dentro de tag anchor.
const redirectToIndex = document.getElementById('redirectToIndex')
redirectToIndex.href = `/ServiciosClientes/ServicioClientesList.html?id=${id}&name=${parameterName}&tkn=${tkn}`

// Imprimir nombre
const customer = document.getElementById('customer')
customer.textContent = (name).replace('+', ' ')

// Si en la URL viene id, nombre y tkn, ejecuto esto.
if ( id && ! idService && name && tkn ) {
    const deleteButton = document.getElementById('deleteService')
    deleteButton.disabled = true
}

// Si en la URL viene cuatro parametros, ejecuto esto.
if ( id && idService && name && tkn ) {
    servicePromise( idService, tkn )
}

// Method post - Delete servicioid
const deleteService = document.getElementById('deleteService')
deleteService.onclick = () => {
    const id = getParameter('idservice')
    const url_deleteService = 'https://www.solucioneserp.net/maestros/servicios_clientes/delete_servicioid'
    fetch( url_deleteService, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            "idServicio": id
        })
    })
    .then( resp => resp.json() )
    .then( ({ resultado, mensaje}) => {
        // console.log(resultado, mensaje)
        alert(`${mensaje}`)
        location.reload()
    })
    .catch( err => {
        console.log( err )
    })
    deleteService.disabled = 'true'
}

// Method post - grabar servicioid
const $form = document.querySelector('#form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const detalle = formData.get('description')
    const cantidad = Number(formData.get('quantity'))
    const fechavencimiento = (formData.get('expiration')).split('-').reverse().join('/')
    const idcliente = Number(getParameter('id'))
    const observacion = formData.get('observation')

    let id = Number(getParameter('idservice'))
    if ( ! id ) {
        // console.log(' No hay id servicio, crear uno nuevo ')
        id = 0
    }
    
    let codigo = getParameter('codigo')
    if ( ! codigo ) {
        codigo = formData.get('codigo')
    }

    let activo = formData.get('activo')
    if ( activo === 'on' ) {
        activo = true
    } else {
        activo = false
    }

    let abono = formData.get('abono')
    if ( abono === 'on') {
        abono = true
    } else {
        abono = false
    }

    let preciofijo = Number(formData.get('discountRate'))
    if ( ! preciofijo ) {
        preciofijo = 0
    }
    let precioneto = Number(formData.get('netPrice'))
    if ( ! precioneto ) {
        precioneto = 0
    }

    const data = { id, codigo, detalle, cantidad, fechavencimiento, idcliente, observacion, activo, abono, preciofijo, precioneto }
    // console.table( data )

    const url_recordService = 'https://www.solucioneserp.net/maestros/servicios_clientes/grabar_servicioid'
    fetch( url_recordService , {
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
        alert(`${mensaje}`)
        location.reload()
    })
    .catch( err => {
        console.log( err )
    })
})

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