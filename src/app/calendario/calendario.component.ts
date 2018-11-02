import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { DatosService } from '../datos.service';
import { Clientes, direccion, datosfiscales, servicio, producto, visita } from '../models/cliente';
import { Hero } from '../models/login';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators/map';
import { addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent, CalendarEventTimesChangedEvent, DAYS_OF_WEEK } from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { elementAt } from 'rxjs/operators/elementAt';
import { locale } from 'moment';
import { DialogVisitaHoraClienteComponent } from '../dialogs/dialog-visita-hora-cliente/dialog-visita-hora-cliente.component';
import * as jquery from 'jquery';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CalendarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private heroService: DatosService, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  view = 'week';
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  tecnicos: any[] = [];
  no_checks: number = 0;
  locale: string = 'es';

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
  excludeDays: number[] = [0];

  set_tecnico(obj) {
    //(obj);

  }

  hourSegmentClicked(event) {
    console.log(event.date.getHours());
    var d = new Date();
    console.log(d.getHours());
    var fecha1 = moment(event.date);
    var fecha2 = moment();

    if (moment(event.date).format("MM/DD/YYYY") < moment().format("MM/DD/YYYY")) {
      this.snackBar.open("La visita no puede en una fecha anterior al día de hoy", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
    else {
      //if (event.date.getHours() < d.getHours()) {
      //  this.snackBar.open("La visita no puede en una hora anterior a la actual", "", {
      //    duration: 5000,
      //    verticalPosition: 'bottom',
      //    horizontalPosition: 'right',
      //    extraClasses: ['blue-snackbar']
      //  });
      //}
      //else {
        if (this.data.no_tecnico == 1) {
          if (this.tecnico_actual.length == 0) {
            this.snackBar.open("Para este servicios se necesita un técnico", "", {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              extraClasses: ['blue-snackbar']
            });
          }
          else {
            if (moment(event.date).format("HH") == "13") {
              this.snackBar.open("Es hora de la comida:" + moment(event.date).format("HH:mm"), "", {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                extraClasses: ['blue-snackbar']
              });
            }
            else {
              let dialogRef = this.dialog.open(DialogVisitaHoraClienteComponent, {
                width: '450px',
                disableClose: true,
                data: {
                  tecnico: this.tecnico_actual, tipo_servicio: this.data.tipo_servicio, event: moment(event.date).format("HH"), fecha: moment(event.date).format("MM/DD/YYYY"), hora_inicio: moment(event.date).format('LT'), horas_tecnico: this.data.horas_tecnico, propuesto: false
                }
              });

              dialogRef.afterClosed().subscribe(result => {
                console.log(result);
                if (result.tipo_servicio.desc_tipo_servicio == undefined) {
                  result.tipo_servicio.desc_tipo_servicio = result.tipo_servicio[0].desc_tipo_servicio;
                }
                let _tecnico: string = ""
                if (result != undefined) {
                  localStorage.setItem("agenda", JSON.stringify((result)));
                  if (result.tecnico.length > 1) {
                    _tecnico = "2 tecnicos";
                  }
                  else {
                    _tecnico = result.tecnico[0].tecnico;
                  }

                  this.events.push(
                    {
                      start: addHours(startOfDay(new Date(result.fecha)), result.event),
                      end: addHours(startOfDay(new Date(result.fecha)), parseFloat(localStorage.getItem("fecha_fin"))),
                      title: result.tipo_servicio.desc_tipo_servicio + "-" + _tecnico,
                      color: {
                        primary: '#FFC300',
                        secondary: '#FFC300'
                      }
                    }
                  );
                  this.refresh.next();
                }
                else {
                  localStorage.setItem("agenda", "");
                }
              });
            }
          }
        }
        else {
          if (this.data.no_tecnico == 2) {
            if (this.tecnico_actual.length < 2) {
              this.snackBar.open("Para este servicios se necesitan 2 tecnicos", "", {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                extraClasses: ['blue-snackbar']
              });
            }
            else {
              if (moment(event.date).format("HH") == "13") {
                this.snackBar.open("Es hora de la comida:" + moment(event.date).format("HH:mm"), "", {
                  duration: 5000,
                  verticalPosition: 'bottom',
                  horizontalPosition: 'right',
                  extraClasses: ['blue-snackbar']
                });
              }
              else {
                let dialogRef = this.dialog.open(DialogVisitaHoraClienteComponent, {
                  width: '450px',
                  disableClose: true,
                  data: {
                    tecnico: this.tecnico_actual, tipo_servicio: this.data.tipo_servicio, event: moment(event.date).format("HH"), fecha: moment(event.date).format("MM/DD/YYYY"), hora_inicio: moment(event.date).format('LT'), horas_tecnico: this.data.horas_tecnico, propuesto: false
                  }
                });

                dialogRef.afterClosed().subscribe(result => {
                  console.log(result);
                  let _tecnico: string = ""
                  if (result != undefined) {
                    localStorage.setItem("agenda", JSON.stringify((result)));
                    if (result.tecnico.length > 1) {
                      _tecnico = "2 tecnicos";
                    }
                    else {
                      _tecnico = result.tecnico[0].tecnico;
                    }
                    //(localStorage.getItem("fecha_fin"));
                    this.events.push(
                      {
                        start: addHours(startOfDay(new Date(result.fecha)), result.event),
                        end: addHours(startOfDay(new Date(result.fecha)), parseFloat(localStorage.getItem("fecha_fin"))),
                        title: result.tipo_servicio.desc_tipo_servicio + "-" + _tecnico,
                        color: {
                          primary: '#FFC300',
                          secondary: '#FFC300'
                        }
                      }
                    );
                    this.refresh.next();
                  }
                  else {
                    localStorage.setItem("agenda", "");
                  }
                });
              }
            }
          }
        }
      //}
    }
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

  aleatorio(inferior, superior) {
    this.numPosibilidades = superior - inferior
    this.aleat = Math.random() * this.numPosibilidades
    this.aleat = Math.floor(this.aleat)
    return parseInt(inferior) + this.aleat
  }

  filtro_tecnico(event, options) {
    console.log(options);
    if (event.source.checked) {
      this.tecnico_actual.push(options);
      //(this.tecnico_actual);
      //console.log($("#chk-1").val());
      if (this.data.no_tecnico != this.tecnico_actual.length) {
        this.snackBar.open("Este servicio es solo para " + this.data.no_tecnico + " técnico", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      }

      for (var i = 0; i < this.tecnico_actual.length; i++) {
        this.tecnicos_id += this.tecnico_actual[i].id + ",";
      }

      this.heroService.service_general("servicios/Tecnico_id", { "id": this.tecnicos_id }).subscribe((value) => {
        //console.log(value);
        if (value.value.item != "") {
          this.events = [];
          for (var i = 0; i < value.value.item.length; i++) {
            this.events.push(
              {
                start: addHours(startOfDay(new Date(value.value.item[i].fecha_visita)), value.value.item[i].hora_inicio),
                end: addHours(startOfDay(new Date(value.value.item[i].fecha_visita)), value.value.item[i].hora_fin),
                title: value.value.item[i].desc_tipo_servicio + "-" + value.value.item[i].tecnico,
                color: {
                  primary: value.value.item[i].tecnico_color,
                  secondary: value.value.item[i].tecnico_color
                },
                actions: []
              });
          }

          this.refresh.next();
        }
        else {
          this.events = [];
        }
      });
    }
    else {
      this.tecnicos_id = ""
      for (var i = 0; i < this.tecnico_actual.length; i++) {
        if (this.tecnico_actual[i].id == options.id) {
          this.tecnico_actual.splice(i, 1);
        }
      }

      for (var i = 0; i < this.tecnico_actual.length; i++) {
        this.tecnicos_id += this.tecnico_actual[i].id + ",";
      }

      this.heroService.service_general("servicios/Tecnico_id", { "id": this.tecnicos_id }).subscribe((value) => {
        console.log(value);
        if (value.value.item != "") {
          this.events = [];
          for (var i = 0; i < value.value.item.length; i++) {
            this.events.push(
              {
                start: addHours(startOfDay(new Date(value.value.item[i].fecha_visita)), value.value.item[i].hora_inicio),
                end: addHours(startOfDay(new Date(value.value.item[i].fecha_visita)), value.value.item[i].hora_fin),
                title: value.value.item[i].desc_tipo_servicio + "-" + value.value.item[i].tecnico,
                color: {
                  primary: value.value.item[i].tecnico_color,
                  secondary: value.value.item[i].tecnico_color
                },
                actions: []
              });
          }

          this.refresh.next();
        }
        else {
          this.events = [];
        }
      });

      this.no_checks = this.no_checks - 1;
      localStorage.setItem("no_check", this.no_checks.toString());
    }
    localStorage.setItem("tecnicos_visita", JSON.stringify(this.tecnico_actual));
  }

  ver_todos() {
    this.events = [];
    this.heroService.service_general("servicios/TecnicoCalendario", { "id": this.data.tipo_servicio.id }).subscribe((value) => {
      //this.color_tecnico = value[0].tecnico_group;
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

      ////(this.events);
      this.refresh.next();
    });
  }
  tecnicos_enviar: string = "";
  ngOnInit() {
    console.log(this.data);
    for (var i = 0; i < this.data.tecnicos.length; i++) {
      this.tecnicos_enviar += this.data.tecnicos[i].id + ",";
    }
    this.heroService.service_general("servicios/TecnicoCalendario", { "id": this.data.tipo_servicio.id, "productos": this.tecnicos_enviar }).subscribe((value) => {
      //(value);
      for (var i = 0; i < value.length; i++) {
        //(value[i].tecnico);
        this.events.push(
          {
            start: addHours(startOfDay(new Date(value[i].fecha_visita)), value[i].hora_inicio),
            end: addHours(startOfDay(new Date(value[i].fecha_visita)), value[i].hora_fin),
            title: value[i].desc_tipo_servicio + "-" + value[i].tecnico,
            color: {
              primary: value[i].tecnico_color,
              secondary: value[i].tecnico_color
            },
            actions: []
          }
        );
        this.refresh.next();
      }
      ////(this.events);
      
    });
  }

  onNoClick(): void {

    this.dialogRef.close();
  }


}
