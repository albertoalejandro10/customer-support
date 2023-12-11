import { getParameter} from "../../jsgen/Helper"
import { ag_grid_locale_es,filterChangedd } from "../../jsgen/Grid-Helper"

//VARIABLES GLOBALES

//Para validar archivo
let excelFile;

//Para mapear el excel a json
let excelJson;

//ESTRUCTURA DEL EXCEL
let structNC = ["importe","comprobante"]


let notas_credito;



const localeText = ag_grid_locale_es
const gridOptions = {
    headerHeight: 28,
    rowHeight: 24,
    defaultColDef: {
        editable: false,
        resizable: true,  
        suppressNavigable: true, 
        //minWidth: 100,                      
    },
    // No rows and grid loader
    overlayLoadingTemplate:
    '<div class="loadingx" style="margin: 7em"></div>',
    overlayNoRowsTemplate:
    '<span class="no-rows"id="msg"> No hay información </span>',

    onFilterChanged: event => filterChangedd(event),
    suppressExcelExport: true,
    popupParent: document.body,
    localeText: localeText,

    columnDefs: [
        
        {
            flex: 1,
            minWidth: 50,
            maxWidth: 120,
            headerName: "Código Cliente",
            field: "codigocliente",
            tooltipField: 'codigo',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
            if (String(params.value) == "null")
                return ""
            else
                return params.value
            }
        },
        {
            flex: 1,
            minWidth: 160,
            headerName: "Cliente",
            field: "cliente",
            tooltipField: 'cliente',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
            if (String(params.value) == "null")
                return ""
            else
                return params.value
            }
        },
        {
            flex: 1,
            minWidth: 110,
            maxWidth: 110,
            headerName: "Fecha",
            field: "fecha",
            tooltipField: 'fecha',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
            if (String(params.value) == "null")
                return ""
            else
                return params.value
            }
        },
        {
            flex: 1,
            minWidth: 100,
            headerName: "Producto",
            field: "producto",
            tooltipField: 'producto',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
            if (String(params.value) == "null")
                return ""
            else
                return params.value
            }
        },
        {
            flex: 1,
            //minWidth: 100,
            maxWidth: 120,
            headerName: "Importe",
            field: "importe",
            tooltipField: 'importe',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
            if (String(params.value) == "null")
                return ""
            else
                return params.value
            }
        },
        {
            flex: 1,
            //minWidth: 140,
            maxWidth: 145,
            headerName: "Comprobante",
            field: "comprobante",
            tooltipField: 'comprobante',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
            if (String(params.value) == "null")
                return ""
            else
                return params.value
            }
        },
        {
            flex: 1,
            minWidth: 140,
            headerName: "Estado",
            field: "resultado",
            //tooltipField: 'state',
            //cellStyle: { textAlign: "center" },
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return params.value
            }
        }
    ],
    rowData: [],
    getRowStyle: (params) => {
        if (params.node.rowPinned) {
          return { 'font-weight': 'bold' }
        }
    },
}


document.addEventListener('DOMContentLoaded', () => {
    const gridDiv = document.querySelector('#myGrid')
    new agGrid.Grid(gridDiv, gridOptions)

    if ((parseInt($(window).height()) - 300) < 200)
        $("#myGrid").height(100)
    else
        $("#myGrid").height(parseInt($(window).height()) - 290)
})


const tkn = getParameter('tkn')

//EVENTOS

//Captura el excel seleccionado
document.getElementById("excelNC").addEventListener("change", function (event) {
    
    //Capturamos el archivo
    excelFile = event.target.files[0];

    if (excelFile) {

        //Validar extension del archivo
        let fileName = excelFile.name 

        if(fileName.endsWith(".xlsx")){
            document.getElementById("procesarExcel").removeAttribute("disabled");
        }else{
            // El archivo no tiene la extensión .xlsx, muestra un mensaje de error
            alert('Selecciona un archivo con extensión .xlsx');
            document.getElementById("excelNC").value = "";
        }

    } else {
        document.getElementById("procesarExcel").setAttribute("disabled", "disabled");
    }
});


//Procesa el excel y muestra los datos en grilla
document.getElementById("procesarExcel").addEventListener("click", async function () {

    if (excelFile){

        const content = await readXlsxFile(excelFile)

        //MAPEAR A JSON PARA PODER UTILIZAR LA GRILLA

        //Obtengo las propiedades en minuscula y si espacios en blanco
        const propiedades = content[0].map(item => item.toLowerCase().trim());

        //VALIDAR EL FORMATO DEL EXCEL SEA CORRECTO
        if(validarFormatoExcel(propiedades)){

            // Mapea los demás arrays a objetos
            excelJson = content.slice(1).map(item => {
            const objeto = {};
            propiedades.forEach((propiedad, index) => {

                //Formate la fecha
                if(propiedad == 'fecha'){

                    // Obtén el día, mes y año de la fecha original
                    item[index].setDate(item[index].getDate() + 1);

                    let dia = item[index].getDate();
                    // Nota: Los meses comienzan desde 0, por lo que debes sumar 1
                    let mes = item[index].getMonth() + 1; 
                    let año = item[index].getFullYear();

                    // Formatea la fecha en el formato deseado
                    if(dia < 10)
                        dia = "0"+ dia
                    
                    if(mes < 10)
                        mes = "0"+ mes

                    const fechaFormateada = `${dia}/${mes}/${año}`;

                    objeto[propiedad] = fechaFormateada;

                }else{

                    //Formatea el importe
                    if(propiedad == "importe"){
                        objeto[propiedad] = "$" + parseFloat(item[index]).toFixed(2);
                    }
                    
                    else{
                        objeto[propiedad] = item[index];
                    }

                }

                
            });
            return objeto;
        });
        
        //console.log(excelJson);
        
        createGrid(excelJson);

        }else{
            //console.log(propiedades);
            alert("Formato del Excel Incorrecto \n Las columnas comprobante e importe son obligatorias")
            
            //Limpiamos el input para seleccionar el file
            document.getElementById("excelNC").value = "";
        }


        
    }

      
});


