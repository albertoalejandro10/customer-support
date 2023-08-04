//VARIABLES GLOBALES
const soluciones = "https://www.solucioneserp.net"
var grupo_usuarios;
var objetos_menu;

//Captura el token de la URL
const parameters = new URLSearchParams(window.location.search)
const token = parameters.get('tkn')

//COMIENZA LA EJECUCION
loadPage()


//Retorna promise de grupo de usuarios
function getGrupoUsuarios(){

    return fetch( soluciones+"/utilidades/permisosmenu/listar_grupos_usuarios", {
        method : 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    //Convierte la respuesta a un json
    .then( response => response.json())
    .then( data => {

        //Traemos el select de grupo de usuarios
        const select = document.querySelector('#grupo-usuarios')

        data.grupo_usuarios.forEach(element => {
            //Desectructura el objeto
            const { id, nombre } = element
            
            //Captura el select
            let option = document.createElement("option")
            //option.setAttribute("data-tokens", nombre)
            option.value = id
            option.textContent = nombre
            select.appendChild( option )
        });

        return data.grupo_usuarios
    })
    .catch( error => {
        console.log( "Error al consumir API ", error )
    })
}


//Retorna promise de todos los permisos (JSON original)
function getObjetosMenu(){
    
    return fetch( soluciones+"/utilidades/permisosmenu/listar_objetos_menu", {
        method : 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        return data
    })
    .catch(error => {
        console.log("Error al consumir la API ", error)
    })
}



//Retorna arreglo con todos los tabs
function getArregloTabs( jsonOriginal){

    let tabs = ['TODOS']
    jsonOriginal.objetos_menu.forEach( element => {
        if(!tabs.includes(element.tab)){
            tabs.push(element.tab)
        }
    })

    return tabs;
}


//Retorna arreglo con todos los objetosID
function getArregloObjetoID(jsonOriginal){
    let array = []
    jsonOriginal.objetos_menu.forEach( item => {
        array.push(item.objetoID)
    })

    return array;
}


//Retorna el JSON con estructura de arbol
function getJsonArbol(jsonOriginal){
        
        // Agrupar los objetos por tab y grupo
        const groupedJSON = jsonOriginal.objetos_menu.reduce((result, obj) => {
            const { tab, grupo, ...rest } = obj;
            
            // Crear una entrada para la tab si no existe
            if (!result[tab]) {
                result[tab] = [];
            }
            
            // Buscar si ya existe una entrada para el grupo en la tab actual
            const groupEntry = result[tab].find(entry => entry.grupo === grupo);
            
            // Si existe, agregar el objeto al arreglo de elementos del grupo
            // Si no existe, crear una nueva entrada para el grupo
            if (groupEntry) {
                groupEntry[grupo].push(rest);
            } else {
                result[tab].push({ grupo, [grupo]: [rest] });
            }
        
            return result;

        }, {});
        
        // Convertir el objeto agrupado en un arreglo de objetos
        const finalJSON = Object.entries(groupedJSON).map(([tab, grupos]) => ({
            tab,
            [tab]: grupos
        }));
        
        return finalJSON; 
}


//Carga los select con los tabs
function cargarSelectGrupos(array){
    const select = document.querySelector('#id-pestañas')

    array.forEach(element => {
                   
        //Crea una option
        let option = document.createElement("option")
        //option.setAttribute("data-tokens", nombre)
        option.value = element
        option.textContent = element
        select.appendChild( option )
    });
}

//Reload de la pagina
function actualizar(){
    //Cargo spinner
    //document.getElementById('loader').classList.remove('d-none')
    location.reload()
}


//Retorna flag de permisos
function getFlagPermisos(id_usuario, objetosID){
    
    return fetch( soluciones+"/utilidades/permisosmenu/listar_flag_permisos", {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "grupoId":id_usuario,
            "objetosID": objetosID
        })
    })
    .then( response => response.json())
    .then( data => {
        return data
    })
    .catch (error => {
        console.log("Error al consumir la API ", error)
    })

}


function renderHTML(objetosID){

    //Capturo el id del grupo de usuario
    let id_usuario = document.querySelector('#grupo-usuarios').value

    //Creamos spinners
    document.getElementById('loader').classList.remove('d-none')

    //Limpiamos container
    let container = document.querySelector("#objetos-menu-grid")
    container.innerHTML = ""

    let flag_permisos = getFlagPermisos(id_usuario, objetosID)
    

    objetos_menu.then( pestañas => {
        //console.log(pestañas)
        
        flag_permisos.then(data => {
            //console.log(data)
            document.getElementById('loader').classList.add('d-none')
            mostrarAllPermisos(getJsonArbol(pestañas), data)
        })
    })

}


