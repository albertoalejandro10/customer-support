import { getParameter, format_number } from "../../jsgen/getParameters"

// Tipo de Generacion
const get_type_generation = tkn => {
    const url_getTypeGeneration = 'https://www.solucioneserp.net/maestros/generacion_lotes/get_tipo_generacion'
    fetch( url_getTypeGeneration, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const typeGeneration = resp
        for (const element of typeGeneration) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#group-client')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            
            select.appendChild( option )

            const selectDefault = 2
            if ( id === selectDefault ) {
                select.value = 2
            }
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado grupos clientes
const get_groupCustomers = tkn => {
    const url_getGroupsCustomers = 'https://www.solucioneserp.net/listados/get_grupos_clientes'
    fetch( url_getGroupsCustomers, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const groupCustomers = resp
        for (const element of groupCustomers) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#generated-for')
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

//Nuevo Listado Clientes
const get_customers = tkn => {
    $("#client-code").select2({
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
        placeholder: 'Buscar código cliente',         
        minimumInputLength: 3,
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
                    const { id, codigo, nombre } = element                
                    arr_t.push({ id: codigo, text: nombre + ' - ' + codigo });
                }   

                return {                
                results: arr_t//data.items
                };
            }
        }
        
    })
}

// Listado tipos de clientes
const get_customerTypes = tkn => {
    const url_getCustomerTypes = 'https://www.solucioneserp.net/listados/get_tipos_clientes'
    fetch( url_getCustomerTypes, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const  customerTypes = resp
        for (const element of customerTypes) {
            const { id, detalle } = element
            // console.log(id, detalle)

            const select = document.querySelector('#customer-type')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", detalle)
            option.value = id
            option.textContent = detalle
            
            select.appendChild( option )

            const selectDefault = 1
            if ( id === selectDefault ) {
                select.value = selectDefault
            }
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado tipos de comprobantes
const get_VoucherTypes = tkn => {
    const url_getVoucherTypes = 'https://www.solucioneserp.net/maestros/generacion_lotes/get_tipo_comprobante'
    fetch( url_getVoucherTypes, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const  voucherTypes = resp
        for (const element of voucherTypes) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#voucher-type')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            
            select.appendChild( option )

            const selectDefault = 2
            if ( id === selectDefault ) {
                select.value = 2
            }
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado de cargos por reconexion
const get_ReconnectionCharges = tkn => {
    const url_getReconnectionCharges = 'https://www.solucioneserp.net/maestros/generacion_lotes/get_tipo_cargo_reconexion'
    fetch( url_getReconnectionCharges, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const  reconnectionCharges = resp
        for (const element of reconnectionCharges) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#reconection-charges')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            
            select.appendChild( option )

            const selectDefault = 2
            if ( id === selectDefault ) {
                select.value = selectDefault
            }
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado de tipos de cargo por reconexion
const get_ChargesType = tkn => {
    const url_getChargesType = 'https://www.solucioneserp.net/maestros/generacion_lotes/get_tipo_cargo_reconexion'
    fetch( url_getChargesType, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const  chargesType = resp
        for (const element of chargesType) {
            const { id, nombre } = element
            // console.log(id, nombre)
            
            const select = document.querySelector('#calculate-charges')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            
            select.appendChild( option )

            const selectDefault = 2
            if ( id === selectDefault ) {
                select.value = selectDefault
            }
        }

    })
    .catch( err => {
        console.log( err )
    })
}

// Listado de tipos de cargo por reconexion
const get_lastSettlement = tkn => {
    const url_getLastSettlement = 'https://www.solucioneserp.net/maestros/generacion_lotes/get_ultima_liquidacion_cupones'
    fetch( url_getLastSettlement, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ({ liquidacion, recargo, comprobantes, reconexion }) => {
        // console.log( liquidacion, recargo, comprobantes, reconexion )

        console.log(comprobantes)
        const numberElement = document.getElementById('numero')
        numberElement.value = liquidacion.numero

        const reconectionChargesTextElement = document.getElementById('reconection-charges-text')
        reconectionChargesTextElement.innerText = `${recargo.detalle} ${format_number(recargo.precio)}`

        const calculateChargesTextElement = document.getElementById('calculate-charges-text')
        calculateChargesTextElement.innerText = `${reconexion.detalle} ${format_number(reconexion.precio)}`

        if ( liquidacion.confirmada === -1 ) return
        if ( liquidacion.confirmada === 0 ) {
            const generate = document.getElementById('generate')
            const regenerate = document.getElementById('regenerate')
            const confirm = document.getElementById('confirm')

            generate.classList.add('d-none')
            regenerate.classList.remove('d-none')
            confirm.classList.remove('d-none')

            const cantReceipts = document.getElementById('number-receipts')
            const totalReceipts = document.getElementById('total-receipts')
            cantReceipts.innerText = liquidacion.cantComprobantes
            totalReceipts.innerText = `$${liquidacion.totalComprobantes}`
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_type_generation( tkn )
    get_groupCustomers( tkn )
    get_customers( tkn )
    get_customerTypes( tkn )
    get_VoucherTypes( tkn )
    get_ReconnectionCharges( tkn )
    get_ChargesType( tkn )
    get_lastSettlement( tkn )
}

const today = new Date().toLocaleDateString('en-GB')
const date = today.split('/').reverse().join('-')
const expiration = document.getElementById('expiration')
expiration.value = date