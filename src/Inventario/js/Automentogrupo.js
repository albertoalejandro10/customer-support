import { format_currency_three, getParameter, reverseFormatNumber } from "../../jsgen/Helper"

const post_modifyPricesByGroup = (tkn, data) => {
    const url_GenerateButton = 'https://www.solucioneserp.net/inventario/precios_por_grupo/grabar'
    fetch( url_GenerateButton , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ({ resultado, mensaje}) => {
        console.log(resultado, mensaje)
        alert(`${resultado} - ${mensaje}`)
        location.reload()
    })
    .catch( err => {
        console.log( err )
    })
}

const tkn = getParameter('tkn')
const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const campoId = Number(formData.get('field'))
    const listaId = Number(formData.get('list'))
    const operacionId = Number(formData.get('opetaions'))
    const listaOrigenId = Number(formData.get('origin-list'))
    const indice = formData.get('index') === '' ? 0.000 : Number(reverseFormatNumber(formData.get('index'), 'de'))
    const redondeo = Number(formData.get('rounding'))
    const proveedorId = Number(formData.get('vendor'))
    const rubroId = Number(formData.get('entry'))

    const select = document.getElementById('sale-line')
    let lineaVtaId = [...select.options]
        .filter(x => x.selected)
        .map(x => x.value)
        .toString()

    if (lineaVtaId.includes('0')) lineaVtaId = "0"

    const data = {
        campoId,
        listaId,
        operacionId,
        listaOrigenId,
        indice,
        redondeo,
        proveedorId,
        rubroId,
        lineaVtaId,
    }
    // console.table( data )
    post_modifyPricesByGroup( tkn, data )
})

// Desactivar opciones del select dependiendo del click en «todos» o en el grupo de los otros options y limpiar select
const selectType = document.getElementById('sale-line')
selectType.addEventListener('click', event => {
    const options = Array.from(document.querySelectorAll('#sale-line option'))
    const { path } = event
    if (path[0].value === '0') {
        for (const element of options) {
            if (element.value === '0') continue
            element.selected = false
        }
    } else {
        options[0].selected = false
    }

    if (!event.currentTarget.options[selectType.selectedIndex]) {
        options.map(element => element.disabled = false)
    }
})

$("input[data-type='index']").on({
    keyup: function() {
      format_currency_three($(this))
    },
    blur: function() { 
      format_currency_three($(this), "blur")
    }
})