function limpiar(cadena){
    return cadena.replace(".","").replace(/\s/g, '')
}

function limpiarBR(cadena){
    return cadena.replace("<BR>","").replace("<BR/>","").replace("<br/>","").replace("<BR />","").replace("<br />","").replace("<br>", "").replace("<Br>","")
}

function mostrarAllPermisos(pestañas, permisos){

    //Traigo el contenedor donde voy a cargar los datos
    let container = document.querySelector("#objetos-menu-grid")
 
    pestañas.forEach( pestaña => {

        //Creo la primer row de pestaña
        var rowtab = document.createElement("div")
        rowtab.setAttribute("class", "row mb-2 rounded")
        rowtab.setAttribute("id", "row-"+limpiar(pestaña.tab))

        //Creo la primer colum
        var columtab1 = document.createElement("div")
        columtab1.setAttribute("class", "col-3 border d-flex justify-content-center align-items-center bg-personalizado mb-1 rounded")
        columtab1.setAttribute("id","pestaña-"+limpiar(pestaña.tab))
        columtab1.innerHTML = `<h5>${pestaña.tab.toUpperCase()}</h5>`

        //Creo la segunda colum
        let columtab2 = document.createElement("div")
        columtab2.setAttribute("class","col-9 rounded")       

        //Agrego los elementos creados
        rowtab.appendChild(columtab1)
        rowtab.appendChild(columtab2)
        container.appendChild(rowtab)     


        pestaña[pestaña.tab].forEach(grupo => {
            
            //Creo la primer row de grupo
            var rowgroup = document.createElement("div")
            rowgroup.setAttribute("class", "row mb-1 rounded border")
            rowgroup.setAttribute("id", "grupo-"+limpiar(pestaña.tab)+"-"+limpiar(grupo.grupo))

            //Creo la primer columna
            var columgroup1 = document.createElement("div")
            columgroup1.setAttribute("class", "col-3 d-flex justify-content-center align-items-center bg-personalizado border rounded")
            //columgroup1.setAttribute("id", "grupo-"+limpiar(pestaña.tab)+"-"+limpiar(grupo.grupo))
            columgroup1.innerHTML = `<h6>${grupo.grupo}</h6>`
            
            //Creo la segunda columna
            let columgroup2 = document.createElement("div")
            columgroup2.setAttribute("class", "col-9 p-0 rounded")          
            
            //Agrego los elementos creados
            columtab2.appendChild(rowgroup)
            rowgroup.appendChild(columgroup1)
            rowgroup.appendChild(columgroup2)


            grupo[grupo.grupo].forEach( item => {

                //Creo el contenedor de permisos
                let permiso = document.createElement("div")
                permiso.setAttribute("class", "d-flex justify-content-between align-items-center bg-white border p-1 px-2 rounded")              
                permiso.setAttribute("id", "permiso-"+item.objetoID)
                
                //Creo el icono
                let icono = document.createElement("img")
                urlicon=item.icono.replace("..", "https://www.solucioneserp.com.ar/net")
                icono.setAttribute("src", urlicon)
                icono.setAttribute("alt", "icono")
                icono.setAttribute("width","20" )
                icono.setAttribute("height","20" )
                icono.setAttribute("class", "mr-2")
            
                //Creo el texto
                let span = document.createElement("span")
                span.innerHTML = limpiarBR(item.elemento)
                //span.setAttribute("class", "text-dark")

                //Creo el input
                let input = document.createElement("input")
                input.setAttribute("value", item.objetoID)
                input.setAttribute("type", "checkbox")
                //obtiene para saber si esta chekeado o no
                let checked = permisos.flag_permisos.find( element => element.objetoID === item.objetoID)   
                input.checked = checked.permiso 

                //Crea div flexible
                let d_flex = document.createElement("div")
                d_flex.setAttribute("class", "d-flex align-items-center")
                d_flex.appendChild(icono)
                d_flex.appendChild(span)
                d_flex.style.width = "30%"
                d_flex.style.minWidth = "260px"

                //Agrega los elementos creados
                permiso.appendChild(d_flex)
                permiso.appendChild(input)
                            
                columgroup2.appendChild(permiso)

            })


        })
    })

    filtrarResultados()
}



function searchForObjetoID(objetoID, json) {
    return json.objetos_menu.find(objeto => objeto.objetoID == objetoID);
  }

