//URL
//const localhost = "https://localhost:44342";
//const soluciones = "'https://www.solucioneserp.net'";

//Captura el token de la URL
const parameters = new URLSearchParams(window.location.search)
const token = parameters.get('tkn')


//Descargar TXT
function dowlandTxtFile(content,filename){
    console.log(content)
    let dowland = document.querySelector("#dowland-retencionesIIBB")
    dowland.setAttribute("href",'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    dowland.setAttribute('download', filename);
}

//Consume API
function getRetenciones(periodStart, periodEnd){
    const url = process.env.Solu_externo+'/legales/retenciones_iibb_cba'
    fetch(url,{
        method : 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "fdesde":periodStart,
            "fhasta": periodEnd
        })
    })
    .then(response => response.text())
    .then( data => {
        
        if(data.includes("Error")){
            alert(data)
            document.querySelector("#loader").classList.add("d-none")
            //Ocultamos la opcion para descargar txt
            document.querySelector("#body-dowland").classList.add("d-none")
        }else{
            //Mostramos la opcion para descargar txt
            document.querySelector("#body-dowland").classList.remove("d-none")
            dowlandTxtFile(data, 'Retenciones_IIBB_CBA.txt')

            document.querySelector("#loader").classList.add("d-none")
        }
        //Decodificar bytes de datos
        //let uint8Array = new Uint8Array(data);            // Convertir el ArrayBuffer a un Uint8Array
        //let text = new TextDecoder().decode(uint8Array);  // Convertir el Uint8Array a una cadena de texto

        //console.log("Texto decodificado: ", text)      
        
    })
}

//Comienza la ejecucion
if(token){
    //Eventos
    const form = document.querySelector("#form-retenciones")

    form.addEventListener('submit', function(event){
        //Evitar el envio por defecto del formulario
        event.preventDefault();

        //Mostramos loader
        document.querySelector("#loader").classList.remove("d-none")

        //Captura fechas ingresadas y formatea
        const formData = new FormData(form)
        let fdesde = formData.get('periodStart')
        let fhasta = formData.get('periodEnd')
        
        getRetenciones(fdesde, fhasta)
   
    })
}