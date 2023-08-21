// Conseguir parametros del URL
export const getParameter = parameterName => {
    const parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}

// Fecha de inicio de ejercicio
export const get_StartPeriod = tkn => {
    const url_getStartPeriod = process.env.Solu_externo + '/session/login_sid'
    fetch( url_getStartPeriod, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        // Start Period
        const { ejercicioInicio } = resp
        // console.log(ejercicioInicio)
        const startDate = ejercicioInicio.split('/').reverse().join('-')
        const periodStart = document.getElementById('periodStart')
        periodStart.value = startDate

        // End Period
        const today = new Date().toLocaleDateString('en-GB')
        const endDate = today.split('/').reverse().join('-')
        const periodEnd = document.getElementById('periodEnd')
        periodEnd.value = endDate
    })
    .catch( err => {
        console.log( err )
    })
}

// Calcular total
let importeTotal = 0
export const calcularImporteTotal = importe => {
    importeTotal += importe
    return importeTotal
}

export const restarImporteTotal = importe => {
    importeTotal -= importe
    return importeTotal
}

export const format_number = importeNeto => 
    new Intl.NumberFormat("de-DE", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true
    }).format(importeNeto)

export const format_token = all_link => {
    return all_link && all_link.includes('tkn=tokenext') 
        ? all_link.replace('tokenext', getParameter('tkn'))
        : all_link || '';
}

// Formatear numero 1,000.00 to 1000,00
export const reverseFormatNumber = (val, locale) => {
    const group = new Intl.NumberFormat(locale).format(1111).replace(/1/g, '')
    const decimal = new Intl.NumberFormat(locale).format(1.1).replace(/1/g, '')
    let reversedVal = val.replace(new RegExp('\\' + group, 'g'), '')
    reversedVal = reversedVal.replace(new RegExp('\\' + decimal, 'g'), '.')
    return Number.isNaN(reversedVal) ? 0 : reversedVal
}

// Solo numeros input tipo texto.
export const numbersOnly = string => {
    let out = ''
    // Caracteres validos
    const filtro = '1234567890'
    // Recorrer el texto y verificar si el caracter se encuentra en la lista de validos 
    for (let i = 0; i < string.length; i++) {
        if ( filtro.indexOf(string.charAt(i)) != -1 ) {
            //Se añaden a la salida los caracteres validos
            out += string.charAt(i)
        }
    }
    //Retornar valor filtrado
    return out
}

export const format_currency = (input, blur) => {
    // get input value
    let input_val = input.val()
    // don't validate empty input
    if (input_val === "") { return }
    // original length
    const original_len = input_val.length
    // initial caret position 
    let caret_pos = input.prop("selectionStart")
    // check for decimal
    if (input_val.indexOf(",") >= 0) {
      // get position of first decimal
      const decimal_pos = input_val.indexOf(",")
      // split number by decimal point
      let left_side = input_val.substring(0, decimal_pos)
      let right_side = input_val.substring(decimal_pos)
      // add commas to left side of number
      left_side = left_side.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      // validate right side
      right_side = right_side.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      // On blur make sure 2 numbers after decimal
      if (blur === "blur") {
        right_side += "00"
      }
      // Limit decimal to only 2 digits
      right_side = right_side.substring(0, 2)
      // join number by .
      input_val = left_side + "," + right_side
    } else {
      // no decimal entered
      // add commas to number
      // remove all non-digits
      input_val = input_val.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      // final formatting
      if (blur === "blur") {
        input_val += ",00"
      }
    }
    // send updated string to input
    input.val(input_val)
    // put caret back in the right position
    const updated_len = input_val.length
    caret_pos = updated_len - original_len + caret_pos
    input[0].setSelectionRange(caret_pos, caret_pos)
}