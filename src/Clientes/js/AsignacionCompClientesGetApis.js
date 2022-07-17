import { getParameter } from "../../jsgen/Helper"
import { get_accounts, get_businessUnits, get_startPeriod } from "../../jsgen/Apis-Helper"

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
        //variable cantidad de caracteres
        let cant_character_to_search = 0

        const configs_resp = resp
        const { estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre, configuracion } = configs_resp
        //console.log( estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre )

        const config_params = configuracion
        //const { codigo , valor } = [config_params]
        
        for ( const config_ele of config_params ) {
            // Desestructuracion del objeto element
            const { codigo, valor } = config_ele
            if ( codigo == 'COMBOTIPOCLIENTES' ) {
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
                url: 'https://www.solucioneserp.net/listados/get_clienes_filtro',
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

        $(".cmb_clientes").select2(combo_configs) //fin select

        //se usa para que al abrir el combo coloque el foco en el text de busqueda
        $(".cmb_clientes").on('select2:open', function (e) {
            //alert('test');
            $(".select2-search__field")[0].focus()
        })
    })
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_accounts( tkn )
    get_customers( tkn )
    get_businessUnits( tkn )
    get_startPeriod( tkn )
}