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
            
            const select = document.querySelector('#coins')
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

//variable cantidad de caracteres
let cant_character_to_search=0;

//Nuevo Listado Clientes
const get_customers = tkn => {
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
            if(codigo=='COMBOTIPOCLIENTES' )
            {
                cant_character_to_search=valor;
            }
        }   

        let combo_configs={
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
            
            ajax:{        
                delay: 500,
                url: 'https://www.solucioneserp.net/listados/get_clienes_filtro',
                headers: {'Authorization' : 'Bearer ' + tkn},
                type: 'POST',
                dataType:'json',        
                data: function (params) {            
                    if (params.term == null){                
                        return JSON.stringify('{filtro:""}');
                    }
                    else
                    {
                        return {filtro: params.term};
                    }
                },
                processResults: function (data) {  
                    var arr_t =[];          
                    const customers = data
                    for ( const element of customers ) {        
                        // Desestructuracion del objeto element
                        const { id, codigo, nombre, cuit } = element                
                        arr_t.push({ id: codigo, text: nombre + ' - ' + codigo + ' - ' + cuit });
                    }   

                    return {                
                    results: arr_t//data.items
                    };
                }
            }    
            };

        if (cant_character_to_search>0){  
            combo_configs.minimumInputLength= cant_character_to_search;
        }

        $(".cmb_clientes").select2(combo_configs) //fin select
        //se usa para que al abrir el combo coloque el foco en el text
        //de busqueda
        $(".cmb_clientes").on('select2:open', function (e) {
            //alert('test');
            $(".select2-search__field")[0].focus();
          });
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
    get_customers( tkn )
    get_startPeriod( tkn )
    get_states( tkn )
}