import { Component, OnInit } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { DatosService } from '../datos.service';
import { Clientes, Cat_Direccion } from '../models/cliente';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent implements OnInit {

  public cliente = new Clientes();
  public direccion = new Cat_Direccion();
  estados: string[] = [];
  municipios: string[] = [];
  localidades: string[] = [];

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  public mask_cp = [/\d/, /\d/, /\d/, /\d/, /\d/];

  constructor(private heroService: DatosService) { }

  ngOnInit() {
    this.heroService.verificarsesion();
    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.getestados();
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  getestados(): void {
    this.heroService.service_general("Catalogos/Estados", {})
      .subscribe((value) => {
        this.estados = value;
      });
  }

  getmunicipios(): void {
    this.heroService.service_general("Catalogos/Municipio", {
      "id": this.direccion.id_estado
    })
      .subscribe((value) => {
        this.municipios = value;
      });
  }

  guardar_cliente() {
    //console.log(this.cliente);
    this.heroService.service_general("Clientes/Nuevo_cliente", this.cliente)
      .subscribe((value) => {
        console.log(value);
      });
  }

  sepomex() {
    if (this.direccion.cp.length == 5) {
      this.heroService.service_general("Servicios/Sepomex", { id: this.direccion.cp })
        .subscribe((value) => {
          this.direccion.id_estado = value[0].id_estado;
          this.getmunicipios();
          this.direccion.id_municipio = value[0].id_municipio;
          this.localidades = value[0].localidades;
          this.direccion.colonia = value[0].localidades[0].id_localidad;
          console.log(value);
        });
    }   
  }
}
