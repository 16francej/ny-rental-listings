class TableData {
    constructor(value, visibility) {
        this.value = value;
        this.visibility = visibility;
    }
}


const initIndex = () => {
    let rowVisibilityState = [];

    const setRowVisibility = (shouldShow, row, rowIndex) => {
        const hideElementCssClass = 'hidden-row';
        if (shouldShow) {
            row.removeClass(hideElementCssClass);
        } else {
            row.addClass(hideElementCssClass);
        }
        if (rowVisibilityState.length < rowIndex){
            rowVisibilityState.push(shouldShow);
        } else {
            rowVisibilityState[rowIndex] = shouldShow;
        }
    }

// this function gets data from the rows and cells
// within an html tbody element
    const table2data = (tableBody) => {
        const tableData = []; // create the array that'll hold the data rows
        let i = 0;
        tableBody.querySelectorAll('tr')
            .forEach(row => {  // for each table row...
                const rowData = [];  // make an array for that row
                row.querySelectorAll('td')  // for each cell in that row
                    .forEach(cell => {
                        const shouldShow = rowVisibilityState.length > i ? rowVisibilityState[i] : true;
                        rowData.push(new TableData(cell.innerHTML, shouldShow));
                    })
                tableData.push(rowData);  // add the full row to the table data
                i += 1;
            });
        return tableData;
    }

// this function puts data into an html tbody element
    const data2table = (tableBody, tableData) => {
        let i = -1; // Exclude th
            $('tr').each(function() {
                if (i !== -1) {
                    let j = 0;
                    const rowData = tableData[i];
                    setRowVisibility(rowData[0].visibility, $(this), i)
                    $(this).find('td').each(function () {
                        $(this).html(rowData[j].value);
                        j += 1;
                    });
                }
                i += 1;
            });
    }

    const isNumeric = (n) => {
        const parsedNum = parseFloat(n)
        return !isNaN(parsedNum) && isFinite(n);
    }

    const compareTableData = (a, b, sortAscending = true) => {
        let comparatorA = a.value;
        let comparatorB = b.value;
        if (isNumeric(comparatorA)) {
            comparatorA = parseFloat(comparatorA);
            comparatorB = parseFloat(comparatorB);
        }
        if (comparatorA > comparatorB) {
            return sortAscending ? 1 : -1;
        }
        return sortAscending ? -1 : 1;
    }

    const sortTable = (table, sortColumn) => {
        // get the data from the table cells
        const tableBody = table.querySelector('tbody');
        const tableData = table2data(tableBody);

        const sortAscending = globalColSortState.get(sortColumn);
        // sort the extracted data
        tableData.sort((a, b) => {
            return compareTableData(a[sortColumn], b[sortColumn], sortAscending)
        })
        // put the sorted data back into the table
        data2table(tableBody, tableData);
    }
    const table = document.getElementById("listings-table");
    const tableHeaders = table.querySelectorAll("th");
    let globalColSortState = new Map();
    for (let i = 0; i < tableHeaders.length; i += 1) {
        globalColSortState.set(i, false);
    }
    tableHeaders.forEach((element, colNum) => {
        element.addEventListener('click', event => {
            globalColSortState.set(colNum, !globalColSortState.get(colNum));
            sortTable(table, colNum);
        });
    });

    const filterMinIds = ['minRent'];
    const filterMaxIds = ['maxRent'];

    const filterColMap = new Map();
    filterColMap.set('minRent', 1);
    filterColMap.set('maxRent', 1);

    const getFilterComparison = (cellValue, curValue, row, isMinFilter) => {
        if (isMinFilter) {
            return cellValue > curValue;
        }
        return cellValue < curValue;
    }

    const filterTable = (table, colNum, id, isMinFilter=true) => {
        const curValueRaw = $(`#${id}`).val();
        const curValue = isNumeric(curValueRaw) ? parseFloat(curValueRaw) : 0;
        if (curValue === 0) {
            return;
        }
        let rowIndex = 0;
        $('#listings-table-body tr').each(function() {
            const rowChild = $(this).children()[colNum];
            var cellValue = parseInt($(rowChild).text());
            const shouldShow = getFilterComparison(cellValue, curValue, this, isMinFilter);
            setRowVisibility(shouldShow, $(this), rowIndex);
            rowIndex += 1;
        });
    }

    filterMinIds.forEach((id) => {
        const elementMin = $(`#${id}`);
        const colNum = filterColMap.get(id);
        elementMin.on('input', event => filterTable(table, colNum, id, true));
    })

    filterMaxIds.forEach((id) => {
        const elementMax = $(`#${id}`);
        const colNum = filterColMap.get(id);
        elementMax.on('input', event => filterTable(table, colNum, id, false));
    })
}