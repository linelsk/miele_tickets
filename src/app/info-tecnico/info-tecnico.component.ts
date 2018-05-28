import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-info-tecnico',
  templateUrl: './info-tecnico.component.html',
  styleUrls: ['./info-tecnico.component.css']
})
export class InfoTecnicoComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

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
  public sub: any;
  id: number;

  constructor(private heroService: DatosService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.heroService.service_general("servicios/TecnicoInfo", {
      "id": 35
    }).subscribe((value) => {
      console.log(value[0]);
      this.user = value[0]
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }
}
