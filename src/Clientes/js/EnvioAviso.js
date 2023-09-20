// Permitir Async/Await en el proyecto
import 'regenerator-runtime/runtime'
import { getParameter } from "../../jsgen/Helper"

const backToList = document.getElementById('backToList')
backToList.onclick = () => {
  location.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAvisos.html?tkn=${tkn}`
}


let customers = []
let maximumCustomers = 0
//contador de veces que se toco el checkox
let count=0;

const get_customers = async (tkn, data) => {

  document.querySelector("#loader").classList.remove("d-none")

  const url_getCustomers = process.env.Solu_externo + '/formularios/clientes/get_clientes'
  try {
    const response = await fetch( url_getCustomers , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tkn}`
      },
      body: JSON.stringify(data)
    })
    const { resultado: result, clientes, maximoClientes } = await response.json()
    customers = clientes
    maximumCustomers = maximoClientes

    if (result !== 'ok') return
    
    const sendmail = document.getElementById('send-mail') 
    sendmail.disabled = false

    topCheckbox.disabled = false
    document.querySelectorAll("#full-table input[type='checkbox']").forEach(checkbox => {
      checkbox.disabled = false
      checkbox.checked = false
    })

    const table = document.getElementById('full-table')
    while(table.rows.length > 1) {
      table.deleteRow(1)
    }

    linea = []
    
    const titleCustomers = document.getElementById('title-customers')

    //SUPERA LA CANTIDAD MAXIMA DE REGISTROS
    if (customers.length > maximumCustomers) {
      document.querySelector("#maximum-customers").textContent = `Se ha superado la cantidad maxima de clientes a mostrar (${maximumCustomers} clientes)`
      //checkAllCheckboxes
      customers.forEach( customer => {
        if(customer.selected === 1){
          linea.push({  
            'clienteId': customer.id,
            'comprobanteId': customer.comprobanteId
          })
        }       
      })  
      
      let checkAllCheckboxes = document.querySelector("#checkAllCheckboxes");

      if(linea.length>0){
        //console.log(linea.length)
        checkAllCheckboxes.checked=true;
      }
      
      
      titleCustomers.classList.remove('d-none')

      checkAllCheckboxes.addEventListener('change', () =>{
        count ++;
        //console.log(count)
        if(checkAllCheckboxes.checked){
          titleCustomers.innerHTML = `Se encontraron ${customers.length} clientes/Seleccionados <span id='selected-count'>${customers.length}</span>`
          sendmail.disabled = false
        }else{
          titleCustomers.innerHTML = `Se encontraron ${customers.length} clientes/Seleccionados <span id='selected-count'>0</span>`
          sendmail.disabled = true
        }
      })


      const checkboxes = document.querySelectorAll("#full-table input[type='checkbox']")
      checkboxes.forEach((checkbox, index) => {
        if (index !== 0) {
          checkbox.disabled = true
        }
      })

    }else{
      customers.forEach(customer => printCustomersOnTable(customer))
      getAllCheckboxes()      
      document.querySelector("#maximum-customers").textContent = 'Nombre'
    }

    //const titleCustomers = document.getElementById('title-customers')
    titleCustomers.classList.remove('d-none')
    titleCustomers.innerHTML = `Se encontraron ${customers.length} clientes/Seleccionados <span id='selected-count'>${linea.length}</span>`
    /* if(linea.length>0){
      document.querySelector("send-mail").disabled = false
    } */

  } catch (err) {
    console.error(err)
  }

  document.querySelector("#loader").classList.add("d-none")
}

