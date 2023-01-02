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
    const lineaVtaId = [...select.options]
        .filter(x => x.selected)
        .map(x => x.value)
        .toString()

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

$("input[data-type='index']").on({
    keyup: function() {
      format_currency_three($(this))
    },
    blur: function() { 
      format_currency_three($(this), "blur")
    }
})
