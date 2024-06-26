// Permitir Async/Await en el proyecto
import 'regenerator-runtime/runtime'

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

// Nuevo Listado Productos
export const get_products = tkn => {
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
                url: process.env.Solu_externo + '/listados/get_productos_filtro',
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

// Lista Proveedores
export const get_suppliers = tkn => {
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
                inputTooShort:function(){
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
    const url_getStartPeriod = process.env.Solu_externo + '/listados/get_fecha_inicio_ejercicio'
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
    const url_getBusinessUnits = process.env.Solu_externo + '/listados/get_unidades_negocio'
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

// Listado unidades de negocios sin todos
export const get_businessUnitsWithoutAll = tkn => {
    const url_getBusinessUnits = process.env.Solu_externo + '/listados/get_unidades_negocio'
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
            if ( id === 0 ) continue

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
    const url_getStatus = process.env.Solu_externo + '/listados/get_estados_deudores'
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
    const url_getCoins = process.env.Solu_externo + '/listados/get_monedas'
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
        console.log( 'Error coin:', err )
    })
}

// Listado de Sucursales
export const get_branchOffices = tkn => {
    const url_getbranchOffices = process.env.Solu_externo + '/listados/get_sucursales'
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
    const url_getDebtCollector = process.env.Solu_externo + '/listados/get_cobradores'
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
    const url_getDeposits = process.env.Solu_externo + '/listados/get_depositos'
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
    const url_getVoucherType = process.env.Solu_externo + '/inventario/reportes/get_tipo_Comprobante'
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
    const url_getPurchaseDocuments = process.env.Solu_externo + '/listados/get_doc_compras'
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
    const url_getProvinces = process.env.Solu_externo + '/listados/get_provincias'
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
    const url_getOrigins = process.env.Solu_externo + '/listados/get_origenes'
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

// Listado tipos clientes todos
export const get_allCustomersType = tkn => {
    const url_getAllCustomersType = process.env.Solu_externo + '/listados/get_tipos_clientes_todos'
    fetch( url_getAllCustomersType, {
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
            const { id, detalle } = element
            // console.log(id, detalle)

            const select = document.querySelector('#customer-type')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", detalle)
            option.value = id
            option.textContent = detalle
            
            select.appendChild( option )
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// Listado grupos clientes
export const get_customersGroups = tkn => {
    const url_getCustomersGroup = process.env.Solu_externo + '/listados/get_grupos_clientes'
    fetch( url_getCustomersGroup, {
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
            const { id, nombre, tipo } = element
            // console.log(id, nombre, tipo)

            const select = document.querySelector('#customer-groups')
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

/*
    * listados/proveedores/get_proveedores_filtro (Aumentogrupo)
*/
// Listado rubros
export const get_rubros = tkn => {
    const url_getRubros = process.env.Solu_externo + '/listados/productos/get_rubros'
    fetch( url_getRubros, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const rubros = resp
        for (const element of rubros) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#entry')
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

// Listado linea venta
export const get_salesLine = tkn => {
    const url_getSalesLine = process.env.Solu_externo + '/listados/productos/get_lineas'
    fetch( url_getSalesLine, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const salesLine = resp
        for (const element of salesLine) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#sale-line')
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

// Listado de cuentas por cobrar
export const get_accounts = tkn => {
    const url_getAccounts = process.env.Solu_externo + '/listados/get_cuentasxcobrar'
    fetch( url_getAccounts, {
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
            const { codigo, nombre } = element
            // console.log(codigo, nombre)

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

// Listado Análisis de cuenta (Mayor de cuentas)
export const get_costCenter = tkn => {
    const url_getCostCenter = process.env.Solu_externo + '/listados/get_centrocostos'
    fetch( url_getCostCenter, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( costCenters => costCenters.json() )
    .then( costCenters => {
        for (const costCenter of costCenters) {
            const { id, codigo, nombre } = costCenter
            // console.log(id, codigo, nombre)
            const select = document.querySelector('#cost-center')
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

/*
    *ventas/get_tipos_documento (Utilidades Page)
*/
export const get_docsTypes = tkn => {
    const url_getDocsTypes = process.env.Solu_externo + '/listados/ventas/get_tipos_documento'
    fetch( url_getDocsTypes, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( docsTypes => docsTypes.json() )
    .then( docsTypes => {
        for (const docsType of docsTypes) {
            const { id, nombre } = docsType
            // console.log(id, nombre)
            const select = document.querySelector('#documents')
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

/*
    *listado/get_tipos_asiento (VentasaContabilizar)
*/
export const get_seatType = tkn => {
    const url_getSeatType = process.env.Solu_externo + '/listados/get_tipos_asiento'
    fetch( url_getSeatType, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( seatTypes => seatTypes.json() )
    .then( seatTypes => {
        for (const seatType of seatTypes) {
            const { id, codigo, nombre } = seatType
            // console.log(id, codigo, nombre)
            const select = document.querySelector('#seat-type')
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

/*
    *listado/get_tipos_asiento (VentasaContabilizar) sin todos
*/
export const get_seatTypeWithoutAll = tkn => {
    const url_getSeatType = process.env.Solu_externo + '/listados/get_tipos_asiento'
    fetch( url_getSeatType, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( seatTypes => seatTypes.json() )
    .then( seatTypes => {
        for (const seatType of seatTypes) {
            const { id, codigo, nombre } = seatType
            if ( id === 0 ) continue
            // console.log(id, codigo, nombre)
            const select = document.querySelector('#seat-type')
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

/*
    * inventario/precios_por_grupo/get_campos_list (Aumentogrupo)
*/
export const get_fieldList = tkn => {
    const url_getFieldList = process.env.Solu_externo + '/inventario/precios_por_grupo/get_campos_list'
    fetch( url_getFieldList, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( fieldLists => fieldLists.json() )
    .then( fieldLists => {
        for (const fieldList of fieldLists) {
            const { id, nombre } = fieldList
            // console.log(id, nombre)
            const select = document.querySelector('#field')
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

/*
    * listados/productos/get_listas (Aumentogrupo)
*/
export const get_lists = tkn => {
    const url_getLists = process.env.Solu_externo + '/listados/productos/get_listas'
    fetch( url_getLists, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( lists => lists.json() )
    .then( lists => {
        for (const list of lists) {
            const { id, nombre } = list
            // console.log(id, nombre)
            const select = document.querySelector('#list')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            select.appendChild( option )

            const selectOrigin = document.querySelector('#origin-list')
            let optionOrigin = document.createElement("option")
            optionOrigin.setAttribute("data-tokens", nombre)
            optionOrigin.value = id
            optionOrigin.textContent = nombre
            selectOrigin.appendChild( optionOrigin )
        }
    })
    .catch( err => {
        console.log( err )
    })
}

/*
    * inventario/precios_por_grupo/get_operacion_list (Aumentogrupo)
*/
export const get_operations = tkn => {
    const url_getOperations = process.env.Solu_externo + '/inventario/precios_por_grupo/get_operacion_list'
    fetch( url_getOperations, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( operations => operations.json() )
    .then( operations => {
        for (const operation of operations) {
            const { id, nombre } = operation
            // console.log(id, nombre)
            const select = document.querySelector('#operations')
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

/*
    * inventario/precios_por_grupo/get_redondeo_list (Aumentogrupo)
*/
export const get_rounding = tkn => {
    const url_getRounding = process.env.Solu_externo + '/inventario/precios_por_grupo/get_redondeo_list'
    fetch( url_getRounding, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( roundings => roundings.json() )
    .then( roundings => {
        for (const rounding of roundings) {
            // console.log(rounding)
            const select = document.querySelector('#rounding')
            let option = document.createElement("option")
            option.textContent = rounding
            select.appendChild( option )
        }
    })
    .catch( err => {
        console.log( err )
    })
}

/*
    * listados/proveedores/get_proveedores_filtro (Aumentogrupo)
*/
export const get_provider = tkn => {
    const url_getProvider = process.env.Solu_externo + '/listados/proveedores/get_proveedores_filtro'
    fetch( url_getProvider, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            "filtro": "tel",
            "soloProveedores": 1,
            "soloConProductos": 0,
            "opcionTodos": 1
        })
    })
    .then( providers => providers.json() )
    .then( providers => {
        for (const provider of providers) {
            const { id, codigo, cuit, nombre } = provider
            // console.log(id, codigo, cuit, nombre)
            const select = document.querySelector('#vendor')
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

/* 
    * listados/get_cuentasxpagar (SaldoProveedor, ResumenProveedores, CompPendPagos )
*/

export const get_accountsPayableBalance = tkn => {
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
        }
    })
    .catch( err => {
        console.log( err )
    })
}