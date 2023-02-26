import { getParameter } from "../../jsgen/Helper"
// Nuevo Listado Clientes
export const get_customers = tkn => {
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
                    if (params.term == null) {
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
                        arr_t.push({ id: id, name: nombre, text: nombre + ' - ' + codigo })
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

        if ( id && name && tkn ) {
            // create the option and append to Select2
            const option = new Option(name, id, true, true)
            $('.cmb_clientes').append(option).trigger('change')
        }
    })
}

// Ejecutar
const id = getParameter('id')
const name = getParameter('name')
const tkn = getParameter('tkn')
if ( tkn ) {
    get_customers( tkn )
}