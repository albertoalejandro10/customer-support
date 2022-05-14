import { getParameter, format_number, numbersOnly } from "../../jsgen/Helper"
import { ag_grid_locale_es, comparafecha, dateComparator, getParams, filterChangedd } from "../../jsgen/Grid-Helper"

// Boton exportar grilla
const btn_export = document.getElementById("btn_export")
btn_export.onclick = function() {
    gridOptions.api.exportDataAsCsv(getParams())
}

const localeText = ag_grid_locale_es;

const gridOptions = {
    headerHeight: 35,
    rowHeight: 30,
    defaultColDef: {
        editable: false,
        resizable: true,  
        suppressNavigable: true, 
        //minWidth: 100,                      
    },
    onFilterChanged: event => filterChangedd(event),
    suppressExcelExport: true,
    popupParent: document.body,
    localeText: localeText,

    columnDefs: [
        {
            width: 85,
            headerName: "Fecha",
            field: "fecha",
            sortable: true,
            filter: true,
            filter: 'agDateColumnFilter',                    
            comparator: dateComparator,
            filterParams: {
                // provide comparator function
                comparator: comparafecha
            }   
        },
        {
            width: 145, 
            field: "comprobante", 
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)== "null")
                    return "<b>Totales</b>"
                else
                    if (params.value=='Saldo Inicial')
                        return params.value
                    else
                        return '<a href="" onclick="window.open(\'' + params.data.linkComprobante + '\', \'newwindow\', \'width=800,height=800\');return false;" target="_blank">'+ params.value +'</a>'
            }
        },
        { 
            flex: 1, headerName: "Cliente",
            field: "nombre",
            sortable: true,
            filter: true ,
            cellRenderer: function(params) {
                if (String(params.data)=="null")
                    return ''
                else
                    return params.value
            }
        },
        {   
            width: 30, 
            headerName: "", 
            field: "linkComprobante",
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + params.value + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-solid fa-file-lines"></i></a>'
            }
        },
        {   
            width: 30, 
            headerName: "", 
            field: "linkAsiento",
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + params.value + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-regular fa-folder-open"></i></a>'
            }
        },
        {   
            width: 30, 
            headerName: "", 
            field: "linkAdjuntos",
            cellRenderer: function(params) {
                if (String(params.value) == "null")
                    return ""
                else
                    return '<a href="" onclick="window.open(\'' + params.value + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-solid fa-arrows-spin"></i></a>'
            }
        },
        {
            width: 130,
            field: "Ejercicio", 
            cellRenderer: function(params) {
                if (String(params.data)=="null")
                    return ''
                else
                    return params.value
            }
        },
        {
            width: 100, 
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            field: "neto", 
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {
            width: 100, 
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            field: "iva", 
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {   
            width: 100, 
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            field: "noGravado",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return format_number(params.value)
            }
        },
        {   
            width: 100, 
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            field: "importe",
            sortable: true, 
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)=="null")
                    return ""
                else
                    return format_number(params.value)
            }
        }
    ],

    rowData: [],
};

document.addEventListener('DOMContentLoaded', () => {
const gridDiv = document.querySelector('#myGrid');
new agGrid.Grid(gridDiv, gridOptions);

if ((parseInt($(window).height()) - 300) < 200)
    $("#myGrid").height(100);
else
    $("#myGrid").height(parseInt($(window).height()) - 340);
});

function generatePinnedBottomData(){
    // generate a row-data with null values
        let result = {};

        gridOptions.api.columnModel.gridColumns.forEach(item => {
            result[item.colId] = null;
        });
        return calculatePinnedBottomData(result);
}

function calculatePinnedBottomData(target){
    //console.log(target);
    //**list of columns fo aggregation**

    let columnsWithAggregation = ['neto', 'iva', 'noGravado', 'importe']
    columnsWithAggregation.forEach(element => {
        //console.log('element', element);
        gridOptions.api.forEachNodeAfterFilter((rowNode) => {                  
            if (rowNode.data[element])
                target[element] += Number(rowNode.data[element].toFixed(2));
        });
        if (target[element])
            target[element] = `${target[element].toFixed(2)}`;                

    })
    //console.log(target);
    return target;
}

const get_salesDocs = (tkn, data) => {
    const url_getPendingCharges = 'https://www.solucioneserp.net/reportes/consultas/get_documentos_ventas'
    fetch( url_getPendingCharges , {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tkn}`
        },
        body: JSON.stringify(data)
    })
    .then( resp => resp.json() )
    .then( ({ linea }) => {
        // console.log( linea )
        //clear Filtros
        gridOptions.api.setFilterModel(null);

        //Clear Grilla
        gridOptions.api.setRowData([]);

        const res = gridOptions.api.applyTransaction({
            add: linea            
          });
        
        let pinnedBottomData = generatePinnedBottomData();
        gridOptions.api.setPinnedBottomRowData([pinnedBottomData]);        

    })
    .catch( err => {
        console.log( err )
    })
}

const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    const voucher = Number(formData.get('voucher'))
    const periodStart = formData.get('periodStart').split('-').reverse().join('/')
    const periodEnd = formData.get('periodEnd').split('-').reverse().join('/')
    let numberDocs = Number(formData.get('number-docs'))
    if ( ! numberDocs ) {
        numberDocs = ''
    }
    let numberSeats = Number(formData.get('number-seats'))
    if ( ! numberSeats ) {
        numberSeats = ''
    }
    const cuit = Number(formData.get('cuit'))
    let salePoint = formData.get('sale-point')
    if ( ! salePoint ) {
        salePoint = '0000'
    }
    let letter = formData.get('letter')
    if ( ! letter ) {
        letter = ''
    }
    const business = Number(formData.get('business'))
    const clientGroup = Number(formData.get('client-group'))

    // console.log(voucher, numberSeats, business, periodStart, periodEnd, cuit, clientGroup, numberDocs, salePoint, letter)
    const data = {
        "comprobante": voucher,
        "fechaDesde": periodStart,
        "fechaHasta": periodEnd,
        "nroDocumento": numberDocs,
        "nroAsiento": numberSeats,
        "cliente": cuit,
        "ptoVta": salePoint,
        "letra": letter,
        "unidadNegocio": business,
        "grupoCliente": clientGroup
    }
    // console.table( data )
    get_salesDocs( tkn, data )
})

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    // console.log(' Ok ')
}

const numberDocsElement = document.getElementById('number-docs')
numberDocsElement.addEventListener('keyup', () => {
    numberDocsElement.value = numbersOnly(numberDocsElement.value)
})

const numberSeatsElement = document.getElementById('number-seats')
numberSeatsElement.addEventListener('keyup', () => {
    numberSeatsElement.value = numbersOnly(numberSeatsElement.value)
})

const salePointElement = document.getElementById('sale-point')
salePointElement.addEventListener('keyup', () => {
    salePointElement.value = numbersOnly(salePointElement.value)
})