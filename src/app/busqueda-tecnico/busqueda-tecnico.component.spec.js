"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var busqueda_tecnico_component_1 = require("./busqueda-tecnico.component");
describe('BusquedaTecnicoComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [busqueda_tecnico_component_1.BusquedaTecnicoComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(busqueda_tecnico_component_1.BusquedaTecnicoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=busqueda-tecnico.component.spec.js.map