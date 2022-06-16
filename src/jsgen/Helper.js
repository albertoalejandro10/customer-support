// Conseguir parametros del URL
export const getParameter = parameterName => {
    const parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}

// Fecha de inicio de ejercicio
export const get_StartPeriod = tkn => {
    const url_getStartPeriod = 'https://www.solucioneserp.net/session/login_sid'
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

// Formatear Numero 1,000.00
export const format_number = importeNeto => {
    const  style = {
        minimumFractionDigits: 2,
        useGrouping: true
    }
    const formatter = new Intl.NumberFormat("de-DE", style)
    const importe = formatter.format(importeNeto)
    return importe
}

export const format_token = all_link => {
    // console.log( 'Enlace sin formatear:', all_link )
    if ( all_link === undefined ) return all_link
    if ( all_link.includes('&tkn=tokenext') ) {
        // console.log('Yes, we have it')
        const token = getParameter('tkn')
        const new_link = all_link.replace('tokenext', token)
        // console.log( 'Enlace formateado:', new_link )
        return new_link
    }
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
    //Caracteres validos
    const filtro = '1234567890'
	
    //Recorrer el texto y verificar si el caracter se encuentra en la lista de validos 
    for (let i = 0; i < string.length; i++) {
        if ( filtro.indexOf(string.charAt(i)) != -1 ) {
            //Se añaden a la salida los caracteres validos
            out += string.charAt(i)
        }
    }
    //Retornar valor filtrado
    return out
}