function filtrarResultados(){
    
    const divContenedor = document.getElementById('objetos-menu-grid');
    items_permisos = []

    //Habilitados
    let inputSeleccionados = divContenedor.querySelectorAll('input:checked');
    //Inhabilitados
    let inputNoSeleccionados = divContenedor.querySelectorAll('input:not(:checked)');

    //Capturamos los id que nos da el buscador
    objetos_menu.then( data => {
        let objetos = data.objetos_menu.filter(
            (objeto) => limpiarBR(objeto.elemento).toLowerCase().includes(buscador.value.toLowerCase())
        )
    
        //Array de interseccion
        let interseccion;

        if(select_permiso.value == 1){
            //Muestro habilitados
            objetos_menu.then( data => {
                inputSeleccionados.forEach( input => {
                    let item = searchForObjetoID(input.value, data)
                    items_permisos.push(item)
                })
                
                //Filtro de los buscados, con los permisos, y por parametro viaja el grupo
                interseccion = objetos.filter(id => items_permisos.includes(id))
                ocultarAllAndView(interseccion, select_grupo.value)           
            })     
            
        }else{
    
            if(select_permiso.value == -1){
                //Muestro Inhabilitados
                objetos_menu.then( data => {
                    inputNoSeleccionados.forEach( input => {
                        let item = searchForObjetoID(input.value, data)
                        items_permisos.push(item)
                    })

                    //Filtro de los buscados, con los permisos, y por parametro viaja el grupo
                    interseccion = objetos.filter(id => items_permisos.includes(id))
                    ocultarAllAndView(interseccion, select_grupo.value)  

                })
            }else{
                //Muestra todos
                allInput = [...inputSeleccionados, ...inputNoSeleccionados]
                objetos_menu.then( data => {
                    allInput.forEach( input => {
                        let item = searchForObjetoID(input.value, data)
                        items_permisos.push(item)
                    })
                    //Filtro de los buscados, con los permisos, y por parametro viaja el grupo
                    interseccion = objetos.filter(id => items_permisos.includes(id))
                    ocultarAllAndView(interseccion, select_grupo.value)         
                })
            }
        }
    
    }) 
    
}


function ocultarAllAndView(arrayPermisos, filterGrupo){

    objetos_menu.then( data => {
        //Construyo arbol de json
        let arbol = getJsonArbol(data)

        //Ocultamos todo
        arbol.forEach( pestaña => {
            //Ocultamos pestañas
            document.querySelector("#row-"+limpiar(pestaña.tab)).classList.remove("d-flex")
            document.querySelector("#row-"+limpiar(pestaña.tab)).classList.add("d-none")

            pestaña[pestaña.tab].forEach( grupo => {
                //Ocultamos grupos
                document.querySelector("#grupo-"+limpiar(pestaña.tab)+"-"+limpiar(grupo.grupo)).classList.remove("d-flex")
                document.querySelector("#grupo-"+limpiar(pestaña.tab)+"-"+limpiar(grupo.grupo)).classList.add("d-none")
                
                grupo[grupo.grupo].forEach( permiso => {
                    //Ocultamos permisos
                    document.querySelector("#permiso-"+permiso.objetoID).classList.remove("d-flex")
                    document.querySelector("#permiso-"+permiso.objetoID).classList.add("d-none")
                    
                })
                

            })

        })
           

        if(filterGrupo == 'TODOS'){
            //Mostrar los permisos 
            arrayPermisos.forEach( item => {
                document.querySelector("#permiso-"+item.objetoID).classList.remove("d-none")
                document.querySelector("#permiso-"+item.objetoID).classList.add("d-flex")
            
                document.querySelector("#row-"+limpiar(item.tab)).classList.remove("d-none")

                document.querySelector("#grupo-"+limpiar(item.tab)+"-"+limpiar(item.grupo)).classList.remove("d-none")
                document.querySelector("#grupo-"+limpiar(item.tab)+"-"+limpiar(item.grupo)).classList.add("d-flex")
            })
        }else{
            //Solo mostramos los filtrados por grupo
            arrayPermisos.forEach( item => {
                if(item.tab == filterGrupo){
                    document.querySelector("#permiso-"+item.objetoID).classList.remove("d-none")
                    document.querySelector("#permiso-"+item.objetoID).classList.add("d-flex")
                
                    document.querySelector("#row-"+limpiar(item.tab)).classList.remove("d-none")

                    document.querySelector("#grupo-"+limpiar(item.tab)+"-"+limpiar(item.grupo)).classList.remove("d-none")
                    document.querySelector("#grupo-"+limpiar(item.tab)+"-"+limpiar(item.grupo)).classList.add("d-flex")
                }
            })
        }
        
        //Traigo el contenedor donde voy a cargar los datos
        let result = verificarClassDisplayNone(document.querySelector("#objetos-menu-grid"),'d-none')
        if(result){
            document.querySelector("#search-false-permisos").classList.remove("d-none")
        }else{
            document.querySelector("#search-false-permisos").classList.add("d-none")
        }
        


    })

}


