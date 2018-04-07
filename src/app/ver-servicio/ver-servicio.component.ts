import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';

@Component({
  selector: 'app-ver-servicio',
  templateUrl: './ver-servicio.component.html',
  styleUrls: ['./ver-servicio.component.css']
})
export class VerServicioComponent implements OnInit {

  displayed_direcciones = ['direccion', 'persona'];
  dataSource_direcciones = new MatTableDataSource();

  displayed_ordenes = ['folio', 'persona'];
  dataSource_ordenes = new MatTableDataSource();

  displayed_telefonos = ['telefono', 'persona'];
  dataSource_telefonos = new MatTableDataSource();

  displayed_personas = ['persona', 'direccion'];
  dataSource_personas = new MatTableDataSource();


  preventAbuse = false;

  text_busqueda: string = "";
  public result_personas: string[];
  public result_direcciones: string[];
  public result_ordenes: string[];
  public result_telefonos: string[];
  isvisible_orden: boolean = false;
  isvisible_telefono: boolean = false;
  isvisible_direccion: boolean = false;
  isvisible_persona: boolean = false;
  valid: boolean = false;

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(private heroService: DatosService, private http: HttpClient, private https: Http) { }

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

  buscar() {
    if (this.text_busqueda == "") {
      this.valid = true;
    }
    else {
      this.preventAbuse = true;
      this.heroService.service_general("Clientes/Busqueda", {
        "texto": this.text_busqueda
      }).subscribe((value) => {
        setTimeout(() => {
          this.preventAbuse = false;
          this.valid = false;
          if (value.value.direcciones == 0) {
            this.isvisible_direccion = false;
          }
          else {
            this.isvisible_direccion = true;
          }

          if (value.value.ordenes == 0) {
            this.isvisible_orden = false;
          }
          else {
            this.isvisible_orden = true;
          }

          if (value.value.telefonos == 0) {
            this.isvisible_telefono = false;
          }
          else {
            this.isvisible_telefono = true;
          }

          if (value.value.personas == 0) {
            this.isvisible_persona = false;
          }
          else {
            this.isvisible_persona = true;
          }
          this.dataSource_direcciones.data = value.value.direcciones;
          this.dataSource_ordenes.data = value.value.ordenes;
          this.dataSource_telefonos.data = value.value.telefonos;
          this.dataSource_personas.data = value.value.personas;
        }, 400);
      });
    }    
  }
}
