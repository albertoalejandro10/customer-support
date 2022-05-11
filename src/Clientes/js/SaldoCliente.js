import { getParameter, format_number, reverseFormatNumber, ag_grid_locale_es } from "../../jsgen/Helper"

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
            width: 120,
            headerName: "CUIT",
            field: "cuit",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)== "null")
                    return ""
                else
                    if (params.value=='Saldo Inicial')
                        return params.value
                    else
                        return '<a href="" onclick="window.open(\'' + params.data.cuit + '\', \'newwindow\', \'width=800,height=800\');return false;" target="_blank">'+ params.value +'</a>'
            }
        },
        {
            flex: 1,
            headerName: "Cliente",
            field: "codigoCliente",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (String(params.value)== "null")
                    return "<b>Total</b>"
                else
                    if (params.value=='Saldo Inicial')
                        return params.value
                    else
                        return params.data.codigoCliente
            }
        },
        {
            width: 120,
            headerName: "Teléfono",
            field: "telefono",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (params.value=='Saldo Inicial')
                    return params.value
                else
                    return params.data.telefono
            }
        },
        {
            width: 120,
            headerClass: "text-center",
            cellClass: 'ag-right-aligned-cell',
            headerName: "Prom. Dias Cobros",
            field: "promoDiasCobros",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (params.value=='Saldo Inicial')
                    return params.value
                else
                    return params.data.promoDiasCobros
            }
        },
        {
            width: 120,
            headerClass: "text-center", 
            cellClass: 'ag-right-aligned-cell',
            headerName: "Prom. Dias Valores",
            field: "promoDiasCobros",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (params.value=='Saldo Inicial')
                    return params.value
                else
                    return params.data.promoDiasValores
            }
        },
        {
            width: 100,
            headerClass: "text-center",
            cellClass: 'ag-center-aligned-cell',
            headerName: "Última venta",
            field: "fecha",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (params.value=='Saldo Inicial')
                    return params.value
                else
                    return params.data.fecha
            }
        },
        {
            width: 120,
            headerClass: "text-center", 
            cellClass: 'ag-center-aligned-cell',
            headerName: "Último Credito",
            field: "ultCredito",
            sortable: true,
            filter: true,
            cellRenderer: function(params) {
                if (params.value=='Saldo Inicial')
                    return params.value
                else
                    return params.data.ultCredito
            }
        },
        {
            width: 100,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            headerName: "Cred. Cheques",
            field: "creditoCheches",
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
            width: 80,
            headerClass: "ag-right-aligned-header", 
            cellClass: 'ag-right-aligned-cell',
            headerName: "Crédito",
            field: "credito", 
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
            headerName: "Saldo Vencido",
            field: "vencido",
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
            headerName: "Saldo Final",
            field: "pendienteTotal",
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

    let columnsWithAggregation = ['vencido', 'pendienteTotal']
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

const get_AccountsBalance = (tkn, data) => {
    const url_getAccountsBalance = 'https://www.solucioneserp.net/reportes/clientes/get_saldo_cuentas_por_cobrar'
    fetch( url_getAccountsBalance , {
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

    const unidadNegocio = Number(formData.get('business'))
    const fechaDesde = formData.get('periodStart').split('-').reverse().join('/')
    const fechaHasta = formData.get('periodEnd').split('-').reverse().join('/')
    const tipoCliente = Number(formData.get('customer-type'))
    const grupoCliente = Number(formData.get('customer-groups'))
    const estado = formData.get('state')
    const cobrador = Number(formData.get('debt-collector'))
    const orden = Number(formData.get('orden-by'))
    const proformas = 0
    const remitos = 0
    const saldoCero = (formData.get('exclude-balances') === 'on') ? 1 : 0

    const data = {
        unidadNegocio,
        fechaDesde,
        fechaHasta,
        tipoCliente,
        grupoCliente,
        estado, 
        cobrador,
        orden,
        proformas,
        remitos,
        saldoCero
    }

    // const data = {
    //     "unidadNegocio": 0,
    //     "fechaDesde": "01/04/2022",
    //     "fechaHasta": "18/04/2022",
    //     "tipoCliente": 0,
    //     "grupoCliente": 0,
    //     "estado": "0",
    //     "cobrador": 0,
    //     "orden": 1,
    //     "proformas": 0,
    //     "remitos": 0,
    //     "saldoCero": 0
    // }
    // console.table( data )
    get_AccountsBalance( tkn, data )
})

// Ejecutar
const tkn = getParameter('tkn')
if ( tkn ) {
    // console.log(' Ok ')
}