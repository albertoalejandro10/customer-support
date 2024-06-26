import { getParameter } from "../../jsgen/Helper"

let editor = document.getElementById('editor')
CKEDITOR.ClassicEditor.create(editor, {
    // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
    toolbar: {
        items: [
            'exportPDF', '|',
            'findAndReplace', 'selectAll', '|',
            'heading', '|',
            'bold', 'italic', 'strikethrough', 'underline', 'removeFormat', '|',
            'bulletedList', 'numberedList', '|',
            'outdent', 'indent', '|',
            'undo', 'redo', '|', 'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
            'alignment', '|',
            'link', 'blockQuote', 'insertTable', '|',
            'specialCharacters', 'horizontalLine', 'pageBreak', '|',
            // 'sourceEditing'
        ],
        shouldNotGroupWhenFull: true
    },
    // Changing the language of the interface requires loading the language file using the <script> tag.
    // language: 'es',
    list: {
        properties: {
            styles: true,
            startIndex: true,
            reversed: true
        }
    },
    // https://ckeditor.com/docs/ckeditor5/latest/features/headings.html#configuration
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
            { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
            { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
            { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
        ]
    },
    // https://ckeditor.com/docs/ckeditor5/latest/features/editor-placeholder.html#using-the-editor-configuration
    placeholder: '',
    // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-family-feature
    fontFamily: {
        options: [
            'default',
            'Arial, Helvetica, sans-serif',
            'Courier New, Courier, monospace',
            'Georgia, serif',
            'Lucida Sans Unicode, Lucida Grande, sans-serif',
            'Tahoma, Geneva, sans-serif',
            'Times New Roman, Times, serif',
            'Trebuchet MS, Helvetica, sans-serif',
            'Verdana, Geneva, sans-serif'
        ],
        supportAllValues: true
    },
    // https://ckeditor.com/docs/ckeditor5/latest/features/font.html#configuring-the-font-size-feature
    fontSize: {
        options: [ 10, 12, 14, 'default', 18, 20, 22 ],
        supportAllValues: true
    },
    // Be careful with the setting below. It instructs CKEditor to accept ALL HTML markup.
    // https://ckeditor.com/docs/ckeditor5/latest/features/general-html-support.html#enabling-all-html-features
    htmlSupport: {
        allow: [
            {
                name: /.*/,
                attributes: true,
                classes: true,
                styles: true
            }
        ]
    },
    // Be careful with enabling previews
    // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
    htmlEmbed: {
        showPreviews: true
    },
    // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
    link: {
        decorators: {
            addTargetToExternalLinks: true,
            defaultProtocol: 'https://',
            toggleDownloadable: {
                mode: 'manual',
                label: 'Downloadable',
                attributes: {
                    download: 'file'
                }
            }
        }
    },
    // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
    mention: {
        feeds: [
            {
                marker: '@',
                feed: [
                    '@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
                    '@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
                    '@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
                    '@sugar', '@sweet', '@topping', '@wafer'
                ],
                minimumCharacters: 1
            }
        ]
    },
    removePlugins: [
        'RealTimeCollaborativeComments',
        'RealTimeCollaborativeTrackChanges',
        'RealTimeCollaborativeRevisionHistory',
        'PresenceList',
        'Comments',
        'TrackChanges',
        'TrackChangesData',
        'RevisionHistory',
        'Pagination',
        'WProofreader',
    ]
})
.then( newEditor => {
    editor = newEditor
})
.catch( error => {
    console.error( error )
});

let id = getParameter('id')
const tkn = getParameter('tkn')
if (!id) document.getElementById('delete').disabled = true

const notices = (avisoId, tkn) => {
    const url_getNotices = process.env.Solu_externo + '/maestros/clientes/get_avisoId'
    fetch( url_getNotices , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            avisoId,
        })
    })
    .then( notices => notices.json() )
    .then( ({avisoDatos, resultado}) => {
        const { aviso, titulo, mensaje, tipoEnvioId, condicionId, valor, grupoClienteId, tipoClienteId, adjunto } = avisoDatos
        if ( resultado === 'ok' ) {
            const name = document.getElementById('name')
            name.value = aviso
            name.readOnly = true
            document.getElementById('matter').value = titulo
            document.getElementById('shipping-type').value = tipoEnvioId
            document.getElementById('condition').value = condicionId
            document.getElementById('value-x').value = valor
            document.getElementById('customer-group').value = grupoClienteId
            document.getElementById('customer-types').value = tipoClienteId
            document.getElementById('attach').value = adjunto

            //Bloque el input de tipo envio para que solo sea de lectura
            document.getElementById('shipping-type').setAttribute("disabled","true")

            //Y si es tipo WSP el texto es de solo lectura
            if(getParameter('tipoEnvioId') == 2){
                //WhatsApp
                document.querySelector("#area-email").classList.add("d-none")
                document.querySelector("#area-wsp").classList.remove("d-none")
                document.querySelector("#wsp-msg").value = mensaje
                document.querySelector("#wsp-msg").setAttribute("disabled","true")
                document.querySelector("#matter").setAttribute("disabled","true")
                document.querySelector("#attach").setAttribute("disabled","true")
            }else{
                editor.setData(mensaje)
            }
            

        }
    })
}

