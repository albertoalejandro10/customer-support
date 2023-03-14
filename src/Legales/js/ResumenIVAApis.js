import { getParameter } from '../../jsgen/Helper'
import { get_startMonth, get_businessUnits, get_branchOffices, get_provinces, get_origins } from '../../jsgen/Apis-Helper'

// Listado de Sucursales (Input 0 - 1024px)
const get_branchOfficesMinorScreen = tkn => {
    const url_getbranchOffices = process.env.Solu_externo + '/listados/get_sucursales'
    fetch( url_getbranchOffices, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const subsidiaries = resp
        for (const element of subsidiaries) {
            const { id, nombre } = element  
            // console.log( id, nombre ) 
            
            const select = document.querySelector('#subsidiary-minor')
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
    // Sucursal:
    get_branchOffices( tkn )
    get_branchOfficesMinorScreen( tkn )
    // Provincias:
    get_provinces( tkn )
    // Origenes
    // get_origins( tkn )
}