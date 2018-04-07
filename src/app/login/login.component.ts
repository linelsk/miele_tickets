import { Component, OnInit } from '@angular/core';
import { Hero } from '../models/login';
import { DatosService } from '../datos.service';
import 'rxjs/Rx';
import 'hammerjs';

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
  validar: boolean = false;

  constructor(private heroService: DatosService) { }

  ngOnInit() {
    this.token = this.heroService.getToken();
    if (this.token) {
      console.log(this.token);
      window.location.href = "main";
    }
  }

  login(obj) {
    //console.log(this.email + '------' + this.password);
    if (this.email != undefined && this.password != undefined) {
      this.heroService.login(this.email, this.password)
        .subscribe((value) => {
          console.log(value);
          switch (value.token) {
            case "usuarios no existe":
              this.message = "Usuario y/o contraseña incorrecta";
              this.validar = true;
              break;
            case "password incorrecto":
              this.message = "Usuario y/o contraseña incorrecta";
              this.validar = true;
              break;
            default:
              if (value.token != "usuarios no existe" || value.token != "password incorrecto") {
                localStorage.setItem("token", value.token);
                localStorage.setItem("user", JSON.stringify((value.user)));
                localStorage.setItem("inicial", value.user.name.substring(0, 1));
                localStorage.setItem("nombre", value.user.name);
                localStorage.setItem("paterno", value.user.paterno);
                localStorage.setItem("id", value.user.id);
                window.location.href = "main";
              }

          }
        });
    }
  }
}
