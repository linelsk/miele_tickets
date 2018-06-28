import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import persons from '../models/mock-login';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { Clientes, direccion, datosfiscales } from '../models/cliente';

@Component({
  selector: 'app-servicio-detalle',
  templateUrl: './servicio-detalle.component.html',
  styleUrls: ['./servicio-detalle.component.css']
})
export class ServicioDetalleComponent implements OnInit {

  public mask_telefono = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public cliente = new Clientes();
  public direccion = new direccion();
  public datosfiscales = new datosfiscales();

  preventAbuse = false;
  id: number;
  public sub: any;
  public detalle: string[] = [];
  public detalle_direccion: any[] = [];
  estados: string[] = [];
  municipios: string[] = [];

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(private heroService: DatosService, private route: ActivatedRoute) {
  }

  displayedColumns = ['#Servicio', 'Modelo', 'SKU', 'Garantia', 'Poliza', 'Estatus', 'Imagen'];
  dataSource = new MatTableDataSource();

  ngOnInit() {
    this.heroService.verificarsesion();

    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
    this.getestados();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      console.log(this.id);
      // In a real app: dispatch action to load the details here.
    });

    this.heroService.service_general_get("Clientes/" + this.id, {}).subscribe((value) => {
      this.cliente = value[0];
      console.log(value[0].datos_fiscales[0]);
      this.datosfiscales = value[0].datos_fiscales[0]
      if (value[0].direcciones != "") {
        this.direccion = value[0].direcciones[0];
        console.log(this.direccion.id_estado);
        this.getmunicipios();
      }
      else {
        this.detalle_direccion = [{
          calle_numero: "",
          estado: "",
          colonia: "",
          cp: "",
          municipio: "",

        }]
      }

    });

    this.heroService.service_general("Servicios/Productos_Servicio_Solicitado", {
      "id": this.id
    }).subscribe((value) => {
      //console.log(value);
      if (value != "") {
        this.dataSource.data = value;
      }
      else {
        this.dataSource.data = [];
      }
    });
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  //Catalogos
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

  editar_direccion(obj) {
    this.heroService.service_general("Servicios/Editar_Direccion", this.direccion)
      .subscribe((value) => {
        console.log(value);
      });
  }
}
