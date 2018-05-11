import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {CalendarEvent, WeekDay} from 'calendar-utils';

@Component({
    selector: 'iq-calendar-week-hours-view-header',
    template: `
        <ng-template
            #defaultTemplate
            let-days="days"
            let-locale="locale"
            let-dayHeaderClicked="dayHeaderClicked"
            let-eventDropped="eventDropped">
            <div class="cal-day-headers">
                <div class="cal-header" style="border: 1px solid #e1e1e1;">
                </div>
                <div style="border: 1px solid #e1e1e1; text-align:left; padding: 10px 6px 10px 6px;"
                    class="cal-header"
                    *ngFor="let day of days"
                    [class.cal-past]="day.isPast"
                    [class.cal-today]="day.isToday"
                    [class.cal-future]="day.isFuture"
                    [class.cal-weekend]="day.isWeekend"
                    [class.cal-drag-over]="day.dragOver"
                    [ngClass]="day.cssClass"
                    (mwlClick)="dayHeaderClicked.emit({day: day})"
                    mwlDroppable
                    (dragEnter)="day.dragOver = true"
                    (dragLeave)="day.dragOver = false"
                    (drop)="day.dragOver = false; eventDropped.emit({event: $event.dropData.event, newStart: day.date})">                   
                    <span style="font-size:xx-large">{{ day.date | calendarDate:'monthViewDayNumber':locale }}</span><br>
                    <small>{{ day.date | calendarDate:'weekViewColumnHeader':locale }}</small>
                </div>
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{days: days, locale: locale, dayHeaderClicked: dayHeaderClicked, eventDropped: eventDropped}">
        </ng-template>
    `
})
export class CalendarWeekHoursViewHeaderComponent {
    @Input() days: WeekDay[];

    @Input() locale: string;

    @Input() customTemplate: TemplateRef<any>;

    @Output()
    dayHeaderClicked: EventEmitter<{ day: WeekDay }> = new EventEmitter<{
        day: WeekDay;
    }>();

    @Output()
    eventDropped: EventEmitter<{
        event: CalendarEvent;
        newStart: Date;
    }> = new EventEmitter<{ event: CalendarEvent; newStart: Date }>();
}
