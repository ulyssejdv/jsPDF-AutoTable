/*
 |--------------------------------------------------------------------------
 | This file contains examples of how to use this plugin
 |--------------------------------------------------------------------------
 |
 | To see what the pdfs generated by these examples looks like you can open
 | ´examples.html´ or go to http://someatoms.github.io/jsPDF-AutoTable.
 |
 | To make it possible to view each example in examples.html some extra code
 | are added to the examples below. For example they return their jspdf
 | doc instance and gets generated data from the library faker.js. However you
 | can of course use this plugin how you wish and the simplest first example
 | below would look like this without any extras:
 |
 | var columns = ["ID", "Name", "Age", "City"];
 |
 | var data = [
 |     [1, "Jonatan", 25, "Gothenburg"],
 |     [2, "Simon", 23, "Gothenburg"],
 |     [3, "Hanna", 21, "Stockholm"]
 | ];
 |
 | var doc = new jsPDF('p', 'pt');
 | doc.autoTable(columns, data);
 | doc.save("table.pdf");
 |
 */

var examples = {};

// Default - shows what a default table looks like
examples.auto = function () {
    var doc = new jsPDF('p', 'pt');
    doc.autoTable(getColumns(), getData());
    return doc;
};

// Minimal - shows how compact tables can be drawn
examples.minimal = function () {
    var doc = new jsPDF('p', 'pt');
    doc.autoTable(getColumns(), getData(), {
        tableWidth: 'wrap',
        styles: {cellPadding: 2},
        headerStyles: {rowHeight: 15, fontSize: 8},
        bodyStyles: {rowHeight: 12, fontSize: 8, valign: 'middle'}
    });
    return doc;
};

// Long data - shows how the overflow features looks and can be used
examples.long = function () {
    var doc = new jsPDF('l', 'pt');
    var columnsLong = getColumns().concat([
        {title: shuffleSentence(), dataKey: "text"},
        {title: "Text with a\nlinebreak", dataKey: "text2"}
    ]);

    doc.text("Overflow 'ellipsize' (default)", 10, 40);
    doc.autoTable(columnsLong, getData(), {
        startY: 55,
        margin: {horizontal: 10},
        columnStyles: {email: {columnWidth: 160}}
    });

    doc.text("Overflow 'hidden'", 10, doc.autoTableEndPosY() + 30);
    doc.autoTable(columnsLong, getData(), {
        startY: doc.autoTableEndPosY() + 45,
        margin: {horizontal: 10},
        styles: {overflow: 'hidden'},
        columnStyles: {email: {columnWidth: 160}}
    });

    doc.text("Overflow 'linebreak'", 10, doc.autoTableEndPosY() + 30);
    doc.autoTable(columnsLong, getData(3), {
        startY: doc.autoTableEndPosY() + 45,
        margin: {horizontal: 10},
        styles: {overflow: 'linebreak'},
        bodyStyles: {valign: 'top'},
        columnStyles: {email: {columnWidth: 'wrap'}},
    });

    return doc;
};

// Content - shows how tables can be integrated with any other pdf content
examples.content = function () {
    var doc = new jsPDF({unit: 'pt', lineHeight: 1.5, orientation: 'p'});

    doc.setFontSize(18);
    doc.text('A story about Miusov', 40, 60);
    doc.setFontSize(11);
    doc.setTextColor(100);
    var text = doc.splitTextToSize(shuffleSentence(faker.lorem.words(55)) + '.', doc.internal.pageSize.width - 80, {});
    doc.text(text, 40, 80);

    var cols = getColumns();
    cols.splice(0, 2);
    doc.autoTable(cols, getData(40), {startY: 150});

    doc.text(text, 40, doc.autoTableEndPosY() + 30);

    return doc;
};

// Multiple - shows how multiple tables can be drawn both horizontally and vertically
examples.multiple = function () {
    var doc = new jsPDF('p', 'pt');
    doc.setFontSize(22);
    doc.text("Multiple tables", 40, 60);
    doc.setFontSize(12);

    doc.autoTable(getColumns().slice(0, 3), getData(), {
        startY: 90,
        pageBreak: 'avoid',
        margin: {right: 305}
    });

    doc.autoTable(getColumns().slice(0, 3), getData(), {
        startY: 90,
        pageBreak: 'avoid',
        margin: {left: 305}
    });

    for (var j = 0; j < 6; j++) {
        doc.autoTable(getColumns(), getData(9), {
            startY: doc.autoTableEndPosY() + 30,
            pageBreak: 'avoid',
        });
    }

    return doc;
};

// From html - shows how pdf tables can be be drawn from html tables
examples.html = function () {
    var doc = new jsPDF('p', 'pt');
    doc.text("From HTML", 40, 50);
    var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
    doc.autoTable(res.columns, res.data, {startY: 60});
    return doc;
};

// Header and footers - shows how header and footers can be drawn
examples['header-footer'] = function () {
    var doc = new jsPDF('p', 'pt');

    var header = function (data) {
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.setFontStyle('normal');
        doc.text("Report for X", data.settings.margin.left, 60);
    };

    var totalPagesExp = "{total_pages_count_string}";
    var footer = function (data) {
        var str = "Page " + data.pageCount;
        // Total page number plugin only available in jspdf v1.0+
        if (typeof doc.putTotalPages === 'function') {
            str = str + " of " + totalPagesExp;
        }
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 30);
    };

    var options = {
        beforePageContent: header,
        afterPageContent: footer,
        margin: {top: 80}
    };
    doc.autoTable(getColumns(), getData(40), options);

    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
    }

    return doc;
};

