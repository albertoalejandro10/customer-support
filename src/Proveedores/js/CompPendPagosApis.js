import { getParameter } from "../../jsgen/Helper"
import { get_startPeriod, get_coins } from "../../jsgen/Apis-Helper"

// Lista Proveedores
const get_suppliers = tkn => {
    // Variable cantidad de caracteres
    let cant_character_to_search = 0
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
            placeholder: 'Buscar Proveedor',
            ajax:{
                delay: 500,
                url: process.env.Solu_externo + '/listados/proveedores/get_proveedores_filtro',
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
                        arr_t.push({ id: codigo, text: nombre + ' - ' + codigo + ' - ' + cuit })
                    }
                    const optionDefault = {id: 0, text: 'Todos'}
                    arr_t.unshift(optionDefault)
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
        $(".cmb_proveedor").select2(combo_configs)
        // Se usa para que al abrir el combo coloque el foco en el text de busqueda
        $(".cmb_proveedor").on('select2:open', function () {
            //alert('test')
            $(".select2-search__field")[0].focus()
        })
        
        if ( name && codigoProveedor && tkn ) {
            // create the option and append to Select2
            name = `${name} - ${codigoProveedor}`
            const option = new Option(name, codigoProveedor, true, true)
            $('.cmb_proveedor').append(option).trigger('change')
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
    .then( business => business.json() )
    .then( business => {
        for (const element of business) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#business')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            
            select.appendChild( option )

            if ( unidadNegocioId ) {
                select.value = unidadNegocioId
            }
        }
    })
    .catch( err => {
        console.log( err )
    })
}

const get_accountsPayableBalance = tkn => {
    const url_getAccountsPayable = process.env.Solu_externo + '/listados/get_cuentasxpagar'
    fetch( url_getAccountsPayable, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( accounts => accounts.json() )
    .then( accounts => {
        for (const account of accounts) {
            let { codigo, nombre } = account
            if ( codigo === '' ) codigo = "0"
            // console.log(codigo, nombre)
            const select = document.querySelector('#status-payable')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = codigo
            option.textContent = nombre
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
const codigoProveedor = getParameter('codProveedor')
const unidadNegocioId = getParameter('unidadNegocio')
const estadoURL = getParameter('estado')

if ( tkn ) {
    get_businessUnits( tkn )
    get_coins( tkn )
    get_suppliers( tkn )
    get_startPeriod( tkn )
    get_accountsPayableBalance( tkn )
}