import { getParameter } from "../../jsgen/Helper"
import { get_businessUnits, get_startMonth } from "../../jsgen/Apis-Helper"
import { get_statusAccount, get_periodType, get_order, get_value } from "../../jsgen/Apis-Helper-BancaValores"

// Obtener el valor de la opcion seleccionada por el usuario
const selectDetValues = document.getElementById('det-value')
const selectType = document.getElementById('value')
selectType.addEventListener('change', event => {
    const value = Number(event.currentTarget.options[selectType.selectedIndex].value)
    while (selectDetValues.options.length > 0) {
        selectDetValues.remove(0)
    }
    get_detValues( tkn, value )
})

// Listado de tipos de periodo (Valores)
const get_detValues = ( tkn, value ) => {
    const url_getDetValues = 'https://www.solucioneserp.net/bancosyvalores/reportes/get_valores'
    fetch( url_getDetValues, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        let detValues = resp
        if ( value !== 0) detValues = detValues.filter( x => x.tipo === value)

        for (const element of detValues) {
            const { tipo, id, nombre } = element
            // console.log(tipo, id, nombre)
            const select = document.querySelector('#det-value')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            select.appendChild( option )
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    // Informacion del periodo desde-hasta
    get_startMonth( tkn )
    // U. de negocio:
    get_businessUnits( tkn )
    // Estado:
    get_statusAccount( tkn )
    // Periodo:
    get_periodType( tkn )
    // Order:
    get_order( tkn )
    // Value:
    get_value( tkn )
    // Det-Values:
    get_detValues( tkn, 0 )
}