import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import * as jquery from 'jquery';

@Component({
  selector: 'app-asignacion-refacciones',
  templateUrl: './asignacion-refacciones.component.html',
  styleUrls: ['./asignacion-refacciones.component.css']
})
export class AsignacionRefaccionesComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  constructor(private heroService: DatosService, public snackBar: MatSnackBar) { }
  detalle_visita: any[] = [];

  ngOnInit() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.heroService.service_general("Refacciones/Prediagnostico_Tecnico_Refacciones_Entrega", {}).subscribe((value) => {
      console.log(value);
      this.detalle_visita = value;
    });
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  _mensaje: any = "";
  no_materiales_validacion: any = [];
  aprobado: boolean = false;
  entregar_refacciones(id, value) {
    this._mensaje = "";
    this.aprobado = false;
    for (var j = 0; j < value.refacciones.length; j++) {
      this.heroService.service_general("Refacciones/Validar_Refaccion_Entrega", {
        no_material: value.refacciones[j].no_material,
        cantidad: $("#txt-" + j + "-" + value.refacciones[j].no_material).val()
      }).subscribe((result_cantidad) => {
        //this.no_materiales_validacion = result_cantidad;
        //console.log(result_cantidad.cantidad);
        if (result_cantidad.cantidad != "OK") {
          this._mensaje += result_cantidad.cantidad + ", ";
          this.snackBar.open("La refacciones " + '"' + this._mensaje + '"' + " no tienen suficiente stock en almacen", "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
          this.aprobado = true;
        }
        else {
          if (!this.aprobado) {
            this.heroService.service_general("Refacciones/Entregar_Refacciones", {
              "id": id
            }).subscribe((result) => {
              for (var j = 0; j < value.refacciones.length; j++) {
                this.heroService.service_general("Refacciones/Entregar_Refacciones_Cantidad", {
                  id: value.refacciones[j].id,
                  cantidad: $("#txt-" + j + "-" + value.refacciones[j].no_material).val()
                }).subscribe((h) => {
                  this.heroService.service_general("Refacciones/Prediagnostico_Tecnico_Refacciones_Entrega", {}).subscribe((value) => {
                    //console.log(value);
                    this.detalle_visita = value;
                  });
                });
                //break;
              }
            });
          }
        }
      });
    }
  }
}
