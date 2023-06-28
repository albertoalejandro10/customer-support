import { getParameter } from "../../jsgen/Helper"
import { get_businessUnits, get_coins, get_startMonth, get_costCenter } from "../../jsgen/Apis-Helper"

const get_accountsPlan = tkn => {
    const combo_configs = {
        allowClear: true,
        minimumInputLength: 3,
        language: {
            noResults: () => "No hay resultado",
            searching: () => "Buscando..",
            inputTooShort: () => "Ingrese 3 caracteres o más para buscar"
        },
        placeholder: 'Buscar cuenta',
        ajax: {
            delay: 500,
            url: process.env.Solu_externo + '/listados/get_plan_cuenta',
            headers: {'Authorization' : 'Bearer ' + tkn},
            type: 'POST',
            dataType: 'json',
            body: JSON.stringify({
                "tipo": 1,
                "alfa": 1,
                "todos": 1
            }),
            data: (params) => ({ search: params.term || '', type: 'public' }),
            processResults: (accounts, params) => {
                const searchTerm = params.term && params.term.toLowerCase()
                const results = accounts.map(({ codigo, nombre }) => ({
                    id: codigo,
                    text: nombre
                })).filter(result => searchTerm ? result.text.toLowerCase().includes(searchTerm) : true)
                results.unshift({ id: 'TODAS_ID', text: 'TODAS' })
                return {results}
            },
            templateResult: (result) => {
                if (result.id === 'TODAS_ID') {
                    return $('<span style="font-weight:bold;">TODAS</span>')
                }
                return result.text
            }
        }
    }

    $("#account").select2(combo_configs)
        .on('select2:open', () => $(".select2-search__field")[0].focus())
        .on("select2-clearing", () => { $(this).val(null).trigger("change") })
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
    get_accountsPlan(tkn)
}