//Button Crear Notas de Credito - Inserta en soluciones
document.querySelector("#generar").addEventListener("click", insertToSoluciones)


//VALIDA LA ESTRUCTURA DEL EXCEL
function validarFormatoExcel(propiedades){

    //Verifica formato del excel
    return structNC.every(item => propiedades.includes(item))
        
}




const createGrid = (notas_credito) => {

    //console.log(notas_credito)

    // Muesta loader de grilla
    gridOptions.api.showLoadingOverlay()
    
    // Clear Filtros
    gridOptions.api.setFilterModel(null)

    // Clear Grilla
    gridOptions.api.setRowData([])


    //Agrega los datos a la grilla
    gridOptions.api.applyTransaction({ 
        add: notas_credito
        //El nombre de las columnas debe coincidir con el nombre de las propiedades del objeto
    })

    if(notas_credito.length == 0){
        //Cambiar el mensaje
        alert("No existen notas de credito para importar para importar")
        document.querySelector("#msg").textContent = "No hay notas de crédito para importar"

    }
    else{
        //Mostramos el boton para agregar a soluciones
        document.querySelector("#generar").classList.remove("d-none");

        //Ocultamos botton de importacion
        document.querySelector("#import").classList.add("d-none");
        
        //Mostramos el total de clientes
        document.querySelector("#total-ncr").textContent = notas_credito.length + " comprobantes"
    }
        
}
    


function insertToSoluciones() {

    document.querySelector("#loader").classList.remove("d-none");

    let notas_credito = { "notas_credito" : excelJson};

    //console.log(notas_credito)

    //Peticion
    //let url = "https://localhost:44342/utilidades/notas_credito/crear"
    
    let url = process.env.Solu_externo + "/utilidades/notas_credito/crear"
    fetch( url , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(notas_credito)
    })
    .then( response => response.json() )
    .then( data => {
        
        //contador de manejo de errores
        exito = 0;

        //Verificacion de errores por NCR
        data.notas_credito.forEach(element => {

            //Verifica errores
            if(element.resultado > 0){
                element.resultado = `<span class="text-success"> Ok </span>`
                exito++;
            }else{

                switch(element.resultado){
                    case -1: element.resultado = `<span class="text-danger"> Existen comprobantes no encontrados </span>`
                        break;
                    case -2: element.resultado = `<span class="text-danger"> Comprobante con error comunicarse con soporte </span>`
                        break;
                    case -3: element.resultado = `<span class="text-danger"> Existen ingresos para generar NCR parciales y no tiene cargado el producto </span>`
                        break;
                    case -4: element.resultado = `<span class="text-danger"> Existen ingresos para generar NCR parciales y no tiene cargado el producto o el codigo de producto usado no existe </span>`
                        break;
                    case -5: element.resultado = `<span class="text-danger"> Existen ingresos para generar NCR con importe mayor al total del comprobante </span>`
                        break;
                    case -6: element.resultado = `<span class="text-danger"> Factura con pendiente distinto del total </span>`
                        break;
                }
              
            }

            //Formatea importe
            element.importe = "$"+ parseFloat(element.importe).toFixed(2)

            //Formate fecha
            let fecha = element.fecha.split(" ")[0].split("/")
            
            if(fecha[0]< 10){
                fecha[0] = "0" + fecha[0]
            }

            if(fecha[1]< 10){
                fecha[1] = "0" + fecha[1]
            }

            element.fecha = `${fecha[0]}/${fecha[1]}/${fecha[2]}`

        });

        //console.log(data)
        alert(`${data.result} \n${data.mensaje} \nSe crearon ${exito} notas de credito - Fallaron ${data.notas_credito.length - exito}`)

        //actualiza notas de crédito
        notas_credito = data.notas_credito
  
        //Clear Filtros
        gridOptions.api.setFilterModel(null)


        //Clear Grilla
        gridOptions.api.setRowData([])


        //Agrega los datos a la grilla
        gridOptions.api.applyTransaction({ 
            add: notas_credito
            //El nombre de las columnas debe coincidir con el nombre de las propiedades del objeto
        })
               
        //Ocultamos el boton para agregar a soluciones
        document.querySelector("#generar").classList.add("d-none");
        
        //Mostramos boton de importacion
        document.querySelector("#import").classList.remove("d-none");
        
        //Ocultamos spinner
        document.querySelector("#loader").classList.add("d-none");

        //Limpiamos el input para seleccionar el file
        document.getElementById("excelNC").value = "";
        
    })
    .catch( err => {
        console.log( err )
    })
}




