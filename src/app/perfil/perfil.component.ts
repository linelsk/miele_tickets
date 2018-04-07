import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatosService } from '../datos.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit, OnDestroy {
  almacen: string = "";
  name: string = "";
  paterno: string = "";
  materno: string = "";
  previsita: number = 0;
  instalacion: number = 0;
  email: string = "";
  celular: string = "";
  tipotecnico: string = "";
  refri: string = "";
  public user: string[];

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(private heroService: DatosService) { }
  
  ngOnInit() {
    this.heroService.verificarsesion();
    // add the the body classes
    this.user = JSON.parse(localStorage.getItem("user"));
    console.log(this.user);
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    //this.heroService.perfilme()
    //  .subscribe((value) => {
    //    console.log(value.json());
    //    this.name = value.json().name;
    //    this.paterno = value.json().paterno;
    //    this.materno = value.json().materno;
    //    this.email = value.json().email;
    //    //this.aviso = "alert-danger-aviso";
    //    //this.validform_responde = true;
    //  });
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

}