// Custom style - shows how custom styles can be applied to tables
examples.themes = function () {
    var doc = new jsPDF('p', 'pt');
    doc.setFontSize(12);
    doc.setFontStyle('bold');

    doc.text('Theme "striped"', 40, 50);
    doc.autoTable(getColumns(), getData(), {startY: 60});

    doc.text('Theme "grid"', 40, doc.autoTableEndPosY() + 30);
    doc.autoTable(getColumns(), getData(), {startY: doc.autoTableEndPosY() + 40, theme: 'grid'});

    doc.text('Theme "plain"', 40, doc.autoTableEndPosY() + 30);
    doc.autoTable(getColumns(), getData(), {startY: doc.autoTableEndPosY() + 40, theme: 'plain'});

    return doc;
};

// Custom style - shows how custom styles can be applied to tables
examples.custom = function () {
    var doc = new jsPDF('p', 'pt');
    doc.autoTable(getColumns().slice(2, 6), getData(20), {
        styles: {
            font: 'courier',
            fillStyle: 'DF',
            lineColor: [44, 62, 80],
            lineWidth: 2
        },
        headerStyles: {
            fillColor: [44, 62, 80],
            fontSize: 15,
            rowHeight: 30
        },
        bodyStyles: {
            fillColor: [52, 73, 94],
            textColor: 240
        },
        alternateRowStyles: {
            fillColor: [74, 96, 117]
        },
        columnBodyStyles: {
            email: {
                fontStyle: 'bold'
            }
        },
        createdCell: function (cell, data) {
            if (data.column.dataKey === 'expenses') {
                cell.styles.halign = 'right';
                if (cell.raw > 600) {
                    cell.styles.textColor = [255, 100, 100];
                    cell.styles.fontStyle = 'bolditalic';
                }
                cell.text = '$' + cell.text;
            } else if (data.column.dataKey === 'country') {
                cell.text = cell.raw.split(' ')[0];
            }
        }
    });
    return doc;
};

// Custom style - shows how custom styles can be applied to tables
examples.spans = function () {
    var doc = new jsPDF('p', 'pt');
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.setFontStyle('bold');
    doc.text('Col and row span', 40, 50);
    var data = getData(20);
    data.sort(function (a, b) {
        return parseFloat(b.expenses) - parseFloat(a.expenses);
    });
    doc.autoTable(getColumns(), data, {
        theme: 'grid',
        startY: 60,
        drawRow: function (row, data) {
            // Colspan
            doc.setFontStyle('bold');
            doc.setFontSize(10);
            if (row.index === 0) {
                doc.setTextColor(200, 0, 0);
                doc.rect(data.settings.margin.left, row.y, data.table.width, 20, 'S');
                doc.autoTableText("Priority Group", data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
                    halign: 'center',
                    valign: 'middle'
                });
                data.cursor.y += 20;
            } else if (row.index === 5) {
                doc.rect(data.settings.margin.left, row.y, data.table.width, 20, 'S');
                doc.autoTableText("Other Groups", data.settings.margin.left + data.table.width / 2, row.y + row.height / 2, {
                    halign: 'center',
                    valign: 'middle'
                });
                data.cursor.y += 20;
            }
        },
        drawCell: function (cell, data) {
            // Rowspan
            if (data.column.dataKey === 'id') {
                if (data.row.index % 5 === 0) {
                    doc.rect(cell.x, cell.y, data.table.width, cell.height * 5, 'S');
                    doc.autoTableText(data.row.index / 5 + 1 + '', cell.x + cell.width / 2, cell.y + cell.height * 5 / 2, {
                        halign: 'center',
                        valign: 'middle'
                    });
                }
                return false;
            }
        }
    });
    return doc;
};

/*
 |--------------------------------------------------------------------------
 | Below is some helper functions for the examples
 |--------------------------------------------------------------------------
 */

// Returns a new array each time to avoid pointer issues
var getColumns = function () {
    return [
        {title: "ID", dataKey: "id"},
        {title: "Name", dataKey: "first_name"},
        {title: "Email", dataKey: "email"},
        {title: "City", dataKey: "city"},
        {title: "Country", dataKey: "country"},
        {title: "Expenses", dataKey: "expenses"}
    ];
};

// Uses the faker.js library to get random data.
function getData(rowCount) {
    rowCount = rowCount || 4;
    var sentence = faker.lorem.words(12);
    var data = [];
    for (var j = 1; j <= rowCount; j++) {
        data.push({
            id: j,
            first_name: faker.name.findName(),
            email: faker.internet.email(),
            country: faker.address.country(),
            city: faker.address.city(),
            expenses: faker.finance.amount(),
            text: shuffleSentence(sentence),
            text2: shuffleSentence(sentence)
        });
    }
    return data;
}

function shuffleSentence(words) {
    words = words || faker.lorem.words(8);
    var str = faker.helpers.shuffle(words).join(' ').trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
}