"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var asignacion_refacciones_component_1 = require("./asignacion-refacciones.component");
describe('AsignacionRefaccionesComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [asignacion_refacciones_component_1.AsignacionRefaccionesComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(asignacion_refacciones_component_1.AsignacionRefaccionesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=asignacion-refacciones.component.spec.js.map