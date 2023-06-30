import { getParameter } from "../../jsgen/Helper"
import { get_businessUnits, get_coins, get_startMonth, get_costCenter } from "../../jsgen/Apis-Helper"

// Listado de cuentas
const get_accountsPlan = async (tkn) => {
    const url_getAccountPlan = process.env.Solu_externo + '/listados/get_plan_cuenta'
    try {
        const response = await fetch(url_getAccountPlan, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tkn}`
            },
            body: JSON.stringify({
                "tipo": 1,
                "alfa": 1,
                "todos": 1
            })
        })
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`)
        }
        const accounts = await response.json()
        return accounts
    } catch (error) {
        console.error(`Could not get accounts: ${error}`)
    }
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
    get_costCenter( tkn );
    // Listado de cuentas
    (async function() {
        try {
            const accounts = await get_accountsPlan(tkn)
            accounts[0].codigo = 'TODAS_ID'
            let data = accounts.map(({ codigo, nombre }) => ({
                id: codigo,
                text: nombre
            }))
    
            const combo_configs = {
                allowClear: true,
                minimumInputLength: 3,
                language: {
                    noResults: () => {
                        // Eliminamos la opción vacía
                        data = data.filter(item => item.id !== '');
    
                        // Actualizamos los datos del select2
                        $("#account").empty().select2({
                            data: data,
                            placeholder: 'Buscar cuenta',
                            allowClear: true
                        });
    
                        return 'No se encontraron resultados';
                    },
                    searching: () => "Buscando..",
                    inputTooShort: () => "Ingrese 3 caracteres o más para buscar"
                },
                placeholder: 'Buscar cuenta',
                data: data,
            }
    
            // Agregamos la opción vacía y inicializamos el select2
            data.unshift({
                id: '',
                text: ''
            });
            $("#account").select2(combo_configs)
                .on('select2:open', () => $(".select2-search__field")[0].focus())
                .on("select2-clearing", () => { $(this).val(null).trigger("change") })
        } catch (error) {
            console.error(`Could not update account select: ${error}`)
        }
    })()
}