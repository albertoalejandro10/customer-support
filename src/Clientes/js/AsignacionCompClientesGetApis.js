import { getParameter } from "../../jsgen/Helper"

// Listado de cuentas por cobrar
const get_Accounts = tkn => {
    const url_getAccounts = 'https://www.solucioneserp.net/listados/get_cuentasxcobrar'
    fetch( url_getAccounts, {
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
            const { codigo, nombre } = element
            // console.log(codigo, nombre)

            const select = document.querySelector('#account')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = codigo
            option.textContent = nombre
            
            select.appendChild( option )
        }
    })
    .catch( err => {
        console.log( err )
    })
}

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

//variable cantidad de caracteres
let cant_character_to_search=0;

//Nuevo Listado Clientes
const get_Customers = tkn => {
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


// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_Accounts( tkn )
    get_Customers( tkn )
    get_businessUnits( tkn )
    get_startPeriod( tkn )
}