import { Component, OnInit } from '@angular/core';
import { Hero } from '../models/login';
import { DatosService } from '../datos.service';
import 'rxjs/Rx';
import 'hammerjs';
import * as jquery from 'jquery';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  email: string;
  password: string;
  token: boolean;
  message: {};
  //validar: boolean = false;

  constructor(private heroService: DatosService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.token = this.heroService.getToken();
    if (this.token) {
      console.log(this.token);
      window.location.href = "main";
    }
  }

  validaciones(event) {
    for (var i = 0; i < event.length; i++) {
      if (!event[i].valid) {
        $("#" + event[i].name).focus();
        break;
      }
    }
  }

  login(obj) {
    //console.log(this.email + '------' + this.password);
    if (this.email != undefined && this.password != undefined) {
      this.heroService.login(this.email, this.password)
        .subscribe((value) => {
          console.log(value.user);
          switch (value.token) {
            case "usuarios no existe":
              this.snackBar.open("Usuario y/o contraseña incorrecta", "", {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                extraClasses: ['blue-snackbar']
              });
              //this.validar = true;
              break;
            case "password incorrecto":
              //this.message = "Usuario y/o contraseña incorrecta";
              //this.validar = true;              
              this.snackBar.open("Usuario y/o contraseña incorrecta", "", {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                extraClasses: ['blue-snackbar']
              });
              break;
            default:
              if (value.token != "usuarios no existe" || value.token != "password incorrecto") {
                if (value.user.rol != "Técnico") {
                  localStorage.setItem("token", value.token);
                  localStorage.setItem("user", JSON.stringify((value.user)));
                  localStorage.setItem("inicial", value.user.name.substring(0, 1));
                  localStorage.setItem("nombre", value.user.name);
                  localStorage.setItem("paterno", value.user.paterno);
                  localStorage.setItem("id", value.user.id);
                  localStorage.setItem("rol", value.user.rol);
                  localStorage.setItem("id_rol", value.user.id_rol);
                  window.location.href = "main";
                }
                else {
                  this.snackBar.open("Usuario téncico sin permiso para ingresar al sistema", "", {
                    duration: 5000,
                    verticalPosition: 'bottom',
                    horizontalPosition: 'right',
                    extraClasses: ['blue-snackbar']
                  });
                }
              }

          }
        });
    }
  }
}
