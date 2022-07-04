import { getParameter, format_number } from "../../jsgen/Helper"

const get_userData = tkn => {
    const url_getUserData = 'https://www.solucioneserp.net/session/login_sid'
    fetch( url_getUserData , {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const users = resp
        const { estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre, empresaCUIT, empresaDomicilio } = users
        // console.log( estado, mensaje, usuarioNombre,  ejercicioNombre, ejercicioInicio, ejercicioCierre, empresaNombre )
        document.getElementById('name-company').textContent = empresaNombre
        document.getElementById('cuit-company').textContent = empresaCUIT
    })
    .catch( err => {
        console.log( 'Error en el llamado a la API: ', err )
    })
}

const tkn = getParameter('tkn')
const get_dataFromURL = () => {
    const query = window.location.search.substring(1)
    const arrData = query.split('&')
    let data = {}
    for (const element of arrData) {
        const pair = element.split('=')
        const [ property, value ] = pair
        data[`${property}`] = value
    }
    // console.log( data )
    get_customerSales( tkn, data )
}

const get_customerSales = ( tkn, data ) => {
    const url_getCustomerSales = 'https://www.solucioneserp.net/reportes/clientes/get_ventasxcliente'
    fetch( url_getCustomerSales , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        // console.log( data )
        const dataHeader = {
            fechaDesde: data.fechaDesde,
            fechaHasta: data.fechaHasta,
            idLineaVenta: Number(data.idLineaVenta),
            idProveedor: Number(data.idProveedor),
            idRubro: Number(data.idRubro),
            idComprobante: Number(data.idTipoComprobante),
            tkn: data.tkn,
            observacion: resp[0].observacionesF,
        }
        printHeader( dataHeader )
        printTable( resp )
    })
    .catch( err => {
        console.log( err )
    })
}

get_userData( tkn )
get_dataFromURL()

const printHeader = ({ fechaDesde, fechaHasta, idLineaVenta, idProveedor, idRubro, idComprobante, tkn, observacion }) => {
    // console.log(fechaDesde, fechaHasta, idLineaVenta, idProveedor, idRubro, idComprobante, tkn, observacion)
    getValues(idLineaVenta, idProveedor, idRubro, idComprobante, tkn)
    document.getElementById('date').textContent = fechaDesde + ' - ' + fechaHasta    
    if ( observacion ) {
        document.getElementById('observation').innerHTML = `<strong class="real-blue">Observación:</strong> ${observacion}`
    }
}

const getValues = (idLineaVenta, idProveedor, idRubro, idComprobante, tkn) => {
    fetch( 'https://www.solucioneserp.net/listados/productos/get_lineas', {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${tkn}`}
    })
    .then( resp => resp.json() )
    .then( resp => {
        const line = resp.filter( x => x.id === idLineaVenta)
        let value = ''
        if ( line?.length ) {
            const [object] = line
            const { nombre } = object
            value = nombre
        } else {
            value = 'No existe'
        }
        // console.log('Linea de Venta', value)
        document.getElementById('sale-line').innerHTML = `<strong class="real-blue">${value}</strong>`
    })
    
    fetch( 'https://www.solucioneserp.net/listados/proveedores/get_proveedores_filtro', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            "filtro":"",
            "soloProveedores":1,
            "soloConProductos":1,
            "opcionTodos":0
        })
    })
    .then( resp => resp.json() )
    .then( resp => {
        const supplier = resp.filter( x => x.id === idProveedor)
        let value = ''
        if ( supplier?.length ) {
            const [object] = supplier
            const { nombre } = object
            value = nombre
        } else {
            value = 'No existe'
            if ( idProveedor === 0 ) {
                value = 'Todos'
            }
        }
        // console.log('Proveedor', value)
        document.getElementById('supplier').innerHTML = `<strong class="real-blue">${value}</strong>`
    })
    
    fetch( 'https://www.solucioneserp.net/listados/productos/get_rubros', {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${tkn}`}
    })
    .then( resp => resp.json() )
    .then( resp => {
        const rubro = resp.filter( x => x.id === idRubro)
        let value = ''
        if ( rubro?.length ) {
            const [object] = rubro
            const { nombre } = object
            value = nombre
        } else {
            value = 'No existe'
        }
        // console.log('Rubros', value)
        document.getElementById('rubro').innerHTML = `<strong class="real-blue">${value}</strong>`
    })

    fetch( 'https://www.solucioneserp.net/listados/clientes/ventasxcliente/get_tipo_comprobante', {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${tkn}`}
    })
    .then( resp => resp.json() )
    .then( resp => {
        const voucher = resp.filter( x => x.id === idComprobante)
        let value = ''
        if ( voucher?.length ) {
            const [object] = voucher
            const { nombre } = object
            value = nombre
        } else {
            value = 'No existe'
            if ( idComprobante === 0 ) {
                value = 'Todos'
            }
        }
        // console.log('Comprobante tipo', value)
        document.getElementById('voucher').innerHTML = `<strong class="real-blue">${value}</strong>`
    })
}

// Imprimir datos en la tabla
const printTable = ( resp ) => {
    let quantity = 0
    let price = 0
    let finalPrice = 0
    for (const element of resp) {
        // console.log(element)
        const { Fecha, Comprobante, cliente, Sucursal, detalle, cantidad, precio, precioF } = element
        quantity += cantidad
        price += precio
        finalPrice += precioF
        let row = document.createElement('tr')
    
        let row_data_1 = document.createElement('td')
        row_data_1.textContent = Fecha
        
        let row_data_2 = document.createElement('td')
        row_data_2.textContent = Comprobante
        
        let row_data_3 = document.createElement('td')
        cliente = cliente.substring(0, 28)
        row_data_3.textContent = cliente
        
        let row_data_4 = document.createElement('td')
        row_data_4.textContent = Sucursal
        
        let row_data_5 = document.createElement('td')
        detalle = detalle.substring(0, 28)
        row_data_5.textContent = detalle
        
        let row_data_6 = document.createElement('td')
        row_data_6.textContent = format_number(cantidad)
        
        let row_data_7 = document.createElement('td')
        row_data_7.textContent = format_number(precio)
        
        let row_data_8 = document.createElement('td')
        row_data_8.textContent = format_number(precioF)
        
        row.appendChild(row_data_1)
        row.appendChild(row_data_2)
        row.appendChild(row_data_3)
        row.appendChild(row_data_4)
        row.appendChild(row_data_5)
        row.appendChild(row_data_6)
        row.appendChild(row_data_7)
        row.appendChild(row_data_8)

        document.getElementById('tbody-table').appendChild(row)
    }
    quantity = quantity.toFixed(2)
    price = price.toFixed(2)
    finalPrice = finalPrice.toFixed(2)
    document.getElementById('quantity').textContent = format_number(quantity)
    document.getElementById('price').textContent = format_number(price)
    document.getElementById('final-price').textContent = format_number(finalPrice)
}

document.getElementById('btn_print').onclick = () => {
    const printContents = document.getElementById('printableArea').innerHTML
    const originalContents = document.body.innerHTML
    document.body.innerHTML = printContents
    window.print()
    document.body.innerHTML = originalContents
}