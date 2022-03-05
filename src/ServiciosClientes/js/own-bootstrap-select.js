$.fn.selectpicker.Constructor.BootstrapVersion = '4';

// Conseguir parametros del URL
const getParameter = parameterName => {
    let parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}
const tkn = getParameter('tkn')
const url_getCustomers = 'https://www.solucioneserp.net/maestros/servicios_clientes/get_clientes'

// Index Page
if ( window.location.pathname === '/servicioclienteslist.html' ) {
  // Fetch para traer datos de clientes ()
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
        }
  })
}

// Service Page
if ( window.location.pathname === '/servicioclientesedit.html') {
  // Fetch para traer datos de productos (detalle y id)
  fetch(`https://62048c21c6d8b20017dc3571.mockapi.io/api/v1/productos`)
    .then( resp => resp.json() )
    .then( resp => {
        const products = resp
        for ( const element of products ) {
            // Desestructuracion del objeto element
            const { detalle, id } = element
            // console.log(detalle, Number(id))
  
            const select = document.querySelector('.selectpicker')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", detalle)
            option.setAttribute("data-content", detalle)
            option.value = id
            option.textContent = detalle
  
            select.appendChild( option )
  
            $('.selectpicker').selectpicker('refresh')
  
        }
    })
}