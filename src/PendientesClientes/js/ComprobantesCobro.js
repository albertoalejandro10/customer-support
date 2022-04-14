import * as bootstrap from 'bootstrap'

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

const checkboxExpiration = document.getElementById('checkboxExpiration')
checkboxExpiration.addEventListener('change', event => {
    const expiration = document.getElementById('expiration')
    if ( event.currentTarget.checked ) {
        expiration.required = true
        expiration.disabled = false
        expiration.value = (new Date().toLocaleDateString('en-GB')).split('/').reverse().join('-')
    } else {
        expiration.disabled = true
        expiration.required = false
        expiration.value = ''
    }
})

document.querySelectorAll('input').forEach(element => {
    element.addEventListener('change', () => {
        //update.disabled = false
    })
})

document.querySelectorAll('select').forEach(element => {
    element.addEventListener('change', () => {
        //update.disabled = false
    })
})

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
element.onclick = function(event) {
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
                { width: 85, headerName: "Venc.", field: "vencimiento", sortable: true, filter: true,
                    filter: 'agDateColumnFilter',                    
                    comparator: dateComparator,
                    filterParams: {
                        // provide comparator function
                        comparator: comparafecha
                    }   
                },
                { width: 85, field: "fecha", sortable: true, filter: true, 
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
                            return ""
                        else
                            if (params.value=='Saldo Inicial')
                                return params.value
                            else
                                return '<a href="" onclick="window.open(\'' + params.data.linkComprobante + '\', \'newwindow\', \'width=800,height=800\');return false;" target="_blank">'+ params.value +'</a>'
                    }
                },
                { flex: 1, headerName: "Cliente", field: "nombre", sortable: true, filter: true ,
                    cellRenderer: function(params) {
                    if (String(params.value) == "null")
                        return "<b>Total</b>"
                    else
                        return params.value
                    }
                },

                { flex: 2, field: "observacion", sortable: true, filter: true  },
                {   
                    width: 30, 
                    headerName: "", 
                    field: "linkAdjuntos", 
                    cellRenderer: function(params) {
                        if (String(params.value) == "null")
                            return ""
                        else
                            return '<a href="" onclick="window.open(\'' + params.value + '\', \'newwindow\', \'width=600,height=600\');return false;" target="_blank"><i class="fa-solid fa-folder"></i></a>'
                    }

                },
                {   width: 115, 
                    headerClass: "ag-right-aligned-header", 
                    cellClass: 'ag-right-aligned-cell',
                    headerName: "Importe", 
                    field: "total", 
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
                    width: 115, 
                    headerClass: "ag-right-aligned-header", 
                    cellClass: 'ag-right-aligned-cell',
                    field: "pendiente", 
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
            

            let columnsWithAggregation = ['pendiente']
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

const get_pendingCharges = (tkn, data) => {
    const url_getPendingCharges = 'https://www.solucioneserp.net/reportes/clientes/get_comprobantes_pendientes_cobro'
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
        //clear Filtros
        gridOptions.api.setFilterModel(null);

        //Clear Grilla
        gridOptions.api.setRowData([]);

        const res = gridOptions.api.applyTransaction({
            add: linea            
          });
        
        let pinnedBottomData = generatePinnedBottomData();
        gridOptions.api.setPinnedBottomRowData([pinnedBottomData]);        
        
        //// Eliminar filas viejas
        // const tbody = document.getElementById('tbody')
        // const elements = document.getElementsByClassName('delete-row')
        // if ( tbody.children.length >= 1) {
        //     while (elements.length > 0) elements[0].remove()
        //     let importe = document.getElementById('importeTotal')
        //     importe.textContent = ''
        // }

        // for (const element of linea) {
        //     const { id, comprobante, fecha, codigoCliente, nombre, total, estado, debe, pendiente, cuit, vencimiento, observacion, sucursal, vencimientoOrden, cantidad, conProforma, telefono, tipoCliente, grupoCliente, moneda, importeNeto, importeIva, importeNoGravado, importePercepcion, tipoProducto, linkComprobante, linkAdjuntos } = element
        //     // console.log( id, vencimiento, fecha, comprobante, nombre, observacion, linkComprobante, linkAdjuntos, importeNeto, pendiente )

        //     // Imprimir datos en la tabla
        //     let row = document.createElement('tr')
        //     row.className = 'delete-row'

        //     let row_data_1 = document.createElement('td')
        //     row_data_1.textContent = `${ vencimiento }`

        //     let row_data_2 = document.createElement('td')
        //     row_data_2.textContent = `${fecha}`

        //     let row_data_3 = document.createElement('td')
        //     let row_data_3_anchor = document.createElement('a')
        //     //row_data_3_anchor.href = `${linkComprobante}`
        //     row_data_3_anchor.textContent = `${comprobante}`
        //     if (comprobante!='Saldo Inicial')
        //     {
        //         row_data_3_anchor.style="color: #60C1DD; text-decoration: none; cursor:pointer;"    
            
        //         row_data_3_anchor.addEventListener('click', function handleClick(event) {
        //             window.open(linkComprobante, "comprobante", "width=600,height=700"); 
        //             return false;                
        //         });
        //     }
        //     row_data_3.appendChild(row_data_3_anchor)

        //     let row_data_4 = document.createElement('td')
        //     row_data_4.textContent = `${nombre}`

        //     let row_data_5 = document.createElement('td')
        //     row_data_5.textContent = `${observacion}`

        //     let row_data_6 = document.createElement('td')
        //     let row_data_6_anchor = document.createElement('a')
        //     //row_data_6_anchor.target="_blank"
        //     //row_data_6_anchor.href = ""//linkAdjuntos
        //     row_data_6_anchor.style="color: #60C1DD; text-decoration: none; cursor:pointer;"    
        //     row_data_6_anchor.addEventListener('click', function handleClick(event) {
        //         window.open(linkAdjuntos, "documentos", "width=922,height=502"); 
        //         return false;                
        //       });

        //     //row_data_6_anchor.onclick = 'window.open("' + linkAdjuntos + '", "newwindow", "width=600,height=600"); return false;'
        //     row_data_6_anchor.innerHTML = '<i class="fa-solid fa-folder"></i>'
        //     row_data_6.appendChild(row_data_6_anchor)

        //     let row_data_7 = document.createElement('td')
        //     row_data_7.textContent = `${format_number(importeNeto)}`

        //     let row_data_8 = document.createElement('td')
        //     row_data_8.textContent = `${format_number(pendiente)}`
            
        //     row.appendChild(row_data_1)
        //     row.appendChild(row_data_2)
        //     row.appendChild(row_data_3)
        //     row.appendChild(row_data_4)
        //     row.appendChild(row_data_5)
        //     row.appendChild(row_data_6)
        //     row.appendChild(row_data_7)
        //     row.appendChild(row_data_8)
            
        //     tbody.appendChild(row)

        //     // Calcular e imprimir importeTotal
        //     calcularImporteTotal( pendiente )
        //     const  style = {
        //         minimumFractionDigits: 2,
        //         useGrouping: true
        //     }
        //     const formatter = new Intl.NumberFormat("de-DE", style)

        //     let importe = document.getElementById('importeTotal')
        //     importe.textContent = formatter.format( importeTotal )
        // }
        // importeTotal = 0
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

// Calcular importe total
let importeTotal = 0
const calcularImporteTotal = importe => {
    importeTotal += importe
    return importeTotal
}

// Conseguir parametros del URL
export const getParameter = parameterName => {
    const parameters = new URLSearchParams( window.location.search )
    return parameters.get( parameterName )
}
    
const tkn = getParameter('tkn')
//const update = document.getElementById('update')

const $form = document.getElementById('form')
$form.addEventListener('submit', event => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    //alert($(".cmb_clientes").val());

    const business = Number(formData.get('business'))
    const periodStart = formData.get('periodStart').split('-').reverse().join('/')
    const periodEnd = formData.get('periodEnd').split('-').reverse().join('/')
    const expirationCheckbox = formData.get('expirationCheckbox')
    const expiration = get_expirationDate(formData.get('expiration'))
    const status = formData.get('status')
    const customer = $(".cmb_clientes").val()//formData.get('customer')
    const coin = formData.get('coin')
    if (formData.get('platform')=="on")
        var platform = 1
    else
        var platform = 0

    const data = {
        "idUnidadNegocio": business,
        "fechaDesde": periodStart,
        "fechaHasta": periodEnd,
        "hastaFechaVencimiento": 0,
        "fechaVencimiento": expiration,
        "cuentaEstado": status,
        "codigoCliente": customer,
        "idMoneda": coin,
        "incluirProformas": platform,
        "incluirRemitos": 0
    }

    get_pendingCharges( tkn, data )
    //update.disabled = true
})

const get_expirationDate = expirationValue => {
    let expiration
    if ( expirationValue ) {
        expiration = expirationValue.split('-').reverse().join('/')
    } else {
        expiration = ""
    }
    return expiration
}