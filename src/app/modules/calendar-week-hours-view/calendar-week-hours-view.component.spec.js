"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var calendar_week_hours_view_component_1 = require("./calendar-week-hours-view.component");
describe('AngularCalendarWeekHoursViewComponent', function () {
    var component;
    var fixture;
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [calendar_week_hours_view_component_1.CalendarWeekHoursViewComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = testing_1.TestBed.createComponent(calendar_week_hours_view_component_1.CalendarWeekHoursViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=calendar-week-hours-view.component.spec.js.map