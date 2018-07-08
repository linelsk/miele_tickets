import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar } from '@angular/material';
import { Refacciones } from '../models/refaccion';

@Component({
  selector: 'app-nuevo-refaccion',
  templateUrl: './nuevo-refaccion.component.html',
  styleUrls: ['./nuevo-refaccion.component.css']
})
export class NuevoRefaccionComponent implements OnInit {
  public refaccion = new Refacciones();

  displayedColumns = ['no', 'nombre', 'cantidad'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  listaprecios: any[] = [];

  constructor(private heroService: DatosService, public snackBar: MatSnackBar) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
    this.getlistaprecios();

    this.heroService.service_general("Refacciones/No_material", {}).subscribe((value) => {
      console.log(value);
      this.refaccion.no_material = (parseInt(value[0].no_material) + 1).toString();
    });
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  //Catalogos
  getlistaprecios(): void {
    this.heroService.service_general("Catalogos/ListaPrecios", {})
      .subscribe((value) => {
        this.listaprecios = value;
      });
  }

  guardar_refaccion() {
    this.heroService.service_general("Refacciones/Guardar_refaccion", this.refaccion).subscribe((value) => {
      if (value.response == "OK") {
        this.snackBar.open("Refacción actualizada correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      }
    });
  }
}
