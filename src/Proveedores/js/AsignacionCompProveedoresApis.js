import { getParameter } from "../../jsgen/Helper"
import { get_startPeriod } from "../../jsgen/Apis-Helper"

const get_suppliers = tkn => {
    const combo_configs = {
        allowClear: true,
        minimumInputLength: 3,
        language: {
            noResults: () => "No hay resultado",
            searching: () => "Buscando..",
            inputTooShort: () => "Ingrese 3 caracteres o mas para buscar"
        },
        placeholder: 'Buscar proveedor',
        ajax: {
            delay: 500,
            url: process.env.Solu_externo + '/proveedores/formularios/asignacion_comprobantes/get_proveedores_pendientes',
            headers: {'Authorization' : 'Bearer ' + tkn},
            type: 'GET',
            dataType: 'json',
            data: (params) => ({ search: params.term || '', type: 'public' }),
            processResults: ({proveedores: suppliers}, params) => {
                const searchTerm = params.term && params.term.toLowerCase()
                const results = suppliers.map(({ codcliente, cuit, nombre }) => ({
                    id: cuit,
                    text: `${nombre} - ${codcliente} - ${cuit}`
                })).filter(result => searchTerm ? result.text.toLowerCase().includes(searchTerm) : true)

                return {results}
            }
        }
    }

    $("#supplier").select2(combo_configs)
        .on('select2:open', () => $(".select2-search__field")[0].focus())
        .on("select2-clearing", () => { $(this).val(null).trigger("change") })
}

// Listado unidades de negocios
const get_businessUnits = tkn => {
    const url_getBusinessUnits = process.env.Solu_externo + '/proveedores/formularios/asignacion_comprobantes/get_unidades_negocio '
    fetch( url_getBusinessUnits, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( businessUnits => businessUnits.json())
    .then( ({unidadesDeNegocio: business}) => {
        for (const element of business) {
            const { id, nombre, integra, ptovtaDEF, calc_reten } = element
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

// Listado unidades de negocios
const get_accounts = tkn => {
    const url_getAccounts = process.env.Solu_externo + '/proveedores/formularios/asignacion_comprobantes/get_cuentas'
    fetch( url_getAccounts, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            "tipo": "CP"
        })
    })
    .then( accounts => accounts.json())
    .then( ({cuentas: accounts}) => {
        for (const account of accounts) {
            const { codigo, nombre } = account
            // console.log(id, nombre)
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

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_accounts( tkn )
    get_suppliers( tkn )
    get_businessUnits( tkn )
    get_startPeriod( tkn )
}