import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { map, startWith, concat } from 'rxjs/operators';
import { tecnico, tecnico_actividad, tecnico_producto } from '../models/tecnico';
import { Refacciones, Refacciones_Tecnico } from '../models/refaccion';

@Component({
  selector: 'app-info-tecnico',
  templateUrl: './info-tecnico.component.html',
  styleUrls: ['./info-tecnico.component.css']
})
export class InfoTecnicoComponent implements OnInit {
  displayedColumns = ['no', 'nombre', 'cantidad', 'editar'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  public tecnico = new tecnico();
  public tiposervicio: any[] = [];
  public tiposervicio_envio: any[] = [];
  public values: any[] = [];
  public values_envio: any[] = [];
  public ischeck = false;
  public sub: any;
  id: number;
  public text_busqueda: string;
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

  constructor(private heroService: DatosService, private route: ActivatedRoute, public snackBar: MatSnackBar, public dialog: MatDialog, ) { }

  ngOnInit() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.heroService.service_general("servicios/TecnicoInfo", {
      "id": this.id
    }).subscribe((value) => {
      //console.log(value[0]);
      this.heroService.service_general("servicios/Actividades_Tecnicos", value[0])
        .subscribe((data) => {
          this.tiposervicio = data;
          for (var x = 0; x < data.length; x++) {
            if (data[x].check == 1) {
              this.tiposervicio_envio.push({
                id_actividad: data[x].id,
                id_user: this.id
              });
            }
          }
        });

      this.heroService.service_general("servicios/CategoriaProducto_Tecnicos", value[0])
        .subscribe((result) => {
          this.values = result;
          for (var x = 0; x < result.length; x++) {
            if (result[x].check) {
              this.values_envio.push({
                id_categoria_producto: result[x].id,
                id_user: this.id
              });
            }
          }
        });
      this.buscar();
      this.tecnico = value[0]
    });

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  check_actividad(event, value) {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    let _value = "";
    if (event.checked == true) {
      for (var x = 0; x < this.tiposervicio_envio.length; x++) {
        if (this.tiposervicio_envio[x].id_actividad != value.id) {
          _value = value.id;
        }
      }
      this.tiposervicio_envio.push({
        id_actividad: _value,
        id_user: this.id
      });
    }
    else {
      for (var i = 0; i < this.tiposervicio_envio.length; i++) {
        if (this.tiposervicio_envio[i].id_actividad == value.id) {
          this.tiposervicio_envio.splice(i, 1);
        }
      }
    }
  }

  check_producto(event, value) {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    let _value = "";
    if (event.checked == true) {
      for (var x = 0; x < this.values_envio.length; x++) {
        if (this.values_envio[x].id_actividad != value.id) {
          _value = value.id;
        }
      }
      this.values_envio.push({
        id_categoria_producto: _value,
        id_user: this.id
      });
    }
    else {
      for (var i = 0; i < this.values_envio.length; i++) {
        if (this.values_envio[i].id_categoria_producto == value.id) {
          this.values_envio.splice(i, 1);
        }
      }
    }
  }

  registro(obj): void {
    this.tecnico.tecnicos_actividad = this.tiposervicio_envio;
    this.tecnico.tecnicos_producto = this.values_envio;
    this.heroService.service_general("Servicios/Editar_Tecnico", this.tecnico)
      .subscribe((value) => {
        //console.log(value);
        this.snackBar.open("Técnico actualizado correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      });

    console.log(this.tecnico);
  }

  buscar() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.heroService.service_general("Refacciones/Inventario_tecnico", {
      id: this.id,
      noalmacen: this.text_busqueda
    })
      .subscribe((result) => {
        console.log(result);
        this.dataSource.data = result.item;
      });
  }

  limpiartabla() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.heroService.service_general("Refacciones/Inventario_tecnico", {
      id: this.id,
      noalmacen: ""
    })
      .subscribe((result) => {
        this.dataSource.data = result;
        this.text_busqueda = "";
      });
  }

  editar_refaccion(obj): void {
    console.log(obj);
    let dialogRef = this.dialog.open(DialogEditarRefaccionTecnico, {
      width: '800px',
      disableClose: true,
      data: obj
    });

    //dialogRef.afterClosed().subscribe(result => {
    //  //console.log(result);
    //  //this.router.navigate(['/buscacarservicio/']);
    //});
  }

  eliminar_refaccion(obj): void {
    let dialogRef = this.dialog.open(DialogEliminarRefaccionTecnico, {
      width: '800px',
      disableClose: true,
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this.heroService.service_general("Refacciones/Inventario_tecnico", this.tecnico)
        .subscribe((result) => {
          console.log(result);
          if (result.item = "No hay resultado para la busqueda") {
            this.dataSource.data = [];
          }
          else {
            this.dataSource.data = result;
          }

        });
    });
  }
}

@Component({
  selector: 'dialog-editar-refaccion',
  templateUrl: './dialog-editar-refaccion.html',
})
export class DialogEditarRefaccionTecnico {
  public refaccion = new Refacciones_Tecnico();
  public _cantidad: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogEditarRefaccionTecnico>,
    @Inject(MAT_DIALOG_DATA) public data: any, private heroService: DatosService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.refaccion = this.data;
    //console.log(this.data)
    this._cantidad = this.data.cantidad;
  }

  cambiar_cantidad() {
    let cantidad_base: number = 0;

    //console.log(this.refaccion.cantidad - this._cantidad);
    //return cantidad_base = this.refaccion.cantidad - this._cantidad;
    this.refaccion.id_grupo_precio = this.refaccion.cantidad - this._cantidad;
  }

  editar_refaccion(): void {
    this.heroService.service_general("Refacciones/Actualizar_refaccion_tecnico", this.refaccion).subscribe((value) => {
      if (value.response == "OK") {
        this.snackBar.open("Refacción actualizada correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      }
      else {
        this.snackBar.open(value.response, "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      }
    });
  }
}

@Component({
  selector: 'dialog-eliminar-refaccion',
  templateUrl: './dialog-eliminar-refaccion.html',
})
export class DialogEliminarRefaccionTecnico {

  constructor(
    public dialogRef: MatDialogRef<DialogEliminarRefaccionTecnico>,
    @Inject(MAT_DIALOG_DATA) public data: any, private heroService: DatosService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  eliminar_refaccion(): void {
    this.heroService.service_general("Refacciones/Eliminar_refaccion_tecnico", this.data).subscribe((value) => {
      if (value.response == "OK") {
        this.snackBar.open("Refacción eliminada correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      }
    });
  }
}
