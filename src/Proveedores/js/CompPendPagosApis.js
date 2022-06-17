import { getParameter } from "../../jsgen/Helper"

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
            
            const select = document.querySelector('#coin')
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

// Variable cantidad de caracteres
let cant_character_to_search = 0
//Lista Proveedores
const get_suppliers = tkn => {
    //get config para el combo de clientes
    const url_config_cli = 'https://www.solucioneserp.net/session/login_sid'
    fetch( url_config_cli , {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const configs_resp = resp
        const { estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre, configuracion } = configs_resp
        //console.log( estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre )

        const config_params = configuracion
        //const { codigo , valor } = [config_params]
        
        for ( const config_ele of config_params ) {
            // Desestructuracion del objeto element
            const { codigo, valor } = config_ele
            if ( codigo=='COMBOTIPOCLIENTES' ) {
                cant_character_to_search = valor
            }
        }

        let combo_configs = {
            language: {
                noResults: function() {
                    return "No hay resultado"
                },
                searching: function() {
                    return "Buscando.."
                },
                inputTooShort:function(){
                    return "Ingrese 3 caracteres o mas para buscar"
                }
            },
            placeholder: 'Buscar Proveedor',
            
            ajax:{
                delay: 500,
                url: 'https://www.solucioneserp.net/listados/proveedores/get_proveedores_filtro',
                headers: {'Authorization' : 'Bearer ' + tkn},
                type: 'POST',
                dataType:'json',
                data: function (params) {
                    if ( params.term == null ) {
                        return JSON.stringify('{filtro: "", soloProveedores: 0, opcionTodos: 0}')
                    } else {
                        return {filtro: params.term}
                    }
                },
                processResults: function (data) {
                    let arr_t = []
                    const suppliers = data
                    for ( const element of suppliers ) {
                        // Desestructuracion del objeto element
                        const { id, codigo, nombre, cuit } = element
                        arr_t.push({ id: cuit, text: nombre + ' - ' + codigo + ' - ' + cuit })
                    }
                    return {
                        //data.items
                        results: arr_t
                    }
                }
            }    
        }

        if ( cant_character_to_search > 0 ) {
            combo_configs.minimumInputLength = cant_character_to_search
        }

        $(".cmb_proveedor").select2(combo_configs) //fin select
        //se usa para que al abrir el combo coloque el foco en el text
        //de busqueda
        $(".cmb_proveedor").on('select2:open', function () {
            //alert('test')
            $(".select2-search__field")[0].focus()
        })
    })
}

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
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_businessUnits( tkn )
    get_coins( tkn )
    get_suppliers( tkn )
    get_startPeriod( tkn )
    get_states( tkn )
}