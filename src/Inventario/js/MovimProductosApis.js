import { getParameter } from "../../jsgen/Helper"

// Listado depositos
const get_deposits = tkn => {
    const url_getDeposits = 'https://www.solucioneserp.net/listados/get_depositos'
    fetch( url_getDeposits, {
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

            const select = document.querySelector('#deposit')
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

// Listado Tipo comprabantes
const get_voucherType = tkn => {
    const url_getVoucherType = 'https://www.solucioneserp.net/listados/get_depositos'
    fetch( url_getVoucherType, {
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

            const select = document.querySelector('#voucher-type')
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
let cant_character_to_search = 0
//Nuevo Listado Productos
const get_products = tkn => {
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
                inputTooShort:function() {
                    return "Ingrese 3 caracteres o mas para buscar"
                }
            },
            placeholder: 'Buscar producto',            
            ajax: {
                delay: 500,
                url: 'https://www.solucioneserp.net/listados/get_productos_filtro',
                headers: {'Authorization' : 'Bearer ' + tkn},
                type: 'POST',
                dataType:'json',
                data: function (params) {
                    if ( params.term == null ) {
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
                        const { id, codigo, detalle, unidad, lineaId, iva, activo } = element
                        arr_t.push({ id: codigo, text: detalle + ' - ' + codigo + ' - ' + unidad })
                    }

                    return {
                        //data.items
                        results: arr_t
                    }
                }
            }
        }

        if ( cant_character_to_search > 0 ){  
            combo_configs.minimumInputLength = cant_character_to_search
        }

        //fin select
        $(".cmb_productos").select2(combo_configs)
        // Se usa para que al abrir el combo coloque el foco en el text de busqueda
        $(".cmb_productos").on('select2:open', function (e) {
            //alert('test')
            $(".select2-search__field")[0].focus()
        })
    })
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_deposits( tkn )
    get_voucherType( tkn )
    get_products( tkn )
}

const today = new Date().toLocaleDateString('en-GB')
const monthYear = today.slice(2)
const todayDefault = '01' + monthYear
const startDate = todayDefault.split('/').reverse().join('-')
const periodStart = document.getElementById('periodStart')
periodStart.value = startDate

// End Period
const endDate = today.split('/').reverse().join('-')
const periodEnd = document.getElementById('periodEnd')
periodEnd.value = endDate