"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var datos_service_1 = require("./datos.service");
describe('DatosService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [datos_service_1.DatosService]
        });
    });
    it('should be created', testing_1.inject([datos_service_1.DatosService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=datos.service.spec.js.map