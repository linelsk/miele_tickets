import { Component, Input, TemplateRef } from '@angular/core';
import { DayViewHourSegment } from 'calendar-utils';

@Component({
  selector: 'iq-calendar-week-hours-day-view-hour-segment',
  //segmentHeight
  template: `
        <ng-template
            #defaultTemplate
            let-segment="segment"
            let-locale="locale">
            <div
                class="cal-hour-segment"
                [style.height.px]="segmentHeight"
                [class.cal-hour-start]="segment.isStart"
                [class.cal-after-hour-start]="!segment.isStart"
                [ngClass]="segment.cssClass">
                <div class="cal-time" *ngIf="hourVisible">
                    {{ segment.date | calendarDate:'dayViewHour':locale }}
                </div>
                <span style="color:#275D8C; font-size:x-small;padding:5px 5px 5px 10px " *ngIf="(segment.date | calendarDate:'dayViewHour':locale) == '1 PM'"><i class="fa fa-cutlery" aria-hidden="true"></i> Hora de comer</span>
                <span style="color:#A5000D; font-size:x-small;padding:5px 5px 5px 10px " *ngIf="(segment.date | calendarDate:'dayViewHour':locale) != '1 PM'"><i class="fa fa-clone" aria-hidden="true"></i> Disponible</span> 
            </div>
        </ng-template>
        <ng-template
            [ngTemplateOutlet]="customTemplate || defaultTemplate"
            [ngTemplateOutletContext]="{
        segment: segment,
        locale: locale
      }">
        </ng-template>
    `
})
export class CalendarWeekHoursDayViewHourSegmentComponent {
  @Input() segment: DayViewHourSegment;

  @Input() segmentHeight: number;

  @Input() locale: string;

  @Input() customTemplate: TemplateRef<any>;

  @Input() hourVisible = true;
}
