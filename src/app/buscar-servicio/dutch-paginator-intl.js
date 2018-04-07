"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var material_1 = require("@angular/material");
var dutchRangeLabel = function (page, pageSize, length) {
    if (length == 0 || pageSize == 0) {
        return "0 van " + length;
    }
    length = Math.max(length, 0);
    var startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    var endIndex = startIndex < length ?
        Math.min(startIndex + pageSize, length) :
        startIndex + pageSize;
    return startIndex + 1 + " - " + endIndex + " de " + length;
};
function getDutchPaginatorIntl() {
    var paginatorIntl = new material_1.MatPaginatorIntl();
    paginatorIntl.itemsPerPageLabel = 'Registros por página:';
    paginatorIntl.nextPageLabel = 'Siguiente';
    paginatorIntl.previousPageLabel = 'Anterior';
    paginatorIntl.getRangeLabel = dutchRangeLabel;
    return paginatorIntl;
}
exports.getDutchPaginatorIntl = getDutchPaginatorIntl;
//# sourceMappingURL=dutch-paginator-intl.js.map