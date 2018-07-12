"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var dialog_visita_hora_cliente_component_1 = require("./dialog-visita-hora-cliente.component");
describe('DialogVisitaHoraClienteComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [dialog_visita_hora_cliente_component_1.DialogVisitaHoraClienteComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(dialog_visita_hora_cliente_component_1.DialogVisitaHoraClienteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=dialog-visita-hora-cliente.component.spec.js.map