//Nuevo Listado Clientes
export const get_customers = tkn => {
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
                url: 'https://www.solucioneserp.net/listados/get_clienes_filtro',
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
    })
}

//Nuevo Listado Productos
export const get_products = tkn => {
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

//Lista Proveedores
export const get_suppliers = tkn => {
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

        // Variable cantidad de caracteres
        let cant_character_to_search = 0
        const configs_resp = resp
        const { estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre, configuracion } = configs_resp
        //console.log( estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre )

        const config_params = configuracion
        //const { codigo , valor } = [config_params]
        
        for ( const config_ele of config_params ) {
            // Desestructuracion del objeto element
            const { codigo, valor } = config_ele
            if ( codigo=='COMBOTIPOCLIENTES' ) {
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
                inputTooShort:function(){
                    return "Ingrese 3 caracteres o mas para buscar"
                }
            },
            placeholder: 'Buscar Proveedor',
            
            ajax:{
                delay: 500,
                url: 'https://www.solucioneserp.net/listados/proveedores/get_proveedores_filtro',
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
                        arr_t.push({ id: cuit, text: nombre + ' - ' + codigo + ' - ' + cuit })
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

        $(".cmb_proveedor").select2(combo_configs) //fin select
        //se usa para que al abrir el combo coloque el foco en el text
        //de busqueda
        $(".cmb_proveedor").on('select2:open', function () {
            //alert('test')
            $(".select2-search__field")[0].focus()
        })
    })
}

// Fecha 01-Mes y Dia actual
export const get_startMonth = () => {
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
}

// Fecha de inicio de ejercicio (API)
export const get_startPeriod = tkn => {
    const url_getStartPeriod = 'https://www.solucioneserp.net/listados/get_fecha_inicio_ejercicio'
    fetch( url_getStartPeriod, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ([resp]) => {
        // Start Period
        const { fecha } = resp
        const startDate = fecha.split('/').reverse().join('-')
        const periodStart = document.getElementById('periodStart')
        periodStart.value = startDate

        // End Period
        const today = new Date().toLocaleDateString('en-GB')
        const endDate = today.split('/').reverse().join('-')
        const periodEnd = document.getElementById('periodEnd')
        periodEnd.value = endDate
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado unidades de negocios
export const get_businessUnits = tkn => {
    const url_getBusinessUnits = 'https://www.solucioneserp.net/listados/get_unidades_negocio'
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
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado de estados deudores
export const get_status = tkn => {
    const url_getStatus = 'https://www.solucioneserp.net/listados/get_estados_deudores'
    fetch( url_getStatus, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const status = resp
        for (const element of status) {
            const { codigo, estado } = element
            // console.log( codigo, estado )

            const select = document.querySelector('#status')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", estado)
            option.value = codigo
            option.textContent = estado
            
            select.appendChild( option )
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado de monedas
export const get_coins = tkn => {
    const url_getCoins = 'https://www.solucioneserp.net/listados/get_monedas'
    fetch( url_getCoins, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const coins = resp
        for (const element of coins) {
            const { id, nombre, orden } = element  
            // console.log( id, nombre, orden ) 
            
            const select = document.querySelector('#coin')
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

// Listado de Sucursales
export const get_branchOffices = tkn => {
    const url_getbranchOffices = 'https://www.solucioneserp.net/listados/get_sucursales'
    fetch( url_getbranchOffices, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const subsidiaries = resp
        for (const element of subsidiaries) {
            const { id, nombre } = element  
            // console.log( id, nombre ) 
            
            const select = document.querySelector('#subsidiary')
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

// Listado de Cobrador
export const get_debtCollector = tkn => {
    const url_getDebtCollector = 'https://www.solucioneserp.net/listados/get_cobradores'
    fetch( url_getDebtCollector, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const debtCollector = resp
        for (const element of debtCollector) {
            const { id, nombre } = element  
            // console.log( id, nombre ) 
            
            const select = document.querySelector('#debt-collector')
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

// Listado de depositos
export const get_deposits = tkn => {
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
        const deposits = resp
        for (const element of deposits) {
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

// Listado tipo de comprobantes
export const get_voucherType = tkn => {
    const url_getVoucherType = 'https://www.solucioneserp.net/inventario/reportes/get_tipo_Comprobante'
    fetch( url_getVoucherType, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const voucherType = resp
        for (const element of voucherType) {
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

// Conseguir documentos de compra
export const get_purchaseDocuments = tkn => {
    const url_getPurchaseDocuments = 'https://www.solucioneserp.net/listados/get_doc_compras'
    fetch( url_getPurchaseDocuments, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const documents = resp
        for (const element of documents) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#voucher')
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

// Conseguir provincias
export const get_provinces = tkn => {
    const url_getProvinces = 'https://www.solucioneserp.net/listados/get_provincias'
    fetch( url_getProvinces, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const provinces = resp
        for (const element of provinces) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#provinces')
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

// Conseguir Origenes
export const get_origins = tkn => {
    const url_getOrigins = 'https://www.solucioneserp.net/listados/get_origenes'
    fetch( url_getOrigins, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const origins = resp
        for (const element of origins) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#origins')
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