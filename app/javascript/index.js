const initIndex = () => {
// this function gets data from the rows and cells
// within an html tbody element
    const table2data = (tableBody) => {
        const tableData = []; // create the array that'll hold the data rows
        tableBody.querySelectorAll('tr')
            .forEach(row => {  // for each table row...
                const rowData = [];  // make an array for that row
                row.querySelectorAll('td')  // for each cell in that row
                    .forEach(cell => {
                        rowData.push(cell.innerHTML);  // add it to the row data
                    })
                tableData.push(rowData);  // add the full row to the table data
            });
        return tableData;
    }

// this function puts data into an html tbody element
    const data2table = (tableBody, tableData) => {
        tableBody.querySelectorAll('tr') // for each table row...
            .forEach((row, i) => {
                const rowData = tableData[i]; // get the array for the row data
                row.querySelectorAll('td')  // for each table cell ...
                    .forEach((cell, j) => {
                        cell.innerHTML = rowData[j]; // put the appropriate array element into the cell
                    })
            });
    }

    const isNumeric = (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    const compareTableData = (a, b, sortAscending = true) => {
        let comparatorA = a;
        let comparatorB = b;
        if (isNumeric(a)) {
            comparatorA = parseFloat(a);
            comparatorB = parseFloat(b);
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
            if (cellValue > curValue) {
                $(row).removeClass('hidden-row');
            } else {
                $(row).addClass('hidden-row');
            }
            return
        }
        if (cellValue < curValue) {
            $(row).removeClass('hidden-row');
        } else {
            $(row).addClass('hidden-row');
        }
    }

    const filterTable = (table, colNum, id, isMinFilter=true) => {
        const curValueRaw = $(`#${id}`).val();
        const curValue = isNumeric(curValueRaw) ? parseFloat(curValueRaw) : 0;
        if (curValue === 0) {
            return;
        }
        $('#listings-table-body tr').each(function() {
            const rowChild = $(this).children()[colNum];
            var cellValue = parseInt($(rowChild).text());
            getFilterComparison(cellValue, curValue, this, isMinFilter);
        })
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