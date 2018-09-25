import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { DatosService } from '../datos.service';
import { Clientes, direccion, datosfiscales, servicio, producto, visita } from '../models/cliente';
import { Hero } from '../models/login';
import { MatTableDataSource } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators/map';
import { addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent, CalendarEventTimesChangedEvent, DAYS_OF_WEEK } from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { elementAt } from 'rxjs/operators/elementAt';
import { locale } from 'moment';

@Component({
  selector: 'app-calendari-home',
  templateUrl: './calendari-home.component.html',
  styleUrls: ['./calendari-home.component.css']
})
export class CalendariHomeComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  constructor(private heroService: DatosService, public snackBar: MatSnackBar) { }

  view = 'month';
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  tecnicos: any[] = [];
  no_checks: number = 0;
  locale: string = 'es';

  ngOnInit() {
    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.heroService.service_general("Servicios/TecnicoCalendarioHome", {}).subscribe((value) => {
      console.log(value.length);
      for (var i = 0; i < value.length; i++) {
        this.events.push(
          {
            start: addHours(startOfDay(new Date(value[i].fecha_visita)), value[i].hora_inicio),
            end: addHours(startOfDay(new Date(value[i].fecha_visita)), value[i].hora_fin),
            title: value[i].desc_tipo_servicio + "-" + value[i].tecnico,
            color: {
              primary: value[i].tecnico_color,
              secondary: value[i].tecnico_color
            },
            actions: [],
            //draggable: true,
            //resizable: {
            //  beforeStart: true,
            //  afterEnd: true
            //}
          });
      }

      //////(this.events);
      this.refresh.next();
    });
  
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.MONDAY];

  eventClicked(event) {
    //("ok");
    //(event);
  }

  tecnico: any = 0;
  ddlhora_fin: any = 0;
  hexadecimal = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F")
  color_aleatorio = "#";
  numPosibilidades: any;
  aleat: any;
  //color_tecnico: any[] = [];
  tecnico_actual: any[] = [];
  tecnicos_id: string = "";
  excludeDays: number[] = [0, 6];

  hourSegmentClicked(event) {
    var fecha1 = moment(event.date);
    var fecha2 = moment();

  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }
}
