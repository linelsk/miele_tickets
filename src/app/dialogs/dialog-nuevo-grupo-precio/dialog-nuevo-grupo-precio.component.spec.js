"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var dialog_nuevo_grupo_precio_component_1 = require("./dialog-nuevo-grupo-precio.component");
describe('DialogNuevoGrupoPrecioComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [dialog_nuevo_grupo_precio_component_1.DialogNuevoGrupoPrecioComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(dialog_nuevo_grupo_precio_component_1.DialogNuevoGrupoPrecioComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=dialog-nuevo-grupo-precio.component.spec.js.map