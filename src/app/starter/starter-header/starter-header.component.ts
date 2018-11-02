import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../datos.service';
import * as moment from 'moment';
import * as jquery from 'jquery';

@Component({
  selector: 'app-starter-header',
  templateUrl: './starter-header.component.html',
  styleUrls: ['./starter-header.component.css']
})
export class StarterHeaderComponent implements OnInit {

  name: string;
  inicial: string;
  notificaciones: any = [];
  no_notificaciones: any;

  constructor(private heroService: DatosService) { }

  ngOnInit() {
    this.name = localStorage.getItem("nombre") + " " + localStorage.getItem("paterno");
    this.inicial = localStorage.getItem("inicial");

    this.heroService.service_general('Notificaciones/notificacion_usuario_total', {
      id: localStorage.getItem("id_rol")
    }).subscribe((notificacion) => {
      console.log(notificacion);
      localStorage.setItem("no_notificacion", notificacion)
      //this.no_notificaciones = notificacion;
    });

    this.heroService.service_general('Notificaciones/notificacion_usuario', {
      id: localStorage.getItem("id_rol")
    }).subscribe((notificacion) => {
      //console.log(notificacion);

      for (var i = 0; i < notificacion.length; i++) {
        let _fecha = notificacion[i].fecha.split("/");
        if (notificacion[i].estatus_leido) {
          this.notificaciones.push({
            id: notificacion[i].id,
            estatus_leido: notificacion[i].estatus_leido,
            rol_notificado: notificacion[i].rol_notificado,
            fecha: moment(_fecha[0], _fecha[1], _fecha[2]).fromNow(),
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
            fecha: moment(_fecha[0], _fecha[1], _fecha[2]).fromNow(),
            descripcion: notificacion[i].descripcion,
            evento: notificacion[i].evento,
            class: "li_no_leido"
          });
        }

      }
    });
  }

  actualizar_notificaciones() {
    this.notificaciones = [];
    this.heroService.service_general('Notificaciones/notificacion_usuario_total', {
      id: localStorage.getItem("id_rol")
    }).subscribe((notificacion) => {
      console.log(notificacion);
      this.no_notificaciones = notificacion;
    });

    this.heroService.service_general('Notificaciones/notificacion_usuario', {
      id: localStorage.getItem("id_rol")
    }).subscribe((notificacion) => {
      //console.log(notificacion);

      for (var i = 0; i < notificacion.length; i++) {
        let _fecha = notificacion[i].fecha.split("/");
        if (notificacion[i].estatus_leido) {
          this.notificaciones.push({
            id: notificacion[i].id,
            estatus_leido: notificacion[i].estatus_leido,
            rol_notificado: notificacion[i].rol_notificado,
            fecha: moment(_fecha[0], _fecha[1], _fecha[2]).fromNow(),
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
            fecha: moment(_fecha[0], _fecha[1], _fecha[2]).fromNow(),
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
          $("#li-" + value.id).removeClass("li_no_leido");
          $("#li-" + value.id).addClass("li_leido");
          this.heroService.service_general('Notificaciones/notificacion_usuario_total', {
            id: localStorage.getItem("id_rol")
          }).subscribe((notificacion) => {
            console.log(notificacion);
            //this.no_notificaciones = notificacion;
            localStorage.setItem("no_notificacion", notificacion)
          });
        }
      });
    }
  }

  ngDoCheck() {
    this.no_notificaciones = localStorage.getItem("no_notificacion");
  }

  salir(obj): void {

    localStorage.clear();
    window.location.href = "";

  }
}
