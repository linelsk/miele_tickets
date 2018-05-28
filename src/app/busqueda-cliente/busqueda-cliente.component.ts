import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';

@Component({
  selector: 'app-busqueda-cliente',
  templateUrl: './busqueda-cliente.component.html',
  styleUrls: ['./busqueda-cliente.component.css']
})
export class BusquedaClienteComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  preventAbuse = false;
  text_busqueda: any = "";

  displayedColumns = ['nombre', 'tipo', 'email', 'telefono', 'celular', 'fecha'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private heroService: DatosService, private http: HttpClient, private https: Http) { }

  ngOnInit() {

    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.buscar();

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  buscar() {
    this.preventAbuse = true;
    this.heroService.service_general("clientes/Busqueda_Cliente", {
      "texto": this.text_busqueda
    }).subscribe((value) => {
      setTimeout(() => {
        console.log(value);
        if (value.item == "No hay resultado para la busqueda") {

          this.dataSource.data = [];
        }
        else {
          this.dataSource.data = value;
        }
        this.preventAbuse = false;
      }, 400);
    });
  }
}
