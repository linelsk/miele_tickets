import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {
  token: boolean;
  message: string;
  aviso: string;
  emailsend: string;

  constructor(private heroService: DatosService) { }

  ngOnInit() {
    //this.token = this.heroService.getToken();
    if (this.token) {
      //console.log(this.token);
      window.location.href = "main";
    }
  }


  recuperar(obj) {
    this.heroService.recuperarpass(this.emailsend)
      .subscribe((value) => {
        console.log(value);
        if (value.response == "La contraseña se cambio correctamente") {
          this.message = "Si este email existe en nuestro sistema, ya te enviamos una nueva contraseña";
          this.aviso = "alert-danger-aviso"
        }
        else {
          this.message = value.response;
          this.aviso = "alert-danger-aviso"
        }
      });
  }

}
