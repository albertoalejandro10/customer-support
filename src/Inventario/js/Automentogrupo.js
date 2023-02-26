import { getParameter, reverseFormatNumber } from "../../jsgen/Helper"

const post_modifyPricesByGroup = (tkn, data) => {
    const url_GenerateButton = process.env.Solu_externo + '/inventario/precios_por_grupo/grabar'
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

// * Format currency and rounding to three digits
const format_currency_three = (input, blur) => {
    let input_val = input.val()
    if (input_val === "") { return }
    const original_len = input_val.length
    let caret_pos = input.prop("selectionStart")
    if (input_val.indexOf(",") >= 0) {
      const decimal_pos = input_val.indexOf(",")
      let left_side = input_val.substring(0, decimal_pos)
      let right_side = input_val.substring(decimal_pos)
      left_side = left_side.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      right_side = right_side.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      if (blur === "blur") {
        right_side += "000"
      }
      right_side = right_side.substring(0, 3)
      input_val = left_side + "," + right_side
    } else {
      input_val = input_val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      if (blur === "blur") {
        input_val += ",000"
      }
    }
    input.val(input_val)
    const updated_len = input_val.length
    caret_pos = updated_len - original_len + caret_pos
    input[0].setSelectionRange(caret_pos, caret_pos)
}  