import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import persons from '../models/mock-login';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-servicio-detalle',
  templateUrl: './servicio-detalle.component.html',
  styleUrls: ['./servicio-detalle.component.css']
})
export class ServicioDetalleComponent implements OnInit {

  preventAbuse = false;
  id: number;
  public sub: any;
  public detalle: string[] = [];
  public detalle_direccion: any[] = [];

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

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      console.log(this.id);
      // In a real app: dispatch action to load the details here.
    });

    this.heroService.service_general_get("Clientes/" + this.id, {}).subscribe((value) => {
      //console.log(value[0]);
      this.detalle = value[0];
      if (value[0].direcciones != "") {
        this.detalle_direccion = value[0].direcciones[0];
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

}
