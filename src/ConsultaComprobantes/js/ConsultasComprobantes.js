const ag_grid_locale_es = {
    // for filter panel
    page: 'Pagina',
    more: 'Mas',
    to: 'a',
    of: 'de',
    next: 'Siguente',
    last: 'Último',
    first: 'Primero',
    previous: 'Anteror',
    loadingOoo: 'Cargando...',
    
    // for set filter
    selectAll: 'Seleccionar Todo',
    searchOoo: 'Buscar...',
    blanks: 'En blanco',

    // for number filter and text filter
    filterOoo: 'Filtrar',
    applyFilter: 'Aplicar Filtro...',
    equals: 'Igual',
    notEqual: 'No Igual',

    // for number filter
    lessThan: 'Menos que',
    greaterThan: 'Mayor que',
    lessThanOrEqual: 'Menos o igual que',
    greaterThanOrEqual: 'Mayor o igual que',
    inRange: 'En rango de',

    // for text filter
    contains: 'Contiene',
    notContains: 'No contiene',
    startsWith: 'Empieza con',
    endsWith: 'Termina con',

    // filter conditions
    andCondition: 'Y',
    orCondition: 'O',

    // the header of the default group column
    group: 'Grupo',

    // tool panel
    columns: 'Columnas',
    filters: 'Filtros',
    valueColumns: 'Valos de las Columnas',
    pivotMode: 'Modo Pivote',
    groups: 'Grupos',
    values: 'Valores',
    pivots: 'Pivotes',
    toolPanelButton: 'BotonDelPanelDeHerramientas',

    // other
    noRowsToShow: 'No hay filas para mostrar',

    // enterprise menu
    pinColumn: 'Columna Pin',
    valueAggregation: 'Agregar valor',
    autosizeThiscolumn: 'Autoajustar esta columna',
    autosizeAllColumns: 'Ajustar todas las columnas',
    groupBy: 'agrupar',
    ungroupBy: 'desagrupar',
    resetColumns: 'Reiniciar Columnas',
    expandAll: 'Expandir todo',
    collapseAll: 'Colapsar todo',
    toolPanel: 'Panel de Herramientas',
    export: 'Exportar',
    csvExport: 'Exportar a CSV',
    excelExport: 'Exportar a Excel (.xlsx)',
    excelXmlExport: 'Exportar a Excel (.xml)',


    // enterprise menu pinning
    pinLeft: 'Pin Izquierdo',
    pinRight: 'Pin Derecho',


    // enterprise menu aggregation and status bar
    sum: 'Suman',
    min: 'Minimo',
    max: 'Maximo',
    none: 'nada',
    count: 'contar',
    average: 'promedio',

    // standard menu
    copy: 'Copiar',
    copyWithHeaders: 'Copiar con cabeceras',
    paste: 'Pegar',  
    blank: 'Vacia',
    notBlank: 'No Vacia',
}

function comparafecha(filterLocalDateAtMidnight, cellValue) {
    const dateAsString = cellValue;

    if (dateAsString == null) {
        return 0;
    }

    // In the example application, dates are stored as dd/mm/yyyy
    // We create a Date object for comparison against the filter date
    const dateParts = dateAsString.split('/');
    const day = Number(dateParts[0]);
    const month = Number(dateParts[1]) - 1;
    const year = Number(dateParts[2]);
    const cellDate = new Date(year, month, day);

    // Now that both parameters are Date objects, we can compare
    if (cellDate < filterLocalDateAtMidnight) {
        return -1;
    } else if (cellDate > filterLocalDateAtMidnight) {
        return 1;
    }
    return 0;
}

// DATE COMPARATOR FOR SORTING
function dateComparator(date1, date2) {
    var date1Number = _monthToNum(date1);
    var date2Number = _monthToNum(date2);
  
    if (date1Number === null && date2Number === null) {
      return 0;
    }
    if (date1Number === null) {
      return -1;
    }
    if (date2Number === null) {
      return 1;
    }
  
    return date1Number - date2Number;
  }
  
  // HELPER FOR DATE COMPARISON
  function _monthToNum(date) {
    if (date === undefined || date === null || date.length !== 10) {
      return null;
    }
  
    var yearNumber = date.substring(6, 10);
    var monthNumber = date.substring(3, 5);
    var dayNumber = date.substring(0, 2);
  
    var result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
    // 29/08/2004 => 20040829
    return result;
  }

  //Parametros exportacion csv
function getParams() {
  return {
    skipPinnedBottom: true,
  };
}
//boton exportar grilla
var element = document.getElementById("btn_export");
element.onclick = function() {
    gridOptions.api.exportDataAsCsv(getParams());
}

function filterChangedd(FilterChangedEvent) {
    let pinnedBottomData = generatePinnedBottomData();
    gridOptions.api.setPinnedBottomRowData([pinnedBottomData]);
}

var localeText = ag_grid_locale_es;

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
                    return params.data.cliente
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
                    return params.data.ejercicio
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

const format_number = importeNeto => {
    const  style = {
        minimumFractionDigits: 2,
        useGrouping: true
    }
    const formatter = new Intl.NumberFormat("de-DE", style)
    const importe = formatter.format(importeNeto)
    return importe
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

const getParameter = parameterName => {
    const parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    // console.log(' Ok ')
}

const customerElement = document.getElementById('customers')
customerElement.addEventListener('keyup', () => {
    customerElement.value = numbersOnly(customerElement.value)
})

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

const numbersOnly = (string) => {
    var out = '';
    var filtro = '1234567890';//Caracteres validos
	
    //Recorrer el texto y verificar si el caracter se encuentra en la lista de validos 
    for (let i = 0; i < string.length; i++) {
        if ( filtro.indexOf(string.charAt(i)) != -1 ) {
            //Se añaden a la salida los caracteres validos
            out += string.charAt(i);
        }
    }

    //Retornar valor filtrado
    return out
}