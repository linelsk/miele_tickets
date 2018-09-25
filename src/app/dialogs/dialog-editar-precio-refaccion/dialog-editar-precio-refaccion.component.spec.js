"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var dialog_editar_precio_refaccion_component_1 = require("./dialog-editar-precio-refaccion.component");
describe('DialogEditarPrecioRefaccionComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [dialog_editar_precio_refaccion_component_1.DialogEditarPrecioRefaccionComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(dialog_editar_precio_refaccion_component_1.DialogEditarPrecioRefaccionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=dialog-editar-precio-refaccion.component.spec.js.map