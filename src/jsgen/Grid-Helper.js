// Objeto para tabla del plugin Grid AG.
export const ag_grid_locale_es = {
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

export function comparafecha(filterLocalDateAtMidnight, cellValue) {
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
export function dateComparator(date1, date2) {
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
export function _monthToNum(date) {
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
export function getParams() {
  return {
    skipPinnedBottom: true,
  };
}

export function filterChangedd(FilterChangedEvent) {
    let pinnedBottomData = generatePinnedBottomData();
    gridOptions.api.setPinnedBottomRowData([pinnedBottomData]);
}