const printCustomersOnTable = ({ id, nombre, selected, comprobanteId }) => {
  const row = document.createElement('tr')
  //row.classList.add('d-flex', 'align-items-center', 'w-100')
  if (selected === 1) {
    linea.push({
      'clienteId': id,
      'comprobanteId': comprobanteId
    })
  }

  if(nombre.includes('X')){
    row.innerHTML = `
    <td class=""> 
      <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="16px" height="16px" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
        viewBox="0 0 17427.3 13079.5"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <style type="text/css">
          
            .fil0 {fill:#666666}
            .fil1 {fill:#ED1B24}
          
          </style>
        </defs>
        <g id="Layer_x0020_1">
          <metadata id="CorelCorpID_0Corel-Layer"/>
          <path class="fil0" d="M760.9 11739c-12.8,-153.8 -80.3,-221.9 -115.1,-428.4 -68.5,-405.8 -29.8,-8183.1 -29.8,-8665.7l709.1 595.2c768.1,601.1 2039.4,1728.1 2866.6,2423.2l2175.7 1845.9c321.6,286.3 640.2,527.8 960.7,814.7 547,489.9 915.8,552.8 1584.9,552.8 489.8,0 914.7,-323.8 1195.8,-543.2l962.7 -812.7c809.9,-630.1 2032,-1790.4 2841.4,-2412.2 396.5,-304.6 1056.8,-926.3 1428.3,-1216.5l1201.3 -1008.9c114.6,-90 136.3,-166.7 268.9,-202.1l0 6884c0,705.1 109.2,1693.5 -144.9,2173.9 -93.3,-62.4 -162.8,-182.6 -262.4,-281.1l-1900.8 -1903.5c-104.7,-125.2 -138.3,-171.9 -255.3,-288.2l-1634.1 -1628.7c-135.8,-90.9 -289.1,-61.9 -390.3,58 -232.8,275.8 119,485.6 267.6,646.3l3776.7 3868.2c-211.6,112 -400.9,253.6 -724.6,253.6l-13623 0c-310.2,0 -537.1,-128 -724.7,-253.6l1945.8 -2003.4c342.6,-409.9 996.2,-1029.8 1396.6,-1429.5 200.7,-200.5 339.1,-379.6 543.7,-579.5 455.6,-445 0.9,-625.3 -118,-625.3 -158.3,0 -924.3,833.8 -1077.9,987.4l-760.1 797.8c-529.2,549.8 -1039.4,1003.1 -1558.9,1593.2 -86.4,98 -177,177.5 -271.5,272 -149.7,149.6 -377.7,411.3 -534.4,516.3l0 0zm-108.7 -9891.2c0,-634.2 632.1,-1231.9 1268.1,-1231.9l13659.2 0c127.2,0 384.8,83.2 485.1,130.9 399.2,190.3 736.5,675.3 746.8,1137.2 -104.7,28 -348.6,275.9 -507.3,398.5 -617.9,477.5 -1560.6,1367.1 -2194.6,1863.3l-2452.1 2076.9c-99.2,94.6 -157,125.4 -253.6,217.4 -396,377.2 -1283.7,1054.9 -1702.7,1449.4 -247.9,233.3 -609.6,384.4 -973.7,393 -607.6,14.4 -1187.5,-560.5 -1690,-1008.5l-4908.8 -4149c-203,-193.4 -1476.4,-1211.3 -1476.4,-1277.2l0 0zm-652.2 507.2l0 8369.5c0,803.8 123.7,1186.7 485.8,1651.9 264.6,339.9 844.7,703.1 1434.5,703.1l13586.8 0c1010.7,0 1920.2,-909.5 1920.2,-1920.2l0 -9239c0,-1014.9 -905.4,-1920.3 -1920.2,-1920.3l-13586.8 0c-846.3,0 -1563.8,621.8 -1807.9,1380.5 -85.4,265.5 -112.4,627.8 -112.4,974.5l0 0z"/>
          <path class="fil1" d="M13528 7873.6c-166.1,-78 -1121.9,-1063.9 -1323.5,-1264.7 -190.7,-190 -409.9,-452.3 -712.5,-554.2 -737.8,-248.5 -1434.5,441.7 -1185.3,1158.6 158.1,454.9 1559.3,1534.5 1848.4,1966.8 -115.4,180.1 -1056.5,1058.9 -1293.2,1295.4 -320.7,320.5 -1072.5,935.1 -377.3,1645.2 215.6,220.2 590.7,364.5 990.4,216.7 340.6,-125.9 1681.7,-1551 1995,-1849.4 411.8,199.9 1537.9,1646.2 2004.8,1812.8 763.7,272.6 1472.5,-457.6 1196.8,-1173.4 -98.2,-255.2 -652.2,-764 -914.2,-1013.7l-924.2 -933.6c263.6,-442.8 1746.3,-1525.9 1926.8,-1988.2 152.2,-389.7 16.8,-784 -201.5,-993.6 -881.8,-846.7 -1808.3,498.7 -2389,1053.9 -204.3,195.3 -473.9,420.5 -641.5,621.4l0 0z"/>
        </g>
      </svg> 
      ${nombre.replace('X ','')}
    </td>
    <td><input type="checkbox" comprobanteid='${comprobanteId}' name='checkbox-${id}' id='${id}' ${selected == 1 ? "checked" : ""}></td>`
    
  }else{
    row.innerHTML = `
    <td> 
      <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="16px" height="16px" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
        viewBox="0 0 16200 12158.4"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <style type="text/css">
          
            .fil0 {fill:#666666}
          
          </style>
        </defs>
        <g id="Layer_x0020_1">
          <metadata id="CorelCorpID_0Corel-Layer"/>
          <path class="fil0" d="M707.3 10912.3c-11.9,-143 -74.6,-206.3 -107,-398.3 -63.7,-377.2 -27.7,-7606.8 -27.7,-8055.4l659.2 553.3c714,558.8 1895.8,1606.4 2664.6,2252.6l2022.6 1715.9c298.9,266.1 595.1,490.5 892.9,757.3 508.6,455.3 851.4,513.9 1473.3,513.9 455.4,0 850.3,-301.1 1111.7,-505l894.8 -755.5c753,-585.8 1889,-1664.3 2641.3,-2242.3 368.6,-283.1 982.5,-861.1 1327.7,-1130.9l1116.7 -937.8c106.5,-83.6 126.7,-154.9 250,-187.9l0 6399.2c0,655.4 101.5,1574.3 -134.7,2020.9 -86.6,-58.1 -151.3,-169.8 -243.9,-261.4l-1767 -1769.4c-97.2,-116.4 -128.5,-159.9 -237.2,-268l-1519.1 -1513.8c-126.2,-84.5 -268.7,-57.6 -362.8,53.8 -216.4,256.3 110.7,451.4 248.8,600.9l3510.7 3595.7c-196.7,104 -372.7,235.7 -673.6,235.7l-12663.5 0c-288.5,0 -499.3,-119 -673.7,-235.7l1808.8 -1862.4c318.5,-381 926,-957.2 1298.2,-1328.8 186.6,-186.3 315.2,-352.8 505.4,-538.7 423.5,-413.5 0.9,-581.1 -109.7,-581.1 -147.1,0 -859.1,775 -1001.9,917.8l-706.6 741.6c-492,511 -966.2,932.4 -1449.2,1480.9 -80.2,91.1 -164.5,165.1 -252.3,252.9 -139.2,139.1 -351.2,382.3 -496.8,480l0 0zm-101.1 -9194.6c0,-589.6 587.6,-1145.1 1178.9,-1145.1l12697.2 0c118.1,0 357.7,77.2 450.9,121.6 371.1,176.9 684.6,627.7 694.2,1057.1 -97.4,26.1 -324.1,256.4 -471.6,370.5 -574.4,443.8 -1450.7,1270.8 -2040,1732.1l-2279.4 1930.6c-92.3,87.9 -145.9,116.5 -235.8,202.1 -368.1,350.6 -1193.2,980.6 -1582.7,1347.3 -230.5,216.8 -566.8,357.3 -905.1,365.3 -564.9,13.3 -1104,-521.1 -1571.1,-937.4l-4563 -3856.9c-188.8,-179.7 -1372.5,-1126 -1372.5,-1187.2l0 0zm-606.2 471.5l0 7780c0,747.2 115,1103.2 451.5,1535.6 246.1,316 785.4,653.6 1333.6,653.6l12629.8 0c939.6,0 1785.1,-845.5 1785.1,-1785l0 -8588.3c0,-943.5 -841.6,-1785.1 -1785.1,-1785.1l-12629.8 0c-786.7,0 -1453.6,578.1 -1680.6,1283.3 -79.4,246.7 -104.5,583.6 -104.5,905.9l0 0z"/>
        </g>
      </svg>
      ${nombre}
    </td>
    <td><input type="checkbox" comprobanteid='${comprobanteId}' name='checkbox-${id}' id='${id}' ${selected == 1 ? "checked" : ""}></td>`
  }
  
  document.getElementById('full-tbody').appendChild(row)

}

