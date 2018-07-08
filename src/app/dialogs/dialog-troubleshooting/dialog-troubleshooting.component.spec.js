"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var dialog_troubleshooting_component_1 = require("./dialog-troubleshooting.component");
describe('DialogTroubleshootingComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [dialog_troubleshooting_component_1.DialogTroubleshootingComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(dialog_troubleshooting_component_1.DialogTroubleshootingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=dialog-troubleshooting.component.spec.js.map