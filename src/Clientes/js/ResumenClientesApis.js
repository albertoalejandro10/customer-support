import { getParameter } from "../../jsgen/Helper"
import { get_coins, get_startMonth, get_branchOffices, get_debtCollector } from "../../jsgen/Apis-Helper"

const get_customers = tkn => {
    //get config para el combo de clientes
    const url_config_cli = process.env.Solu_externo + '/session/login_sid'
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
        
        // Variable cantidad de caracteres
        let cant_character_to_search = 0

        const config_params = configuracion
        //const { codigo , valor } = [config_params]
        
        for ( const config_ele of config_params ) {        
            // Desestructuracion del objeto element
            const { codigo, valor } = config_ele   
            if( codigo == 'COMBOTIPOCLIENTES' ) {
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
                inputTooShort: function() {
                    return "Ingrese 3 caracteres o mas para buscar"
                }
            },
            placeholder: 'Buscar Cliente',
            ajax: {
                delay: 500,
                url: process.env.Solu_externo + '/listados/get_clienes_filtro',
                headers: {'Authorization' : 'Bearer ' + tkn},
                type: 'POST',
                dataType:'json',
                data: function (params) {
                    if (params.term == null){
                        return JSON.stringify('{filtro:""}')
                    } else {
                        return {filtro: params.term}
                    }
                },
                processResults: function (data) {
                    let arr_t = []          
                    const customers = data
                    for ( const element of customers ) {
                        // Desestructuracion del objeto element
                        const { id, codigo, nombre, cuit } = element
                        arr_t.push({ id: codigo, text: nombre + ' - ' + codigo + ' - ' + cuit })
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

        //fin select
        $(".cmb_clientes").select2(combo_configs)

        //se usa para que al abrir el combo coloque el foco en el text de busqueda
        $(".cmb_clientes").on('select2:open', function (e) {
            //alert('test')
            $(".select2-search__field")[0].focus()
        })

        if ( name && clientCode && cuit && tkn ) {
            // create the option and append to Select2
            name = `${name} - ${clientCode} - ${cuit}`
            const option = new Option(name, clientCode, cuit, true, true)
            $('.cmb_clientes').append(option).trigger('change')
        }
    })
}

// Listado unidades de negocios
const get_businessUnits = tkn => {
    const url_getBusinessUnits = process.env.Solu_externo + '/listados/get_unidades_negocio'
    fetch( url_getBusinessUnits, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const business = resp
        for (const element of business) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#business')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            
            select.appendChild( option )

            if ( unidadNegocio ) {
                select.value = unidadNegocio
            }
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado de estados deudores
const get_status = tkn => {
    const url_getStatus = process.env.Solu_externo + '/listados/get_estados_deudores'
    fetch( url_getStatus, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        resp.unshift({
            codigo: '0',
            estado: 'Todos'
        })
        const status = resp
        for (const element of status) {
            const { codigo, estado } = element
            const select = document.querySelector('#status')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", estado)
            option.value = codigo
            option.textContent = estado
            
            select.appendChild( option )

            if ( estadoURL ) {
                select.value = estadoURL
            }
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Ejecutar
const tkn = getParameter('tkn')
let name = getParameter('nombre')
const clientCode = getParameter('codigoCliente')
const cuit = getParameter('cuit')
const unidadNegocio = getParameter('unidadNegocio')
const estadoURL = getParameter('estado')

if ( tkn ) {
    // Informacion del periodo desde-hasta
    get_startMonth( tkn )
    // Rellenar select2-Clientes
    get_customers( tkn )
    // U. de negocio:
    get_businessUnits( tkn )
    // Estado:
    get_status( tkn )
    // Moneda:
    get_coins( tkn )
    // Cobrador:
    get_debtCollector( tkn )
    // Sucursal:
    get_branchOffices( tkn )
}