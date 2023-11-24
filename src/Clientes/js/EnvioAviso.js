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

  if(getParameter("tipoEnvioId")==2){
    if(nombre.includes('X')){

      row.innerHTML = `
      <td class=>
      <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="14px" height="14px" version="1.1" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd"
        viewBox="0 0 11260.3 11309.6"
        xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <style type="text/css">
          <![CDATA[
            .str1 {stroke:#FEFEFE;stroke-width:99.8;stroke-miterlimit:22.9256}
            .str0 {stroke:gray;stroke-width:6.7;stroke-miterlimit:22.9256}
            .fil3 {fill:none}
            .fil4 {fill:#DA4452}
            .fil2 {fill:white}
            .fil1 {fill:#FEFEFE;fill-rule:nonzero}
            .fil0 {fill:url(#id0);fill-rule:nonzero}
          ]]>
          </style>
          <linearGradient id="id0" gradientUnits="userSpaceOnUse" x1="5644.6" y1="11047.2" x2="5644.6" y2="278.5">
          <stop offset="0" style="stop-opacity:1; stop-color:#20B038"/>
          <stop offset="1" style="stop-opacity:1; stop-color:#60D66A"/>
          </linearGradient>
        </defs>
        <g id="Layer_x0020_1">
          <metadata id="CorelCorpID_0Corel-Layer"/>
          <path class="fil0 str0" d="M308.7 5596.1c-0.3,943.2 246.2,1864.2 714.8,2676l-759.6 2773.7 2838.4 -744.3c782.1,426.2 1662.5,651.2 2558.6,651.5l2.4 0c2950.9,0 5353,-2401.3 5354.2,-5352.7 0.6,-1430.2 -555.8,-2775 -1566.8,-3786.7 -1010.9,-1011.8 -2355.2,-1569.3 -3787.6,-1569.9 -2951.2,0 -5353.2,2401.1 -5354.4,5352.4m0 0l0 0 0 0z"/>
          <path class="fil1 str1" d="M117.5 5594.2c-0.3,977.3 255,1931.2 740.3,2772.1l-786.8 2873.1 2940.3 -771c810,441.8 1722.1,674.6 2650.3,675l2.4 0c3056.8,0 5545.2,-2487.7 5546.4,-5544.6 0.6,-1481.7 -575.8,-2874.8 -1623,-3922.8 -1047.2,-1048 -2439.8,-1625.4 -3923.4,-1626.1 -3057.2,0 -5545.3,2487.2 -5546.5,5544.3l0 0zm1751 2627.3l-109.8 -174.3c-461.4,-733.8 -705.1,-1581.8 -704.7,-2452.6 1,-2540.9 2068.9,-4608.2 4611.8,-4608.2 1231.4,0.5 2388.7,480.5 3259.2,1351.6 870.4,871 1349.4,2028.9 1349,3260.4 -1.1,2541.1 -2069.1,4608.5 -4609.9,4608.5l-1.8 0c-827.4,-0.4 -1638.8,-222.5 -2346.4,-642.5l-168.4 -99.8 -1744.9 457.4 465.9 -1700.5 0 0z"/>
          <path class="fil2" d="M4277.8 3276.4c-103.8,-230.7 -213.1,-235.4 -311.9,-239.4 -80.8,-3.5 -173.2,-3.3 -265.6,-3.3 -92.3,0 -242.5,34.8 -369.5,173.4 -127.1,138.7 -485.1,473.9 -485.1,1155.8 0,681.9 496.6,1340.7 565.9,1433.3 69.3,92.4 958.8,1536.3 2367.3,2091.8 1170.7,461.7 1408.9,369.8 1663.1,346.7 254.1,-23.1 819.9,-335.1 935.4,-658.7 115.5,-323.6 115.5,-601 80.9,-658.9 -34.7,-57.8 -127.1,-92.4 -265.7,-161.7 -138.6,-69.3 -819.9,-404.7 -947,-450.9 -127,-46.2 -219.4,-69.3 -311.8,69.5 -92.4,138.6 -357.9,450.6 -438.8,543.1 -80.8,92.6 -161.6,104.1 -300.2,34.8 -138.7,-69.5 -585,-215.7 -1114.5,-687.8 -412,-367.3 -690.1,-820.9 -771,-959.7 -80.8,-138.6 -8.6,-213.6 60.9,-282.7 62.2,-62.1 138.6,-161.8 207.9,-242.7 69.1,-80.9 92.3,-138.7 138.4,-231.1 46.2,-92.6 23.1,-173.5 -11.5,-242.8 -34.6,-69.3 -304,-754.7 -427.2,-1028.7l0 0 0 0zm0 0l0 0 0 0z"/>
          <path id="_1" class="fil3 str0" d="M4277.8 3276.4c-103.8,-230.7 -213.1,-235.4 -311.9,-239.4 -80.8,-3.5 -173.2,-3.3 -265.6,-3.3 -92.3,0 -242.5,34.8 -369.5,173.4 -127.1,138.7 -485.1,473.9 -485.1,1155.8 0,681.9 496.6,1340.7 565.9,1433.3 69.3,92.4 958.8,1536.3 2367.3,2091.8 1170.7,461.7 1408.9,369.8 1663.1,346.7 254.1,-23.1 819.9,-335.1 935.4,-658.7 115.5,-323.6 115.5,-601 80.9,-658.9 -34.7,-57.8 -127.1,-92.4 -265.7,-161.7 -138.6,-69.3 -819.9,-404.7 -947,-450.9 -127,-46.2 -219.4,-69.3 -311.8,69.5 -92.4,138.6 -357.9,450.6 -438.8,543.1 -80.8,92.6 -161.6,104.1 -300.2,34.8 -138.7,-69.5 -585,-215.7 -1114.5,-687.8 -412,-367.3 -690.1,-820.9 -771,-959.7 -80.8,-138.6 -8.6,-213.6 60.9,-282.7 62.2,-62.1 138.6,-161.8 207.9,-242.7 69.1,-80.9 92.3,-138.7 138.4,-231.1 46.2,-92.6 23.1,-173.5 -11.5,-242.8 -34.6,-69.3 -304,-754.7 -427.2,-1028.7m0 0l0 0 0 0z"/>
          <path class="fil4" d="M6326.2 7723.7c-64.2,-63.7 -94.5,-155.7 -42.6,-243.7 22.5,-38.3 235.1,-242.7 280.8,-288.4 42.2,-42.2 74.7,-74.4 149,-75.7 78.2,-1.3 118.9,34 154.7,69.9l454.1 454.1c19.8,19.8 36.8,36.8 56.6,56.5 16.6,16.7 39.8,43.1 57.1,55.6 19.9,-12.2 517.9,-515.2 570.3,-567.8 36.7,-36.9 76.5,-70.9 156,-68.2 77.5,2.7 112.5,41.9 147.7,77.2 38.6,38.6 74.4,74.3 113.1,113 39.3,39.3 75.7,75.7 115,115 35.9,35.9 73.9,70.4 75.7,149.3 1.9,79.7 -33.8,119.5 -69.7,155.5l-454.1 454.2c-35.8,35.9 -80.6,76 -112.2,113.1 11.5,17.8 526.2,528.3 567.8,569.8 35.2,35.1 71,79.1 68.2,156.9 -2.9,78.3 -41.6,112.4 -77.1,147.9l-228.1 228c-35.7,35.9 -71,73.7 -149.9,75.4 -78.9,1.6 -119.9,-35 -155.1,-70.3 -38.5,-38.7 -74.4,-74.5 -113,-113.1l-454.6 -452.8c-36.5,30.3 -79.6,78.8 -115,114.2 -38.6,38.6 -74.4,74.4 -113,113l-341.2 341.1c-36.2,36.1 -78,70.5 -157.3,67.8 -78.1,-2.7 -112.3,-42.3 -147.7,-77.7l-228.1 -228.1c-35.9,-35.9 -73.8,-70.6 -75.2,-149.5 -1.4,-80.2 33.7,-117.8 70.5,-154.4 51.4,-51.2 554.7,-549.5 565.7,-568.3l-568.4 -569.5 0 0zm-1239.8 430.9l0 160.3c5,17.1 6.8,103.5 9.3,130.8 41.9,478.8 236.2,947.3 541.8,1306.9 375.9,442.4 882.2,728.1 1467.3,813.9 41.8,6.1 84,10.9 126.3,14.5 27.8,2.3 116.9,4.2 134.6,9.3l163.9 0 256.7 -24.7c398.5,-57.7 787.6,-223.6 1097.3,-465.3 79.4,-61.9 160.7,-131.7 228.3,-199.7 77.8,-78.2 200.3,-221.6 259,-310.2 93,-140.7 133.8,-203.3 208.2,-361 94.9,-201.3 162.3,-429 194.7,-657.5 5.9,-41.6 10.8,-83.9 14.4,-126.2 2.5,-28.2 4.2,-116.9 9.3,-134.7l0 -145c-5.3,-20.9 -6.1,-104.7 -8.6,-135 -22.2,-265.2 -95,-551.6 -207.2,-785.5 -109.6,-228.3 -178.1,-329.1 -331.6,-524.3l-66.5 -74.7c-23.9,-23.1 -43.4,-49.1 -67.7,-73.6 -61.6,-62.3 -154.1,-142.5 -227.7,-200.2 -312.4,-244.6 -697.2,-409.6 -1098.4,-468.3 -42.1,-6.2 -83.7,-11 -126.4,-15.1 -28,-2.7 -111,-3.7 -130,-10.1l-182.9 0c-50.4,17.1 -392.8,-14.9 -914.2,223.5 -157.8,72.1 -312.3,169.6 -440.5,270 -110.4,86.5 -275.2,238.3 -362,348.6 -40.5,51.4 -84.1,102.2 -122.3,160.2 -37.6,57.1 -74.4,110.3 -110.2,172.4 -109.3,190 -189.2,386.2 -245.3,607 -28.8,113.4 -50,243.7 -60.4,362.9 -2.4,27.3 -4.2,113.7 -9.2,130.8l0 0z"/>
          <path class="fil2" d="M6894.6 8293.3c-11,18.7 -514.3,517 -565.7,568.2 -36.8,36.6 -71.9,74.3 -70.5,154.5 1.4,78.8 39.3,113.6 75.2,149.4l228.1 228.1c35.4,35.4 69.6,75 147.7,77.7 79.3,2.7 121.1,-31.7 157.3,-67.8l341.2 -341.1c38.6,-38.6 74.4,-74.3 113,-113 35.4,-35.4 78.5,-83.9 115,-114.1l454.6 452.8c38.6,38.6 74.5,74.3 113,113 35.2,35.3 76.2,71.9 155.1,70.3 78.9,-1.6 114.2,-39.5 149.9,-75.4l228.1 -228c35.5,-35.5 74.2,-69.6 77.1,-147.9 2.8,-77.7 -33,-121.7 -68.2,-156.9 -41.6,-41.5 -556.3,-552 -567.8,-569.8 31.6,-37.1 76.4,-77.1 112.2,-113l454.1 -454.3c35.9,-36 71.6,-75.7 69.7,-155.4 -1.8,-79 -39.8,-113.5 -75.7,-149.3 -39.3,-39.3 -75.7,-75.8 -115,-115.1 -38.7,-38.6 -74.5,-74.4 -113.1,-113 -35.2,-35.3 -70.2,-74.5 -147.7,-77.2 -79.5,-2.7 -119.3,31.4 -156,68.2 -52.4,52.6 -550.4,555.6 -570.3,567.9 -17.3,-12.6 -40.5,-39 -57.1,-55.6 -19.8,-19.8 -36.8,-36.8 -56.6,-56.5l-454.1 -454.2c-35.8,-35.9 -76.5,-71.2 -154.7,-69.8 -74.3,1.3 -106.8,33.4 -149,75.7 -45.7,45.6 -258.3,250.1 -280.8,288.4 -51.9,87.9 -21.6,179.9 42.6,243.6l568.4 569.6 0 0z"/>
        </g>
        </svg>  
      ${nombre.replace('X ','')}
      </td>
      <td><input type="checkbox" comprobanteid='${comprobanteId}' name='checkbox-${id}' id='${id}' ${selected == 1 ? "checked" : ""}></td>`
    }else{
      row.innerHTML = `
        <td> 
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="10,0,256,256" width="14px" height="14px" class="mr-1"><g fill="#25d366" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(10.66667,10.66667)"><path d="M19.077,4.928c-2.082,-2.083 -4.922,-3.134 -7.904,-2.894c-4.009,0.322 -7.523,3.11 -8.699,6.956c-0.84,2.748 -0.487,5.617 0.881,7.987l-1.296,4.303c-0.124,0.413 0.253,0.802 0.67,0.691l4.504,-1.207c1.459,0.796 3.101,1.215 4.773,1.216h0.004c4.195,0 8.071,-2.566 9.412,-6.541c1.306,-3.876 0.34,-7.823 -2.345,-10.511zM16.898,15.554c-0.208,0.583 -1.227,1.145 -1.685,1.186c-0.458,0.042 -0.887,0.207 -2.995,-0.624c-2.537,-1 -4.139,-3.601 -4.263,-3.767c-0.125,-0.167 -1.019,-1.353 -1.019,-2.581c0,-1.228 0.645,-1.832 0.874,-2.081c0.229,-0.25 0.499,-0.312 0.666,-0.312c0.166,0 0.333,0 0.478,0.006c0.178,0.007 0.375,0.016 0.562,0.431c0.222,0.494 0.707,1.728 0.769,1.853c0.062,0.125 0.104,0.271 0.021,0.437c-0.083,0.166 -0.125,0.27 -0.249,0.416c-0.125,0.146 -0.262,0.325 -0.374,0.437c-0.125,0.124 -0.255,0.26 -0.11,0.509c0.146,0.25 0.646,1.067 1.388,1.728c0.954,0.85 1.757,1.113 2.007,1.239c0.25,0.125 0.395,0.104 0.541,-0.063c0.146,-0.166 0.624,-0.728 0.79,-0.978c0.166,-0.25 0.333,-0.208 0.562,-0.125c0.229,0.083 1.456,0.687 1.705,0.812c0.25,0.125 0.416,0.187 0.478,0.291c0.062,0.103 0.062,0.603 -0.146,1.186z"></path></g></g></svg>
          ${nombre}
        </td>
        <td><input type="checkbox" comprobanteid='${comprobanteId}' name='checkbox-${id}' id='${id}' ${selected == 1 ? "checked" : ""}></td>`
    }
      
  }else{

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
    //Agregar titulo
    if(getParameter('tipoEnvioId')==1){
      document.getElementById('title-name').innerHTML = `${aviso} - <small>E-mail</small>`
    }else{
      document.getElementById('title-name').innerHTML = `${aviso} - <small>WhatsApp</small>`
    }
    document.getElementById('condition').value = condicionId
    document.getElementById('customer-group').value = grupoClienteId
    document.getElementById('attachment').value = adjunto
    document.getElementById('value-x').value = valor
    document.getElementById('customer-type').value = tipoClienteId
    //document.getElementById('sent-status').value = getParameter('tipoEnvioId')
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
    //console.log("aaaaaaaaa",avisoDatos)
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

    const {titulo, mensaje, tipoEnvioId} = avisoDatos   

    //Para enviar el ID del Aviso => que es el de la plantilla
    const id = getParameter('id')
    let avisoId
    //Si no se creo la plantilla, el AvisoId es 0
    (id)?avisoId=id : avisoId=0

    const data = {
      "avisoDatos":{
        titulo,
        mensaje,
      },
      "clientes": linea,

      //PARAMETROS AGREGADOS
      "avisoId": avisoId,
      "tipoEnvioId": tipoEnvioId
    }
    
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
    
    alert(`${resultado} - ${mensaje}`)
    
    if ( resultado === 'ok' ){
      //Redirige a otra pagina
      location.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAvisos.html?tkn=${tkn}`    
    }
    


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