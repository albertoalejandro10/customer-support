import { getParameter} from "../../jsgen/Helper"
import { ag_grid_locale_es,filterChangedd } from "../../jsgen/Grid-Helper"

//VARIABLE GLOBAL
let clientes_mikrowisp;


const localeText = ag_grid_locale_es
const gridOptions = {

    headerHeight: 28,
    rowHeight: 24,
    defaultColDef: {
        editable: true,
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

    suppressHorizontalScroll: false, // Habilita el scroll horizontal

    columnDefs: [

        {
            flex: 1,
            maxWidth:30,
            minWidth: 0,
            headerName: "",
            field: "codigo",
            cellRenderer: "copyTextID",
            cellStyle: {
                'text-align': 'center', // Alinea el contenido a la izquierda
                'padding': '0' // Elimina cualquier relleno
            },
            cellClass: 'cursor-pointer'
        },
        
        {
            flex: 1,
            maxWidth:80,
            //minWidth: 70,
            headerName: "Código",
            field: "codigo",
            tooltipField: 'codigo',
            sortable: true,
            filter: true,
            cellRenderer: "linkSoluciones"
        },
        {
            flex: 1,
            maxWidth:200,
            minWidth: 100,
            headerName: "Nombre",
            field: "nombre",
            tooltipField: 'nombre',
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
            maxWidth:90,
            //minWidth: 140,
            headerName: "DNI/CUIT",
            field: "dni_cuit",
            tooltipField: 'dni_cuit',
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
            minWidth:200,
            //minWidth: 70,
            headerName: "Domicilio",
            field: "direccion",
            tooltipField: 'Docimilio',
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
            minWidth: 200,
            headerName: "Correo",
            field: "correo",
            tooltipField: 'correo',
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
            maxWidth:100,
            //minWidth: 70,
            headerName: "Teléfono",
            field: "telefono",
            tooltipField: 'telefono',
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
            maxWidth:100,
            //minWidth: 70,
            headerName: "Contacto",
            field: "contacto",
            tooltipField: 'contacto',
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
            maxWidth:80,
            //minWidth: 70,
            headerName: "Tipo",
            field: "tipo",
            tooltipField: 'tipo',
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
            headerName: "Estado",
            field: "state",
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
            headerName:"id_cliente",
            field: "id_cliente",
            hide:true, //Columna oculta
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return params.value
                }
        }
        /* ,
        {
            width: 110,
            headerClass: "ag-right-aligned-header",
            cellClass: 'cell-vertical-align-text-right',
            field: "pendiente",
            tooltipField: 'pendiente',
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return format_number(params.value)
            } 
        }*/
    ],

    components: {
        copyTextID: function(params){

            if( typeof params.data.state === 'undefined'){
                return "";
            }else{

                if(params.data.state.includes('Ok')){
                    let boton = document.createElement('i');
                    boton.classList.add("fa-solid", "fa-copy");

                    boton.addEventListener('click', function() {
                        // Acción para copiar al portapapeles
                        
                        // Obtén el código desde los datos de la fila
                        let codigo = params.data.codigo.toString();

                        //Accion para copiar en el cortapapeles
                        navigator.clipboard.writeText(codigo).then(function() {
                            console.log('¡Código copiado al portapapeles!', codigo);
                            // Aquí podrías mostrar una notificación de éxito o realizar otra acción
                        }).catch(function(err) {
                            console.error('Error al copiar al portapapeles', err);
                        });
                    });
                    return boton;

                }else{

                    let button = document.createElement('i');
                    button.classList.add("fa-solid", "fa-copy", "cursor-normal");
                    button.style.color='#ada9a9'
                    button.disabled = true

                    return button
                }

                
            }
            
        },

        linkSoluciones: function(params) {

                if( typeof params.data.state === 'undefined'){
                    //console.log("aa");
                    return params.data.codigo.toString()
                }else{

                    if(params.data.state.includes('Ok')){

                        let enlace = document.createElement('a')
                        enlace.innerText = params.data.codigo.toString() 
                        enlace.href = `https://www.solucioneserp.com.ar/gestionw/clientefo.asp?id=${params.data.id_cliente}&`

                        // Agregar el evento clic para abrir el enlace en una nueva ventana
                        enlace.addEventListener('click', function(event) {
                            event.preventDefault(); // Prevenir el comportamiento por defecto del enlace

                            // Abrir enlace en una nueva ventana con especificaciones de tamaño y posición
                            window.open(enlace.href, '_blank', 'width=600,height=400,top=100,left=100');
                        });

                        return enlace;

                    }else{
                        let enlace = params.data.codigo.toString()
                        return enlace;
                    }
                }

                

            }
    },

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
document.querySelector("#import").addEventListener('click', () =>{
    createGrid(tkn)
})


document.querySelector("#agregar").addEventListener('click', ()=>{
    
    insertToSoluciones(tkn, {"clientes_mikrowisp":clientes_mikrowisp});
})



const createGrid = (tkn) => {

    // Muesta loader de grilla
    gridOptions.api.showLoadingOverlay()


    //Hace la peticion

    //let url = "https://localhost:44342/clientes/importar_clientes_mikrowisp"

    let url = process.env.Solu_externo + "/clientes/importar_clientes_mikrowisp"
    fetch( url , {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( response => response.json() )
    .then( data => {
        // console.log( resp )
        //console.log(data.clientes_mikrowisp)
        clientes_mikrowisp = data.clientes_mikrowisp;
        // Clear Filtros
        gridOptions.api.setFilterModel(null)

        // Clear Grilla
        gridOptions.api.setRowData([])


        /*let cont = 0
        //Recorro para mostrar
        clientes_mikrowisp.forEach( element => {
            //Agrega el boton para copiar
            element.codigo = `<div class="w-100 d-flex justify-content-between align-items-center"><span> ${element.codigo} </span>  <i class="fa-solid fa-copy ml-3 cursos-pointer" id="copy-id-${cont}"></i> </div>`

            cont ++;

        })*/

    
        //Agrega los datos a la grilla
        gridOptions.api.applyTransaction({ 
            add: clientes_mikrowisp
            //El nombre de las columnas debe coincidir con el nombre de las propiedades del objeto
        })

        if(clientes_mikrowisp.length == 0){
            //Cambiar el mensaje
            alert("No hay clientes para importar")
            document.querySelector("#msg").textContent = "No hay clientes para importar"
    
        }
        else{
            //Mostramos el boton para agregar a soluciones
            document.querySelector("#agregar").classList.remove("d-none");

            //Ocultamos botton de importacion
            document.querySelector("#import").classList.add("d-none");
            
            //Mostramos el total de clientes
            document.querySelector("#total-client").textContent = clientes_mikrowisp.length + " Clientes"
        }
        
        //let pinnedBottomData = generatePinnedBottomData()
        //gridOptions.api.setPinnedBottomRowData([pinnedBottomData])
        
        /*gridOptions.api.hideOverlay()
        if ( Object.keys( resp ).length === 0 ) {
            // console.log( 'Is empty')
            gridOptions.api.showNoRowsOverlay()
        }*/
    })
    .catch( err => {
        console.log( err )
    })
}


const insertToSoluciones = (tkn, data) => {

    // Muesta loader de grilla
    gridOptions.api.showLoadingOverlay()

    //console.log(data)


    //Hace la peticion
    
    //let url = "https://localhost:44342/clientes/insertar_clientes_soluciones"
     
    let url = process.env.Solu_externo + "/clientes/insertar_clientes_soluciones"
    fetch( url , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( response => response.json() )
    .then( data_response => {
        //console.log( data_response )
        alert(data_response.result + "\n" + data_response.message)
        
        console.log(data_response)
        //console.log(data.clientes_mikrowisp)

        //No hubo errores de insercion
        //if(data_response.errores.length == 0){
        //    data.clientes_mikrowisp.forEach(element => {
        //        element.state = `<span class="text-success"> Ok </span>`
        //    });
        //}

        //Hubieron errores en la insercion de clientes
        //else
        //{
            data.clientes_mikrowisp.forEach(element => {

                //Verifica existe en el codigo de error
                if( data_response.errores.some(cliente => (cliente.codigo_cliente === element.codigo && cliente.dni_cuit === element.dni_cuit )) ){

                    //Limpia el mensaje de error
                    let msg = data_response.errores.filter(error => error.codigo_cliente === element.codigo)
                                                        .map(error => error.message)[0]  //Obtiene el mensaje
                                                            .split(",")[1]               //Subdivide y se queda con el mensaje
                                                                .trimStart()             //Elimina espacios al comienzo
                    
                    element.state = `<span class="text-danger"> ${msg.charAt(0).toUpperCase() + msg.slice(1)} </span>`
                                                                
                    /*element.state = data_response.errores.filter(error => error.codigo_cliente === element.codigo)
                                                            .map(error => error.message)[0]*/
                    /*console.log(data_response.errores.filter(error => error.codigo_cliente === element.codigo)
                                    .map(error => error.message)[0]);*/
                }else{
                    element.state = `<span class="text-success"> Ok </span>`

                    //Obtenemos el cliente
                    let cliente = data_response.exitos.find(exito => exito.codigo_cliente === element.codigo)

                    element.id_cliente = cliente.id_cliente;


                }

            })

        //}


       // Clear Filtros
        gridOptions.api.setFilterModel(null)

        // Clear Grilla
        gridOptions.api.setRowData([])


        //Agrega los datos a la grilla
        gridOptions.api.applyTransaction({ 
            add: data.clientes_mikrowisp
            //El nombre de las columnas debe coincidir con el nombre de las propiedades del objeto
        })
               
        //Ocultamos el boton para agregar a soluciones
        document.querySelector("#agregar").classList.add("d-none");
        
        //Mostramos boton de importacion
        document.querySelector("#import").classList.remove("d-none");

        //Seteamos el texto de total de clientes
        document.querySelector("#total-client").textContent =  ""
        

        
    })
    .catch( err => {
        console.log( err )
    })
}


