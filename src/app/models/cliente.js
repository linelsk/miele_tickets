"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var Clientes = /** @class */ (function () {
    function Clientes() {
    }
    return Clientes;
}());
exports.Clientes = Clientes;
var direccion = /** @class */ (function () {
    function direccion() {
        this.creado = moment().format("MM/DD/YYYY HH:mm:ss");
        this.creadopor = JSON.parse(localStorage.getItem("user")).id;
        this.tipo_direccion = 1;
    }
    return direccion;
}());
exports.direccion = direccion;
var datosfiscales = /** @class */ (function () {
    function datosfiscales() {
    }
    return datosfiscales;
}());
exports.datosfiscales = datosfiscales;
var servicio = /** @class */ (function () {
    function servicio() {
    }
    return servicio;
}());
exports.servicio = servicio;
var visita = /** @class */ (function () {
    function visita() {
    }
    return visita;
}());
exports.visita = visita;
var Tipo_Servicio = /** @class */ (function () {
    function Tipo_Servicio() {
    }
    return Tipo_Servicio;
}());
exports.Tipo_Servicio = Tipo_Servicio;
var tecnico = /** @class */ (function () {
    function tecnico() {
    }
    return tecnico;
}());
exports.tecnico = tecnico;
var producto = /** @class */ (function () {
    function producto() {
        this.sku = "";
        this.modelo = "";
        this.nombre = "";
        this.descripcion_corta = "";
        this.descripcion_larga = "";
        this.atributos = "";
        this.precio_sin_iva = "0";
        this.precio_con_iva = "0";
        this.id_categoria = 1;
        this.id_linea = 1;
        this.id_sublinea = 1;
        this.ficha_tecnica = "";
        this.horas_tecnico = 1;
        this.precio_hora = 1490;
        this.estatus = 1;
        this.creado = "01/01/1900";
        this.creadopor = 0;
        this.actualizado = "01/01/1900";
        this.actualizadopor = 0;
    }
    return producto;
}());
exports.producto = producto;
//# sourceMappingURL=cliente.js.map