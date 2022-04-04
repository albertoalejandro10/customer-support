$.fn.selectpicker.Constructor.BootstrapVersion = '4';

// Conseguir parametros del URL
const getParameter = parameterName => {
  let parameters = new URLSearchParams( window.location.search )
  return parameters.get( parameterName )
}

const tkn = getParameter('tkn')
const pathname = (window.location.pathname).toLowerCase()

// Index Page
const devOrProductionListClients = () => {
  // Fetch para traer datos de clientes
  const url_getCustomers = 'https://www.solucioneserp.net/maestros/servicios_clientes/get_clientes'
  fetch( url_getCustomers , {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tkn}`
      }
  })
  .then( resp => resp.json() )
  .then( resp => {
    const customers = resp
    for ( const element of customers ) {        
        // Desestructuracion del objeto element
        const { nombre, id, cuit, codCliente } = element
        // console.log(nombre, Number(id), cuit, codCliente)
        
        const select = document.querySelector('.selectpicker')
        let option = document.createElement("option")
        option.setAttribute("data-tokens", nombre)
        option.value = id
        option.textContent = nombre
        
        select.appendChild( option )

        $('.selectpicker').selectpicker('refresh')

        if ( getParameter('id') && getParameter('name')) {
          if ( id === Number(getParameter('id')) ) {
            const customerSelected = document.getElementById('customer')
            customerSelected.value = (nombre).replace(' ', '-')
            $('.selectpicker').selectpicker('val', id)
          }
        }

      }
  })
}

const pathnameClients_Develop = '/serviciosclientes/servicioclienteslist.html'
const pathnameClients_Production = '/serviciosclientes/servicioclienteslist'
if ( pathname === pathnameClients_Develop ) {
  devOrProductionListClients()
}

if ( pathname === pathnameClients_Production) {
  devOrProductionListClients()
}

const devOrProductionListProducts = () => {
  // Service Page
  // Fetch para traer datos de productos (detalle y id)
  const url_getProducts = 'https://www.solucioneserp.net/listados/get_productos_filtro'
  fetch(url_getProducts, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify({
      "filtro": ""
    })
  })
    .then( resp => resp.json() )
    .then( resp => {
        const products = resp
        for ( const element of products ) {
            // Desestructuracion del objeto element
            const { id, codigo, detalle, unidad, lineaId, iva, activo } = element
            // console.log( id, codigo, detalle, unidad, lineaId, iva, activo )
            const description = detalle.trim()

            const select = document.querySelector('.selectpicker')
            let option = document.createElement("option")
            option.setAttribute("data-code", codigo)
            option.setAttribute("data-lineId", lineaId)
            option.setAttribute("data-content", description)
            option.value = id
            option.textContent = description

            select.appendChild( option )

            $('.selectpicker').selectpicker('refresh')

            // if ( getParameter('id') && getParameter('name') && getParameter('idservice')) {
            //   if ( id === Number(getParameter('idservice')) ) {
            //     $('.selectpicker').selectpicker('val', id)
            //   }
            // }
        }
    })  
}

const pathnameProducts_Develop = '/serviciosclientes/servicioclientesedit.html'
const pathnameProducts_Production = '/serviciosclientes/servicioclientesedit'
if ( pathname === pathnameProducts_Develop ) {
  devOrProductionListProducts()
}

if ( pathname === pathnameProducts_Production ) {
  devOrProductionListProducts()
}