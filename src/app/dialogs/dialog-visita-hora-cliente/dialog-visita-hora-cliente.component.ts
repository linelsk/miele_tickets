import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { DatosService } from '../../datos.service';
import { Clientes, direccion, datosfiscales, servicio, producto, visita } from '../../models/cliente';
import { Hero } from '../../models/login';
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

@Component({
  selector: 'app-dialog-visita-hora-cliente',
  templateUrl: './dialog-visita-hora-cliente.component.html',
  styleUrls: ['./dialog-visita-hora-cliente.component.css']
})
export class DialogVisitaHoraClienteComponent implements OnInit {

  ddlhora_inicio: any = "09";
  ddlhora_fin: any = "11";

  constructor(
    public dialogRef: MatDialogRef<DialogVisitaHoraClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data);
    this.ddlhora_inicio = this.data.event;
    this.ddlhora_fin = (parseFloat(this.data.event) + parseFloat(this.data.horas_tecnico)).toString();
    if (this.ddlhora_fin == "8" || this.ddlhora_fin == "8.5" || this.ddlhora_fin == "9" || this.ddlhora_fin == "9.5") {
      this.ddlhora_fin = "0" + this.ddlhora_fin;
    }
    console.log(this.ddlhora_fin);
    localStorage.setItem("fecha_fin", this.ddlhora_fin);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  set_hora_fin(obj) {
    localStorage.setItem("fecha_fin", obj);
  }

}
