import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, startWith, concat } from 'rxjs/operators';
import { Refacciones, Refacciones_Tecnico, Cat_Lista_Precios } from '../models/refaccion';
import { DialogNuevoGrupoPrecioComponent } from '../dialogs/dialog-nuevo-grupo-precio/dialog-nuevo-grupo-precio.component';
import { DialogEditarGrupoPrecioComponent } from '../dialogs/dialog-editar-grupo-precio/dialog-editar-grupo-precio.component';
import { DialogEditarPrecioRefaccionComponent } from '../dialogs/dialog-editar-precio-refaccion/dialog-editar-precio-refaccion.component';

@Component({
  selector: 'app-modificar-precios',
  templateUrl: './modificar-precios.component.html',
  styleUrls: ['./modificar-precios.component.css']
})
export class ModificarPreciosComponent implements OnInit {

  public refaccion = new Refacciones();

  displayedColumns_buscar = ['nombre', 'cantidad', 'precio', 'boton'];
  displayedColumns_precio = ['grupo_precio', 'precio', 'boton'];
  dataSource = new MatTableDataSource();
  dataSource_precio = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginator_precio: MatPaginator;

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  listaprecios: any[] = [];
  preventAbuse = false;
  text_busqueda: any = "";
  txt_busqueda_precio: any = "";

  constructor(private heroService: DatosService, public snackBar: MatSnackBar, public dialog: MatDialog) { }

  buscar() {
    this.preventAbuse = true;
    this.heroService.service_general("Refacciones/Busqueda_refaccion", {
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

  buscar_grupo_precio() {
    this.preventAbuse = true;
    this.heroService.service_general("Refacciones/Busqueda_refaccion_Precios", {
      "texto": this.txt_busqueda_precio
    }).subscribe((value) => {
      setTimeout(() => {
        //console.log(value);
        if (value.item == "No hay resultado para la busqueda") {

          this.dataSource_precio.data = [];
        }
        else {
          this.dataSource_precio.data = value;
        }
        this.preventAbuse = false;
      }, 400);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource_precio.paginator = this.paginator_precio;
  }

  ngOnInit() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
    this.getlistaprecios();
    this.buscar();
    this.buscar_grupo_precio();
    //this.heroService.service_general("Refacciones/No_material", {}).subscribe((value) => {
    //  console.log(value);
    //  this.refaccion.no_material = (parseInt(value[0].no_material) + 1).toString();
    //});
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

  validar_refaccion() {
    //console.log(this.refaccion.no_material.toString());
    this.heroService.service_general("Refacciones/no_material_validar", {
      no_material: this.refaccion.no_material.toString()
    })
      .subscribe((value) => {
        console.log(value);
        this.refaccion = value[0];
      });
  }

  nuevo_grupo(obj) {
    let dialogRef = this.dialog.open(DialogNuevoGrupoPrecioComponent, {
      width: '400px',
      disableClose: true,
      data: {  }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      this.buscar_grupo_precio();
      //this.router.navigate(['/buscacarservicio/']);
    });
  }

  editar_grupo(obj) {
    //console.log(obj);
    let dialogRef = this.dialog.open(DialogEditarGrupoPrecioComponent, {
      width: '400px',
      disableClose: true,
      data: { id: obj.grupo_precio}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      //this.buscar_grupo_precio();
      //this.router.navigate(['/buscacarservicio/']);
    });
  }

  editar_precio_refaccion(obj) {
    console.log(obj);
    let dialogRef = this.dialog.open(DialogEditarPrecioRefaccionComponent, {
      width: '400px',
      disableClose: true,
      data: { obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      this.buscar();
      //this.router.navigate(['/buscacarservicio/']);
    });
  }
}