const topCheckbox = document.getElementById('checkAllCheckboxes')
topCheckbox.addEventListener('click', () => {
  //console.log("sos voss")
  const targets = Array.from(document.querySelectorAll("#full-table input[type='checkbox']"))
  targets.shift()
  if (topCheckbox.checked) {
    checkAll(targets)
  } else {
    uncheckAll(targets)
  }
})


let linea = []
const checkAll = targets => {
  linea=[]
  targets.forEach(target => {
    target.checked = true
    target.disabled = true
    linea.push({
      'clienteId': Number(target.id),
      'comprobanteId': Number(target.getAttribute('comprobanteid'))
    })
  })
  document.getElementById('selected-count').textContent = linea.length
}

const uncheckAll = targets => {
  linea=[]
  targets.forEach(target => {
    target.checked = false
    target.disabled = false
    linea = linea.filter(({clienteId}) => clienteId !== Number(target.id))
  })
  document.getElementById('selected-count').textContent = linea.length
}

const getAllCheckboxes = () => {
  const checkboxes = Array.from(document.querySelectorAll("#full-table input[type='checkbox']"))
  const topCheckbox = checkboxes.shift()
  if ( customers.length <= maximumCustomers ) {
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('click', event => {
        //console.log("estamos por aqui")
        if(document.querySelector("#send-mail").disabled){document.querySelector("#send-mail").disabled=false}
        const isAllCheckboxesChecked = checkboxes.filter(checkbox => checkbox.checked === true)
        topCheckbox.disabled = true
        if (isAllCheckboxesChecked.length === 0) {topCheckbox.disabled = false}
        if (event.target.checked) {
          linea.push({
            'clienteId': Number(event.target.id),
            'comprobanteId': Number(event.target.getAttribute('comprobanteid'))
          })
        } else {
          linea = linea.filter(({clienteId}) => clienteId !== Number(event.target.id))
        }
        document.getElementById('selected-count').textContent = linea.length
      })
    })
  } else {
    topCheckbox.addEventListener('click', event => {
      if (event.target.checked) {
        checkboxes.map( checkbox => {
          checkbox.checked = true
          checkbox.disabled = true
        })
      } else {
        checkboxes.map( checkbox => {
          checkbox.checked = false
          checkbox.disabled = true
        })
      }
    })
  }
}

