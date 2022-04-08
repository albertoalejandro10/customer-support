$.fn.selectpicker.Constructor.BootstrapVersion = '4';

// Listado unidades de negocios
const get_businessUnits = tkn => {
    const url_getBusinessUnits = 'https://www.solucioneserp.net/listados/get_unidades_negocio'
    fetch( url_getBusinessUnits, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const customers = resp
        for (const element of customers) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#business')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            
            select.appendChild( option )
    
            $('.selectpicker').selectpicker('refresh')
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado de monedas
const get_coins = tkn => {
    const url_getCoins = 'https://www.solucioneserp.net/listados/get_monedas'
    fetch( url_getCoins, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const coins = resp
        for (const element of coins) {
            const { id, nombre, orden } = element  
            // console.log( id, nombre, orden ) 
            
            const select = document.querySelector('#coins')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            
            select.appendChild( option )
    
            $('.selectpicker').selectpicker('refresh')
        }
    })
    .catch( err => {
        console.log( err )
    })
}

//Nuevo Listado Clientes
const get_customers = tkn => {
$(".cmb_clientes").select2({
    language: {
        noResults: function() {    
          return "No hay resultado";        
        },
        searching: function() {    
          return "Buscando..";
        },
        inputTooShort:function(){
          return "Ingrese 3 caracteres o mas para buscar";
        }
    },
    placeholder: 'Buscar Cliente',            
    minimumInputLength: 3,
    ajax:{        
        url: 'https://www.solucioneserp.net/listados/get_clienes_filtro',
        headers: {'Authorization' : 'Bearer ' + tkn},
        type: 'POST',
        dataType:'json',
        data: function (params) {
            var query = {
                filtro: params.term
            }

            return query;
        },
        processResults: function (data) {  
            var arr_t =[];          
            const customers = data
            for ( const element of customers ) {        
                // Desestructuracion del objeto element
                const { id, codigo, nombre } = element                
                arr_t.push({ id: codigo, text: nombre + ' - ' + codigo });
              }   

            return {                
              results: arr_t//data.items
            };
        }
    }
    
})
}

// Listado de clientes
// const get_customers = tkn => {
//     const url_customers = 'https://www.solucioneserp.net/listados/get_clientes'
//     fetch( url_customers , {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${tkn}`
//         }
//     })
//     .then( resp => resp.json() )
//     .then( resp => {
//         const coins = resp
//         for ( const element of coins ) {
//             const { codCliente, cuit, nombre, id } = element  
//             // console.log( codCliente, cuit, id )
            
//             const select = document.querySelector('#customers')
//             let option = document.createElement("option")
//             option.setAttribute("data-tokens", nombre)
//             option.value = codCliente
//             option.textContent = nombre
            
//             select.appendChild( option )
    
//             $('.selectpicker').selectpicker('refresh')
//         }
//     })
//     .catch( err => {
//         console.log( err )
//     })
// }

// Fecha de inicio de ejercicio
const get_startPeriod = tkn => {
    const url_getStartPeriod = 'https://www.solucioneserp.net/listados/get_fecha_inicio_ejercicio'
    fetch( url_getStartPeriod, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ([resp]) => {
        // Start Period
        const { fecha } = resp
        const startDate = fecha.split('/').reverse().join('-')
        const periodStart = document.getElementById('periodStart')
        periodStart.value = startDate
        // periodStart.disabled = true

        // End Period
        const today = new Date().toLocaleDateString('en-GB')
        const endDate = today.split('/').reverse().join('-')
        const periodEnd = document.getElementById('periodEnd')
        periodEnd.value = endDate
        // periodEnd.disabled = true
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado de estados
const get_states = tkn => {
    const url_getStates = 'https://www.solucioneserp.net/listados/get_estados_deudores'
    fetch( url_getStates, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const states = resp
        for (const element of states) {
            const { codigo, estado } = element
            // console.log( codigo, estado )

            const select = document.querySelector('#status')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", estado)
            option.value = codigo
            option.textContent = estado
            
            select.appendChild( option )
    
            $('.selectpicker').selectpicker('refresh')
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Conseguir parametros del URL
export const getParameter = parameterName => {
    const parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_businessUnits( tkn )
    get_coins( tkn )
    get_customers( tkn )
    get_startPeriod( tkn )
    get_states( tkn )
}