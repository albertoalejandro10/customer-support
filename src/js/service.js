import * as bootstrap from 'bootstrap'
import * as selectpicker from 'bootstrap-select'

// Fetch para traer datos de productos (detalle y id)
fetch(`https://62048c21c6d8b20017dc3571.mockapi.io/api/v1/productos`)
    .then( resp => resp.json() )
    .then( resp => {
        const products = resp
        for ( let element of products ) {
            // Desestructuracion del objeto element
            const { detalle, id } = element
            // console.log(detalle, Number(id))

            let select = document.querySelector('#product')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", detalle)
            option.setAttribute("data-content", detalle)
            option.value = id
            option.textContent = detalle

            select.appendChild( option )
        }
    })

// Conseguir parametros del URL
const getParameter = parameterName => {
    let parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}
// console.log(Number(getParameter('id')))
// console.log(getParameter('name'))

let customerName = document.getElementsByClassName('customerName')
let i = 0
do {
    customerName[i].textContent = (getParameter('name')).replace('-', ' ')
    i++
} while ( i < customerName.length)

const hiddenInputId = document.getElementById('customerId')
hiddenInputId.value = getParameter('id')

const hiddenInputName = document.getElementById('customerName')
hiddenInputName.value = getParameter('name')

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

new CampoNumerico('#quantity');

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

let netPriceInput = document.getElementById('netPrice')
netPriceInput.addEventListener('blur', () => {
    netPriceInput.value = parseFloat(netPriceInput.value).toFixed(2)
})

// let discountRateInput = document.getElementById('discountRate')
// discountRateInput.addEventListener('blur', () => {
//     console.log('Ok')
// })


// const codigoServ = 'codigoServ 1'
// const nombreSer = 'nombreServ 1'
// const precioServ = document.getElementById('netPrice')
// const cantidad = document.getElementById('quantity')
// const vencimiento = document.getElementById('expiration')
// const tipo = 'Tipo 1'
// const activo = false
// const observacion = document.getElementById('observation')
// const clientId = getParameter('id')
// const clientName = getParameter('name')

// let inputs = document.getElementsByClassName('inputToPost').value
// console.log(inputs)


// // FormData POST to API
// let formData = new FormData()