// Boton actualizar
const tkn = getParameter('tkn')
const form = document.getElementById('form')
form.addEventListener('submit', event => {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)

  const tipoEnvioId = 1
  const tipoClienteId = Number(formData.get('customer-type'))
  const grupoClienteId = Number(formData.get('customer-group'))
  const condicionId = Number(formData.get('condition'))
  const valor = Number(formData.get('value-x'))

  const nroLiquidacion = Number(formData.get('liquidation-number'))
  const nroAsiento = Number(formData.get('seat-number'))
  const estadoEnvio = Number(formData.get('sent-status'))
  const adjunto = formData.get('attachment')
  const nroComprobante = Number(formData.get('receipt-number'))
  const cliente = formData.get('customer')

  const avisoDatos = {
    tipoEnvioId,
    tipoClienteId,
    grupoClienteId,
    condicionId,
    valor,
    nroLiquidacion,
    nroAsiento,
    estadoEnvio,
    adjunto,
    nroComprobante,
    cliente
  }
  // console.log( {avisoDatos} )
  get_customers( tkn, {avisoDatos} )
})

const get_data = id => {
  fetch( process.env.Solu_externo + '/maestros/clientes/get_avisoId' , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify({avisoId: id})
  })
  .then( notice => notice.json())
  .then( ({avisoDatos}) => {
    // console.log(avisoDatos)
    const {adjunto, aviso, condicionId, fechaInicio, grupoClienteId, mensaje, periodicidad, tipoClienteId, tipoEnvioId, titulo, valor} = avisoDatos
    document.getElementById('title-name').textContent = aviso
    document.getElementById('condition').value = condicionId
    document.getElementById('customer-group').value = grupoClienteId
    document.getElementById('attachment').value = adjunto
    document.getElementById('value-x').value = valor
    document.getElementById('customer-type').value = tipoClienteId
    document.getElementById('sent-status').value = tipoEnvioId
  })
}

const id = getParameter('id')
if ( id ) {
  get_data( id )
}

document.getElementById('send-mail').addEventListener('click', () => {

  document.querySelector("#loader").classList.remove("d-none")

  fetch( process.env.Solu_externo + '/maestros/clientes/get_avisoId' , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify({avisoId: id})
  })
  .then( notice => notice.json())
  .then( ({avisoDatos, resultado}) => {
    if (!resultado === 'ok') return
    if (linea.length === 0){
      if(count > 1){   
        //console.log(customers)
        linea = []
        customers.forEach( customer =>{
          linea.push({  
            'clienteId': customer.id,
            'comprobanteId': customer.comprobanteId
          })
        })
        
      }else{
        document.querySelector("#loader").classList.add("d-none")
        return alert('Debe marcar al menos un cliente')
      }
    }
    const {titulo, mensaje} = avisoDatos   

    const data = {
      "avisoDatos":{
        titulo,
        mensaje,
      },
      "clientes": linea
    }
    console.log(data)

    sendNotice(data)
    document.querySelector("#loader").classList.add("d-none")

  })
  .catch( err => err)
})

const sendNotice = data => {
  fetch( process.env.Solu_externo + '/formularios/clientes/enviar_aviso' , {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tkn}`
    },
    body: JSON.stringify(data)
  })
  .then( sendNotice => sendNotice.json())
  .then( ({resultado, mensaje}) => {
    if ( !resultado === 'ok' ) return
    alert(`${resultado} - ${mensaje}`)
  })
}

const ids = ['liquidation-number', 'receipt-number', 'seat-number']
ids.forEach(id => {
  document.getElementById(id).onkeydown = event => {
    if (event.key === '-') {
      event.preventDefault()
    }
  }
})