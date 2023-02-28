import { getParameter } from "../../jsgen/Helper"
import * as bootstrap from 'bootstrap'

// Fetch para traer servicios, si viene id en la URL
const servicePromise = ( id, idservice, tkn ) => {
    const url_getService = process.env.Solu_externo + '/maestros/servicios_clientes/get_servicioid'
    fetch( url_getService , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            "idServicio": idservice,
            "clienteId": id
        })
    })
    .then( resp => resp.json() )
    .then( resp => {
        // console.log( resp )
        const { productoId, codigo, detalle, cantidad, fechaVencimiento, activo, abono, mesAbono, vencActivo, precioNeto, tipoPrecio, observacion, clienteId, clienteCodigo, cliente, lineaId, tipoComp } = resp
        // console.log( codigo, detalle, cantidad, fechaVencimiento, activo, abono, mesAbono, vencActivo, precioNeto, tipoPrecio, observacion, clienteId, clienteCodigo, cliente, lineaId, tipoComp )

        const observation = document.getElementById('observation')
        observation.value = observacion.trim()
        observation.setAttribute('exists-observation', true)

        document.getElementById('description').value = detalle.trim()
        document.getElementById('quantity').value = cantidad
        document.getElementById('expiration').value = fechaVencimiento.split('/').reverse().join('-')

        const selectType = document.getElementById('type')
        if ( tipoPrecio === 1 ) {
            selectType.value = 1
            let price = document.getElementById('currency-field')
            price.value = precioNeto.toLocaleString('de-DE')
            visibleInput('netPrice')
        }

        if ( tipoPrecio === 2 ) {
            selectType.value = 2
            let discountRate = document.getElementById('discountRate')
            discountRate.value = precioNeto
            visibleInput('discountRate')
        }

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

    const observation = document.getElementById('observation')
    if(! observation.getAttribute('exists-observation') === true ) {
        observation.value = selectedText
    }

    const codeElement = document.getElementById('codigo')
    const code = (event.currentTarget.options[select.selectedIndex]).getAttribute('data-code')
    codeElement.value = code
})

// Funcion para insertar texto en descripcion
const printDescription = text => {
    let descriptionValue = document.getElementById('description')
    if (! observation.getAttribute('exists-observation') === true ) return descriptionValue.value = text
}

document.getElementById('description').addEventListener('keyup', event => {
    const {target} = event
    let observation = document.getElementById('observation')
    if (! observation.getAttribute('exists-observation') === true) {
        observation.value = target.value
    }
})

// Obtener el valor de la opcion seleccionada por el usuario
const selectType = document.getElementById('type')
selectType.addEventListener('change', event => {
    if ( event.currentTarget.options[selectType.selectedIndex].value === "0" ) return visibleInput('listPrice')
    if ( event.currentTarget.options[selectType.selectedIndex].value === "1" ) return visibleInput('netPrice')
    if ( event.currentTarget.options[selectType.selectedIndex].value === "2" ) return visibleInput('discountRate')
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

const id = getParameter('id')
const idService = getParameter('idservice')
const name = getParameter('name')
const parameterName = (name).replaceAll(' ', '+')
const tkn = getParameter('tkn')

const tokenBearer = document.getElementById('tokenBearer')
tokenBearer.value = tkn

// Insertar href dentro de tag anchor.
document.getElementById("redirectToList").onclick = () => {
    location.href = process.env.VarURL + `/ServiciosClientes/ServicioClientesList.html?id=${id}&name=${parameterName}&tkn=${tkn}`
}

// Imprimir nombre
const customer = document.getElementById('customer')
customer.textContent = name.replace('+', ' ')

// Si en la URL viene id, nombre y tkn, ejecuto esto.
if ( id && ! idService && name && tkn ) {
    const deleteButton = document.getElementById('deleteService')
    deleteButton.disabled = true
}

// Si en la URL viene cuatro parametros, ejecuto esto.
if ( id && idService && name && tkn ) {
    servicePromise( id, idService, tkn )
}

// Method post - Delete servicioid
const deleteService = document.getElementById('deleteService')
deleteService.onclick = () => {
    const id = getParameter('idservice')
    const url_deleteService = process.env.Solu_externo + '/maestros/servicios_clientes/delete_servicioid'
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
        alert(`${resultado} - ${mensaje}`)
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
    if ( ! id ) id = 0
    
    let codigo = getParameter('codigo')
    if ( ! codigo ) codigo = formData.get('codigo')

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

    const preciofijo = Number(document.getElementById('type').value)
    const netPriceValue = Number(((document.getElementById('currency-field').value).replaceAll('.', '')).replace(',','.'))
    const discountRateValue = Number(document.getElementById('discountRate').value)
    let precioneto = 0
    if ( preciofijo === 1 ) {
        precioneto = netPriceValue
    }

    if ( preciofijo === 2 ) {
        precioneto = discountRateValue
    }

    const data = { id, codigo, detalle, cantidad, fechavencimiento, idcliente, observacion, activo, abono, preciofijo, precioneto, idlista: 0, ctipo: 1}
    // console.table( data )
    const url_recordService = process.env.Solu_externo + '/maestros/servicios_clientes/grabar_servicioid'
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
        alert(`${resultado} - ${mensaje}`)
        location.reload()
    })
    .catch( err => {
        console.log( err )
    })
})

// Formatear input cantidad
class CampoNumerico {
    constructor(selector) {
        this.nodo = document.querySelector(selector)
        this.valor = ''
        
        this.empezarAEscucharEventos()
    }
    empezarAEscucharEventos() {
        this.nodo.addEventListener('keydown', function(evento) {
        const teclaPresionada = evento.key
        const teclaPresionadaEsUnNumero =
            Number.isInteger(parseInt(teclaPresionada))

        const sePresionoUnaTeclaNoAdmitida = 
            teclaPresionada != 'ArrowDown' &&
            teclaPresionada != 'ArrowUp' &&
            teclaPresionada != 'ArrowLeft' &&
            teclaPresionada != 'ArrowRight' &&
            teclaPresionada != 'Backspace' &&
            teclaPresionada != 'Delete' &&
            teclaPresionada != 'Enter' &&
            !teclaPresionadaEsUnNumero
        const comienzaPorCero = 
            this.nodo.value.length === 0 &&
            teclaPresionada == 0

        if (sePresionoUnaTeclaNoAdmitida || comienzaPorCero) {
            evento.preventDefault() 
        } else if (teclaPresionadaEsUnNumero) {
            this.valor += String(teclaPresionada)
        }

        }.bind(this))

        this.nodo.addEventListener('input', function(evento) {
        const cumpleFormatoEsperado = new RegExp(/^[1-9]+/).test(this.nodo.value)

        if (!cumpleFormatoEsperado) {
            this.nodo.value = this.valor
        } else {
            this.valor = this.nodo.value
        }
        }.bind(this))
    }
}
new CampoNumerico('#quantity')

document.getElementById('currency-field').addEventListener('keyup', event => {
    let {target} = event
    if ( target.value.length < 2 ) {
        if (target.value === '-') return
    }
    let result = format_currency(String(target.value))
    if ( result.includes('NaN') ) result = ''
    target.value = result
})

const format_currency = value => {
    value = value.replace('.', '').replace(',', '').replace(/(?!-)[^0-9]/g, "") 
    const options = { minimumFractionDigits: 2, maximumFractionsDigits: 2 }
    const result = new Intl.NumberFormat('pt-BR', options).format(
        parseFloat(value) / 100
    )
    return result
}