if ( id ) {
    notices(id, tkn)
}

// Method post - Delete servicioid
const deleteNotice = document.getElementById('delete')
deleteNotice.onclick = () => {
    const result = confirm('¿Esta seguro?')
    if ( !result ) return
    const url_deleteNotice = process.env.Solu_externo + '/maestros/clientes/guardar_aviso'
    fetch( url_deleteNotice, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify({
            "avisoId": id,
            "accion": "DEL"
        })
    })
    .then( resp => resp.json() )
    .then( ({ resultado, mensaje}) => {
        alert(`${resultado} - ${mensaje}`)
        location.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAvisos.html?tkn=${tkn}`
    })
    .catch( err => {
        console.log( err )
    })
}

const backToList = document.getElementById('backToList')
backToList.onclick = () => {

    if(cambios_en_el_form==false){
        //No hubieron cambios => redirigo directamente
        location.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAvisos.html?tkn=${tkn}`
    }else{

        if (confirm("Tienes cambios no guardados. ¿ Desea regresar ?") === true) {
            location.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAvisos.html?tkn=${tkn}`
        }

    }

}

// Grabar aviso
const $form = document.querySelector('#form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const aviso = formData.get('name')
    const titulo = formData.get('matter')
    const tipoEnvioId = Number(formData.get('shipping-type'))
    const grupoClienteId = Number(formData.get('customer-group'))
    const tipoClienteId = Number(formData.get('customer-types'))
    const condicionId = Number(formData.get('condition'))
    const valor = Number(formData.get('value-x'))
    const adjunto = formData.get('attach')

    //Aca iría el WSP o EMAIL
    let mensaje;
    if(document.querySelector("#shipping-type").value == 1){
        mensaje = editor.getData()
    }else{
        mensaje = document.querySelector("#wsp-msg").value
    }
    
    if ( ! id ) id = 0
    const data = {
        avisoId: id,
        "avisoDatos": {
            aviso,
            titulo,
            mensaje,
            tipoEnvioId,
            grupoClienteId,
            tipoClienteId,
            condicionId,
            valor,
            adjunto
        },
        accion: "ADD"
    }
    // console.log(data)
    addNotice(data)
})

const addNotice = data => {
    const url_addNotice = process.env.Solu_externo + '/maestros/clientes/guardar_aviso'
    fetch( url_addNotice , {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        }
    })
    .then( resp => resp.json() )
    .then( ({ resultado, mensaje}) => {
        // console.log(resultado, mensaje)
        alert(`${resultado} - ${mensaje}`)
        location.href = window.location.protocol + '//' + window.location.host + process.env.VarURL + `/Clientes/EnvioAvisos.html?tkn=${tkn}`
    })
    .catch( err => {
        console.log( err )
    })   
}




//DESARROLLO ISMA - Cambios en el formulario
const formulario = document.querySelector("#form")
let cambios_en_el_form = false;

//Evento
formulario.addEventListener('input', function () {
    // Se ha detectado un cambio en el formulario
    cambios_en_el_form = true;
});