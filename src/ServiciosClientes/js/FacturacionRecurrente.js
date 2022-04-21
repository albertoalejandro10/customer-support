import { getParameter, format_number, ag_grid_locale_es } from "../../jsgen/getParameters"

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
            width: 160, 
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
            width: 160, 
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
            width: 160, 
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            field: "total",
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

    if ((parseInt($(window).height()) - 300) < 200) {
        $("#myGrid").height(100);
    } else {
        $("#myGrid").height(parseInt($(window).height()) - 500);
    }
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
        // gridOptions.api.setFilterModel(null);

        //Clear Grilla
        // gridOptions.api.setRowData([]);

        // const res = gridOptions.api.applyTransaction({
        //     add: linea            
        //   });
        
        // let pinnedBottomData = generatePinnedBottomData();
        // gridOptions.api.setPinnedBottomRowData([pinnedBottomData]);        

    })
    .catch( err => {
        console.log( err )
    })
}

// Obtener el valor de la opcion seleccionada por el usuario
const selectTypeGroup = document.getElementById('group-client')
selectTypeGroup.addEventListener('change', event => {
    if ( event.currentTarget.options[selectTypeGroup.selectedIndex].value === "1" ) return visibleInput('clientCode')
    if ( event.currentTarget.options[selectTypeGroup.selectedIndex].value === "2" ) return visibleInput('generatedFor')
})

// Remover clase d-none de precio neto y % descuento.
const clientCode = document.getElementsByClassName('client-code')
const generatedFor = document.getElementById('generated-for')
const visibleInput = type => {
    if ( type === 'clientCode') {
        for ( const element of clientCode ) {
            element.classList.remove('d-none')
            generatedFor.classList.add('d-none')
        }
    }

    if ( type === 'generatedFor') {
        generatedFor.classList.remove('d-none')
        let i = 0
        do {
            clientCode[i].classList.add('d-none')
            i++
        } while ( i < clientCode.length )        
    }
}

document.getElementById("search-code").onclick = () => {
    console.log('Ok')
}

const $form = document.getElementById('form')
document.getElementById("generate").addEventListener("click", event => {
    event.preventDefault()
    const formData = new FormData()

    console.log( formData )
})

// $form.addEventListener('submit', event => {
//     event.preventDefault()
//     const formData = new FormData(event.currentTarget)

//     const data = {

//     }
//     // console.table( data )
//     get_salesDocs( tkn, data )
// })