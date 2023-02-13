import { getParameter, format_number } from "../../jsgen/Helper"

// * Get API's information and print all tables
const get_seat = ( tkn, data ) => {
    const url_getSeat = 'https://www.solucioneserp.net/contabilidad/reportes/get_asiento'
    fetch( url_getSeat , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( resp => {
        const cheques = resp.cheques.Cheque
        const ventas = resp.ventas.comprobante
        const compras = resp.compras.comprobante
        const relacionados = resp.relacionados.relacionados

        printHeader( resp )

        // * Get HTMLElement of each table 
        const tableDocs = document.getElementById('table-docs')
        if ( Array.isArray(cheques)  && cheques.length ) {
            printCheck( resp )
        } else {
            tableDocs.classList.add('d-none')
        }
        
        const tableSales = document.getElementById('table-sales')
        if (Array.isArray(ventas) && ventas.length ) {
            printSales( resp )
        } else {
            tableSales.classList.add('d-none')
        }
        
        const tablePurchases = document.getElementById('table-purchases')
        if (Array.isArray(compras) && compras.length ) {
            printPurchases( resp )
        } else {
            tablePurchases.classList.add('d-none')
        }

        const tableRelated = document.getElementById('table-related')
        if (Array.isArray(relacionados) && relacionados.length ) {
            printRelated( resp )
        } else {
            tableRelated.classList.add('d-none')
        }
    })
    .catch( err => {
        console.log( err )
    })
}

// * Verified for asientoid and tkn parameters on URL
const asientoid = getParameter('asientoid')
const tkn = getParameter('tkn')
if ( asientoid && tkn ) {
    const data = {
        asientoid
    }
    get_seat( tkn, data )
}

// * Function print header table
const printHeader = ({encabezado, lineasAsiento}) => {
    printSeat(encabezado)
    const {lineas} = lineasAsiento
    lineas.map(element => {
        printLine(element)
    })
    printTotal(lineas)
}

// * Function print check table
const printCheck = ({cheques}) => {
    const {Cheque} = cheques
    Cheque.map(cheque => {
        printCheckTable(cheque)
    })
    printTotalCheck(Cheque)
}

// * Function print sales table
const printSales = ({ventas}) => {
    const {comprobante} = ventas
    comprobante.map(venta => {
        printSalesTable(venta)
    })
    printTotalSales(comprobante)
}

// * Function print purchases table
const printPurchases = ({compras}) => {
    const { comprobante } = compras
    comprobante.map(compra => {
        printPurchasesTable(compra)
    })
    printTotalPurchases(compras)
}

const printRelated = resp => {
    const {relacionados} = resp.relacionados
    relacionados.map(relacion => {
        printRelatedTable(relacion)
    })
    printTotalRelated(relacionados)
}

// * Print Seat
const printSeat = ({fecha, unidadNegocio, tipo, usuario}) => {
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.textContent = fecha
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = unidadNegocio
    const row_data_3 = document.createElement('td')
    row_data_3.textContent = tipo
    const row_data_4 = document.createElement('td')
    row_data_4.textContent = usuario === undefined ? '' : usuario
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    document.getElementById('tbody-seat').appendChild(row)
}

// * Print lines
const printLine = ({cuenta, nombre, detalle, importe, debe}) => {
    // console.log(cuenta, nombre, detalle, importe, debe)
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.textContent = cuenta
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = nombre
    const row_data_3 = document.createElement('td')
    row_data_3.textContent = detalle
    const row_data_4 = document.createElement('td')
    row_data_4.textContent = debe === 0 ? format_number(importe) : ''
    const row_data_5 = document.createElement('td')
    row_data_5.textContent = debe === 1 ? format_number(importe) : ''
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    document.getElementById('tbody-activities').appendChild(row)
}

// * Print total check
const printTotal = lineas => {
    console.log(lineas);
    const importeTotalDebe = lineas.filter(linea => linea.debe === 0)
                                   .map(x => x.importe)
                                   .reduce((a, b) => a + b, 0)

    const importeTotalHaber = lineas.filter(linea => linea.debe === 1)
                                    .map(x => x.importe )
                                    .reduce((a, b) => a + b, 0)
                          
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.colSpan = 3
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = format_number(importeTotalDebe)
    row_data_2.classList.add('text-right')
    const row_data_3 = document.createElement('td')
    row_data_3.textContent = format_number(importeTotalHaber)
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    document.getElementById('tbody-activities').appendChild(row)
}

// * Print check table
const printCheckTable = ({bcoNom, ptoVta, vencimiento, importe, numero, recibido, estado}) => {
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.textContent = bcoNom
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = numero
    const row_data_3 = document.createElement('td')
    row_data_3.textContent = vencimiento
    const row_data_4 = document.createElement('td')
    row_data_4.textContent = ptoVta
    const row_data_5 = document.createElement('td')
    row_data_5.textContent = recibido
    const row_data_6 = document.createElement('td')
    row_data_6.textContent = estado
    const row_data_7 = document.createElement('td')
    row_data_7.textContent = format_number(importe)
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    document.getElementById('tbody-docs').appendChild(row)    
    document.getElementById('minus-check')?.setAttribute('showHide', 'check')
}

//* Print total check
const printTotalCheck = Cheque => {
    const importe = Cheque.filter(cheque => cheque.importe)
                          .map(x => x.importe)

    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.colSpan = 6
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = format_number(importe)
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    document.getElementById('tbody-docs').appendChild(row)
}

// * Print Sales table
const printSalesTable = ({codCliente, codigo, cuit, estado, fecha, impuesto1, iva, neto, noGravado, nombre, numero, piva, ptoVta, retencion, riva, tipo, total}) => {
    // console.log(codCliente, codigo, cuit, estado, fecha, impuesto1, iva, neto, noGravado, nombre, numero, piva, ptoVta, retencion, riva, tipo, total)
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.textContent = `${codigo} ${numero}`
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = fecha
    const row_data_3 = document.createElement('td')
    row_data_3.textContent = nombre
    const row_data_4 = document.createElement('td')
    row_data_4.textContent = estado
    const row_data_5 = document.createElement('td')
    row_data_5.textContent = format_number(neto)
    const row_data_6 = document.createElement('td')
    row_data_6.textContent = format_number(piva)
    const row_data_7 = document.createElement('td')
    row_data_7.textContent = format_number(iva)
    const row_data_8 = document.createElement('td')
    row_data_8.textContent = format_number(retencion + impuesto1)
    const row_data_9 = document.createElement('td')
    row_data_9.textContent = format_number(noGravado)
    const row_data_10 = document.createElement('td')
    row_data_10.textContent = format_number(total)
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    row.appendChild(row_data_8)
    row.appendChild(row_data_9)
    row.appendChild(row_data_10)
    document.getElementById('tbody-sales').appendChild(row)
    document.getElementById('minus-sales')?.setAttribute('showHide', 'sales')
}

// * Print total sales 
const printTotalSales = sales => {
    let neto = 0
    let iva = 0
    let retencion = 0
    let impuesto1 = 0
    let noGravado = 0
    let total = 0
    sales.map(sale => {
        neto += sale.neto
        iva += sale.iva
        retencion += sale.retencion
        impuesto1 += sale.impuesto1
        noGravado += sale.noGravado
        total += sale.total
    })

    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.colSpan = 4
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = format_number(neto)
    const row_data_3 = document.createElement('td')
    row_data_3.textContent = ''
    const row_data_4 = document.createElement('td')
    row_data_4.textContent = format_number(iva)
    const row_data_5 = document.createElement('td')
    row_data_5.textContent = format_number(retencion + impuesto1)
    const row_data_6 = document.createElement('td')
    row_data_6.textContent = format_number(noGravado)
    const row_data_7 = document.createElement('td')
    row_data_7.textContent = format_number(total)
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    document.getElementById('tbody-sales').appendChild(row)
}
    
// * Print purchases table
const printPurchasesTable = ({codCliente, codigo, cuit, estado, fecha, impuesto1, iva, neto, noGravado, nombre, numero, piva, ptoVta, retencion, riva, tipo, total}) => {
    // console.log(codCliente, codigo, cuit, estado, fecha, impuesto1, iva, neto, noGravado, nombre, numero, piva, ptoVta, retencion, riva, tipo, total)
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.textContent = `${codigo} ${numero}`
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = fecha
    const row_data_3 = document.createElement('td')
    row_data_3.textContent = nombre
    const row_data_4 = document.createElement('td')
    row_data_4.textContent = estado
    const row_data_5 = document.createElement('td')
    row_data_5.textContent = format_number(neto)
    const row_data_6 = document.createElement('td')
    row_data_6.textContent = format_number(piva)
    const row_data_7 = document.createElement('td')
    row_data_7.textContent = format_number(iva)
    const row_data_8 = document.createElement('td')
    row_data_8.textContent = format_number(retencion + impuesto1)
    const row_data_9 = document.createElement('td')
    row_data_9.textContent = format_number(noGravado)
    const row_data_10 = document.createElement('td')
    row_data_10.textContent = format_number(total)
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    row.appendChild(row_data_8)
    row.appendChild(row_data_9)
    row.appendChild(row_data_10)
    document.getElementById('tbody-purchases').appendChild(row)
    document.getElementById('minus-purchases')?.setAttribute('showHide', 'purchases')
}
    
// * Print total purchases
const printTotalPurchases = purchases => {
    const { comprobante } = purchases
    let neto = 0
    let iva = 0
    let retencion = 0
    let impuesto1 = 0
    let noGravado = 0
    let total = 0

    comprobante.map(sale => {
        neto += sale.neto
        iva += sale.iva
        retencion += sale.retencion
        impuesto1 += sale.impuesto1
        noGravado += sale.noGravado
        total += sale.total
    })
    
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.colSpan = 4
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = format_number(neto)
    const row_data_3 = document.createElement('td')
    row_data_3.textContent = ''
    const row_data_4 = document.createElement('td')
    row_data_4.textContent = format_number(iva)
    const row_data_5 = document.createElement('td')
    row_data_5.textContent = format_number(retencion + impuesto1)
    const row_data_6 = document.createElement('td')
    row_data_6.textContent = format_number(noGravado)
    const row_data_7 = document.createElement('td')
    row_data_7.textContent = format_number(total)
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    document.getElementById('tbody-purchases').appendChild(row)
}

// * Print table related
const printRelatedTable = ({codigo, tipo, ptoVta, numero, fecha, codCliente, nombre, riva, cuit, neto, iva, ivaRni, noGravado, retencion, total, estado, relImp}) => {
    // console.log(codigo, tipo, ptoVta, numero, fecha, codCliente, nombre, riva, cuit, neto, iva, ivaRni, noGravado, retencion, total, estado, relImp)
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.textContent = `${codigo} ${numero}`
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = fecha
    const row_data_3 = document.createElement('td')
    row_data_3.textContent = nombre
    const row_data_4 = document.createElement('td')
    row_data_4.textContent = estado
    const row_data_5 = document.createElement('td')
    row_data_5.textContent = format_number(neto)
    const row_data_6 = document.createElement('td')
    row_data_6.textContent = ''
    const row_data_7 = document.createElement('td')
    row_data_7.textContent = format_number(iva)
    const row_data_8 = document.createElement('td')
    row_data_8.textContent = format_number(retencion)
    const row_data_9 = document.createElement('td')
    row_data_9.textContent = format_number(noGravado)
    const row_data_10 = document.createElement('td')
    row_data_10.textContent = format_number(total)
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    row.appendChild(row_data_8)
    row.appendChild(row_data_9)
    row.appendChild(row_data_10)
    document.getElementById('tbody-related').appendChild(row)
    document.getElementById('minus-related')?.setAttribute('showHide', 'related')
}

// * Print total related
const printTotalRelated = related => {
    let neto = 0
    let iva = 0
    let ivaRni = 0
    let noGravado = 0
    let total = 0

    related.map(sale => {
        neto += sale.neto
        iva += sale.iva
        ivaRni += sale.ivaRni
        noGravado += sale.noGravado
        total += sale.total
    })
    
    const row = document.createElement('tr')
    const row_data_1 = document.createElement('td')
    row_data_1.colSpan = 4
    const row_data_2 = document.createElement('td')
    row_data_2.textContent = format_number(neto)
    const row_data_3 = document.createElement('td')
    row_data_3.textContent = ''
    const row_data_4 = document.createElement('td')
    row_data_4.textContent = format_number(iva)
    const row_data_5 = document.createElement('td')
    row_data_5.textContent = format_number(ivaRni)
    const row_data_6 = document.createElement('td')
    row_data_6.textContent = format_number(noGravado)
    const row_data_7 = document.createElement('td')
    row_data_7.textContent = format_number(total)
    row.appendChild(row_data_1)
    row.appendChild(row_data_2)
    row.appendChild(row_data_3)
    row.appendChild(row_data_4)
    row.appendChild(row_data_5)
    row.appendChild(row_data_6)
    row.appendChild(row_data_7)
    document.getElementById('tbody-related').appendChild(row)
}

// * Hide and Show tables
const allButtons = Array.from(document.getElementsByTagName('button'))
const check = document.getElementById('docs')
const sales = document.getElementById('sales')
const purchases = document.getElementById('purchases')
const related = document.getElementById('related')
allButtons.forEach(button => {
    button.addEventListener('click', event => {
        const identifier = event.currentTarget.getAttribute('identifier')
        const option = button.getAttribute('showHide')
        toggleTable(option)
        changeIcon(identifier)
    })
})

const toggleTable = option => {
    switch (option) {
        case 'check':
            check.classList?.toggle('d-none')
        break
        case 'sales':
            sales.classList?.toggle('d-none')
        break
        case 'purchases':
            purchases.classList?.toggle('d-none')
        break
        case 'related':
            related.classList?.toggle('d-none')
        default:
            break;
    }
}

const changeIcon = identifier => {
    if (allButtons[identifier].classList.contains('text-danger')) {
        allButtons[identifier].innerHTML = '<i class="fa-regular fa-plus"></i>'
        allButtons[identifier].classList.add('text-primary')
        allButtons[identifier].classList.remove('text-danger')
    } else {
        allButtons[identifier].innerHTML = '<i class="fa-solid fa-minus"></i>'
        allButtons[identifier].classList.add('text-danger')
        allButtons[identifier].classList.remove('text-primary')
    }
}