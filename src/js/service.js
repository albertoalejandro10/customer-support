import * as bootstrap from 'bootstrap'
import * as selectpicker from 'bootstrap-select'

// Fetch para traer datos de clientes (detalle y id)
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

// Funcion para insertar texto a la descripcion
const printDescription = text => {
    let descriptionValue = document.getElementById('description')
    if (descriptionValue.value === '') return descriptionValue.value = text    
}

let selectType = document.getElementById('type')
selectType.addEventListener('change', event => {
    if ( event.currentTarget.options[selectType.selectedIndex].value === "1" ) return
    if ( event.currentTarget.options[selectType.selectedIndex].value === "2" ) return visibleInput('netPrice')
    if ( event.currentTarget.options[selectType.selectedIndex].value === "3" ) return visibleInput('discountRate')
})

// Remover clase d-none de precio neto y % descuento.
let netPrice = document.getElementsByClassName('priceNet')
let discountRate = document.getElementsByClassName('rateDiscount')
const visibleInput = type => {

    if ( type === 'netPrice') {
        let i = 0
        do {
            netPrice[i].classList.remove('d-none')
            discountRate[i].classList.add('d-none')
            i++
        } while ( i < 2 )
    }

    if ( type === 'discountRate' ) {
        let i = 0
        do {
            discountRate[i].classList.remove('d-none')
            netPrice[i].classList.add('d-none')
            i++
        } while ( i < 2 )
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