import { getParameter } from "../../jsgen/Helper"
import { get_products, get_startMonth, get_branchOffices, get_rubros, get_salesLine } from "../../jsgen/Apis-Helper"

// Lista Proveedores
const get_suppliers = tkn => {
    const url_getSupplier = 'https://www.solucioneserp.net/listados/proveedores/get_proveedores_filtro'
    fetch( url_getSupplier , {
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
        // console.log( resp )
        const supplier = resp
        for (const element of supplier) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#supplier')
            let option = document.createElement("option")
            option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            
            select.appendChild( option )
        }
    })
    .catch( err => {
        console.log('Error proveedor:', err)
    })
}

// Listado tipo reporte
const get_reportType = tkn => {
    const url_getReportType = 'https://www.solucioneserp.net/listados/clientes/ventasxcliente/get_tipo_reporte'
    fetch( url_getReportType, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const reportType = resp
        for (const element of reportType) {
            const { id, nombre } = element
            // console.log(id, nombre)

            const select = document.querySelector('#report-type')
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

// Listado comprobante
const get_voucherType = tkn => {
    const url_getVoucherType = 'https://www.solucioneserp.net/listados/clientes/ventasxcliente/get_tipo_comprobante'
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

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    // Informacion del periodo desde-hasta
    get_startMonth( tkn )
    // Rellenar select2-producto
    get_products( tkn )
    // Rellenar select2-proveedores
    get_suppliers( tkn )
    // Tipo reporte:
    get_reportType( tkn )
    // Comprobante:
    get_voucherType( tkn )
    // Rubros:
    get_rubros( tkn )
    // Lineas venta
    get_salesLine( tkn )
    // Sucursal:
    get_branchOffices( tkn )
}