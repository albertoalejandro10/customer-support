import { getParameter } from "../../jsgen/Helper"

// Listado de cuentas por cobrar
const get_Accounts = tkn => {
    const url_getAccounts = 'https://www.solucioneserp.net/listados/get_cuentasxcobrar'
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

// Listado unidades de negocios
const get_businessUnits = tkn => {
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
        const customers = resp
        for (const element of customers) {
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

//Nuevo Listado Clientes
const get_Customers = tkn => {
    $("#customers").select2({
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
        placeholder: 'Buscar Cliente',
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

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    get_Accounts( tkn )
    get_Customers( tkn )
    get_businessUnits( tkn )
}

const today = new Date().toLocaleDateString('en-GB')
const monthYear = today.slice(2)
const todayDefault = '01' + monthYear
const startDate = todayDefault.split('/').reverse().join('-')
const periodStart = document.getElementById('periodStart')
periodStart.value = startDate
// periodStart.disabled = true

// End Period
const endDate = today.split('/').reverse().join('-')
const periodEnd = document.getElementById('periodEnd')
periodEnd.value = endDate
// periodEnd.disabled = true