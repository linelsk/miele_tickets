import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import * as jquery from 'jquery';

@Component({
  selector: 'app-lista-notificaciones',
  templateUrl: './lista-notificaciones.component.html',
  styleUrls: ['./lista-notificaciones.component.css']
})
export class ListaNotificacionesComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  notificaciones: any = [];

  constructor(private heroService: DatosService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.heroService.service_general('Notificaciones/notificacion_usuario', {
      id: localStorage.getItem("id_rol")
    }).subscribe((notificacion) => {
      //console.log(notificacion);

      for (var i = 0; i < notificacion.length; i++) {
        if (notificacion[i].estatus_leido) {
          this.notificaciones.push({
            id: notificacion[i].id,
            estatus_leido: notificacion[i].estatus_leido,
            rol_notificado: notificacion[i].rol_notificado,
            fecha: moment(notificacion[i].fecha, "YYYYMMDD").fromNow(),
            descripcion: notificacion[i].descripcion,
            evento: notificacion[i].evento,
            class: "li_leido"
          });
        }
        else {
          this.notificaciones.push({
            id: notificacion[i].id,
            estatus_leido: notificacion[i].estatus_leido,
            rol_notificado: notificacion[i].rol_notificado,
            fecha: moment(notificacion[i].fecha, "YYYYMMDD").fromNow(),
            descripcion: notificacion[i].descripcion,
            evento: notificacion[i].evento,
            class: "li_no_leido"
          });
        }

      }
    });
  }

  cambiar_estatus_notificacion(value) {
    //console.log($("#li-" + value.id).focus());
    if (!value.estatus_leido) {
      this.heroService.service_general('Notificaciones/actualizar_estatus_notificacion', {
        id: value.id
      }).subscribe((notificacion) => {
        if (notificacion = "OK") {
          console.log("OKKK");
          $("#div-" + value.id).removeClass("li_no_leido");
          $("#div-" + value.id).addClass("li_leido");
          this.heroService.service_general('Notificaciones/notificacion_usuario_total', {
            id: localStorage.getItem("id_rol")
          }).subscribe((notificacion) => {
            //console.log(notificacion);
            localStorage.setItem("no_notificacion", notificacion)
          });
        }
      });
    }
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }
}
