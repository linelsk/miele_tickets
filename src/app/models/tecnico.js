"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var tecnico = /** @class */ (function () {
    function tecnico() {
        this.actualizado = "01/01/1900";
        this.actualizadopor = 0;
        this.creado = moment().format("MM/DD/YYYY HH:mm:ss");
        this.creadopor = JSON.parse(localStorage.getItem("user")).id;
        this.tecnicos_actividad = [];
        this.tecnicos_producto = [];
    }
    return tecnico;
}());
exports.tecnico = tecnico;
var tecnico_actividad = /** @class */ (function () {
    function tecnico_actividad() {
    }
    return tecnico_actividad;
}());
exports.tecnico_actividad = tecnico_actividad;
var tecnico_producto = /** @class */ (function () {
    function tecnico_producto() {
    }
    return tecnico_producto;
}());
exports.tecnico_producto = tecnico_producto;
//# sourceMappingURL=tecnico.js.map