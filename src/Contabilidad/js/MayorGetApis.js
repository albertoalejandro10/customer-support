import { getParameter } from "../../jsgen/Helper"
import { get_businessUnits, get_coins, get_startMonth, get_costCenter } from "../../jsgen/Apis-Helper"

const get_AccountPlan = tkn => {
    // Variable cantidad de caracteres
    let cant_character_to_search = 3
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
        placeholder: 'Buscar cuenta',
        ajax: {
            delay: 500,
            url: 'https://www.solucioneserp.net/listados/get_plan_cuenta',
            headers: {'Authorization' : 'Bearer ' + tkn},
            type: 'POST',
            dataType:'json',
            body: JSON.stringify({
                "tipo": 1,
                "alfa": 1,
                "todos": 1
            }),
            data: function (params) {
                if (params.term == null){
                    return JSON.stringify('{filtro:""}')
                } else {
                    return {filtro: params.term}
                }
            },
            processResults: function (accounts) {
                console.log(accounts)
                const arr_t = []
                for ( const account of accounts ) {
                    // Desestructuracion del objeto account
                    const { codigo, nombre } = account
                    arr_t.push({ id: codigo, text: nombre + ' - ' + codigo})
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

    $("#account").select2(combo_configs)

    $("#account").on('select2:open', function (e) {
        $(".select2-search__field")[0].focus()
    })
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    // Informacion del periodo desde-hasta
    get_startMonth( tkn )
    // U. de negocio:
    get_businessUnits( tkn )
    // Moneda:
    get_coins( tkn )
    // Analisis de cuenta
    get_costCenter( tkn )
    // Listado de cuentas
    get_AccountPlan(tkn)
}