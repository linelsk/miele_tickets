import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatosService } from '../datos.service';
import 'rxjs/Rx';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit, OnDestroy {

  validar: boolean = false;
  validar_cerrar: boolean = false;
  validar_pass: boolean = false;
  message: string;
  message_cerrar: string;
  id: string = localStorage.getItem("id");
  nuevopass: string = "";
  repeatpass: string = "";
  passold: string = "";
  passnew: string = "";
  aviso: string;

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(private heroService: DatosService) { }

  ngOnInit() {
    this.heroService.verificarsesion();
    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  cambiarpass(obj) {
    this.heroService.cambiarpass(this.id, this.passold, this.passnew)
      .subscribe((value) => {
        console.log(value);
        this.message = value.response;
        this.validar_pass = true;
        this.aviso = "alert-danger-aviso"
      });
  }

  validacion_form(obj) {
    if (this.passnew == this.repeatpass) {
      this.validar = false;
      this.validar_pass = false;
    }
    else {
      this.validar = true;
      this.validar_pass = false;
      this.message = "Las contraseñas no son iguales";
    }
  }

  cerrarsesiones(obj) {
    this.heroService.cerrarsesiones(this.id)
      .subscribe((value) => {
        if (value.response == "Sesiones cerradas correctamente") {
          this.message_cerrar = value.response;
          this.validar_cerrar = true;
          this.aviso = "alert-danger-aviso"
          window.location.href = "/main";
        }
      });
  }
}
