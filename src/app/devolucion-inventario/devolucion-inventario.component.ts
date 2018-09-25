import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar } from '@angular/material';
import * as jquery from 'jquery';

@Component({
  selector: 'app-devolucion-inventario',
  templateUrl: './devolucion-inventario.component.html',
  styleUrls: ['./devolucion-inventario.component.css']
})
export class DevolucionInventarioComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  displayed = ['Refaccion', 'no_material', 'cantidad', 'devolucion', 'Check'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  preventAbuse = false;
  text_busqueda: string = "";
  almacenes: any = [];
  inventario = new inventario();
  devolucion: any = [];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private heroService: DatosService, private http: HttpClient, private https: Http, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.heroService.service_general("Refacciones/Almacenes", {}).subscribe((value) => {
      this.almacenes = value;
      this.almacenes.push({
        id: 0,
        noalmacen: "531",
        tecnico: "Almacen general"
      });
    });
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  inventario_tecnico() {
    console.log(this.inventario);
    if (this.inventario.noalmacen == undefined) {
      this.inventario.noalmacen = "";
    }

    this.heroService.service_general("Refacciones/Almacenes_Tecnico", this.inventario).subscribe((value) => {
      this.dataSource.data = value;
    });
  }

  buscar() {
    if (this.inventario.noalmacen == undefined) {
      this.inventario.noalmacen = "";
    }

    this.preventAbuse = true;
    this.heroService.service_general("Refacciones/Almacenes_Tecnico", this.inventario).subscribe((value) => {
      //console.log(value);
      setTimeout(() => {
        this.preventAbuse = false;
        this.dataSource.data = value;

      }, 400);
    });
  }

  disable: boolean = false;
  agregar_productos(event, obj) {

    if (event.checked) {
      if (obj.cantidad < $("#txt" + obj.id_refaccion).val()) {
        this.snackBar.open("La cantidad devuelta no puede ser mayor al stock", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
        this.disable = true;
      }
      else {
        this.devolucion.push({
          descripcion: $("#txt" + obj.id_refaccion).val(),
          id_tecnico: obj.id,
          id_material: obj.id_refaccion,
          no_material: obj.id_refaccion,
          refaccion: obj.refaccion,
          id_usuario: JSON.parse(localStorage.getItem("user")).id
        });
        this.disable = false;
      }      
    }
    else {
      for (var i = 0; i < this.devolucion.length; i++) {
        if (this.devolucion[i].id_material == obj.id_refaccion) {
          this.devolucion.splice(i, 1);
        }
      }
    }

    console.log(this.devolucion);
  }

  enviar_devolucion() {
    if (this.devolucion.length == 0) {
      this.snackBar.open("No hay refacciones para ser devueltas", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
    else {
      this.heroService.service_general("Refacciones/Almacenes_Devolucion", this.devolucion).subscribe((value) => {
        this.snackBar.open("La devolución se realizó con exito", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
        this.heroService.service_general("Refacciones/Almacenes_Tecnico", this.inventario).subscribe((value) => {
          this.dataSource.data = value;
        });
      });
    }   
  }
}

export class inventario {
  id: number;
  noalmacen: string;
}
