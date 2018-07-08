import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';

@Component({
  selector: 'app-asignacion-refacciones',
  templateUrl: './asignacion-refacciones.component.html',
  styleUrls: ['./asignacion-refacciones.component.css']
})
export class AsignacionRefaccionesComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  constructor() { }

  ngOnInit() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

}