//Verificar el display de todas las pestañass
function verificarClassDisplayNone(container, clase) {
    const hijos = container.children;
  
    for (let i = 0; i < hijos.length; i++) {
      if (!hijos[i].classList.contains(clase)) {
        return false;
      }
    }
  
    return true;
  }

function guardar(){
    //Creamos spinners
    document.getElementById('loader').classList.remove('d-none')

    //Captura container
    let divContenedor = document.getElementById('objetos-menu-grid');

    //Captura id grupo de usuario
    let id_usuario = document.querySelector('#grupo-usuarios').value;
    
    let objetos_permisos = []

    // Obtener todos los input no seleccionados dentro del div
    let inputNoSeleccionados = divContenedor.querySelectorAll('input:not(:checked)');
    inputNoSeleccionados.forEach( input => {
        objetos_permisos.push({
            "objetoID":input.value,
            "permiso":false
        })
    } )


    // Obtener todos los input seleccionados dentro del div
    let inputSeleccionados = divContenedor.querySelectorAll('input:checked');
    inputSeleccionados.forEach( input => {
        objetos_permisos.push({
            "objetoID":input.value,
            "permiso":true
        })
    } )


    //Llamada a la api
    fetch( soluciones+"/utilidades/permisosmenu/grabar_permisos", {
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "grupoId":id_usuario,
            "objetos_permisos": objetos_permisos
        })
    })
    .then( response => response.json())
    .then( data => {
        
        //Limpia el contenedor
        divContenedor.innerHTML = ''
    
        objetos_menu.then(objetos => {
            
            //Obtenemos todos los id
            let objetosID = getArregloObjetoID(objetos)
            
            //Capturamos id del grupo de usuario
            let id_usuario = document.querySelector("#grupo-usuarios").value

            //Flag de permisos
            let flag_permisos = getFlagPermisos(id_usuario, objetosID)
            
            //Resolvemos la promesa
            flag_permisos.then( flags => {
        
                let arbol = getJsonArbol(objetos)
                mostrarAllPermisos(arbol, flags)  

                
                alert(data.descripcion)

                //Cerramos sppiner luego de que se de aceptar
                document.getElementById('loader').classList.add('d-none')
            })
            

            
        })

        
        
    })
}


//Funcion por la que comienza la ejecucion 
function loadPage(){
    
    //Promise grupo_usuarios
    grupo_usuarios = getGrupoUsuarios()

    //Promise de objetos_menu
    objetos_menu = getObjetosMenu()

    //Aca comienza la ejecucion
    if ( token ) {

        objetos_menu.then( data => {
            var tabs = getArregloTabs(data)
            cargarSelectGrupos(tabs)

            var objetosID = getArregloObjetoID(data)
            //console.log(objetosID)

            var jsonArbol = getJsonArbol(data)
            //console.log(jsonArbol)

            renderHTML(objetosID)
        })

    }

}


//**************** EVENTOS **************************

let button_actualizar = document.querySelector("#actualizar-permisos-menu")
button_actualizar.addEventListener("click", actualizar)


let select_usuarios = document.querySelector("#grupo-usuarios") 
select_usuarios.addEventListener("change", () => {
    
    objetos_menu.then( data => {   
        var objetosID = getArregloObjetoID(data)
        renderHTML(objetosID)
    })

})


let select_grupo = document.querySelector("#id-pestañas")
select_grupo.addEventListener("change", filtrarResultados)


let select_permiso = document.querySelector("#id-permisos")
select_permiso.addEventListener("change", filtrarResultados)


let buscador = document.querySelector("#search-permiso")
buscador.addEventListener("input", filtrarResultados)


let reset = document.querySelector("#reset")
reset.addEventListener("click", () => {
    buscador.value = ""
    filtrarResultados()
})

let button_guardar = document.querySelector("#guardar-permisos-menu")
button_guardar.addEventListener("click", guardar)