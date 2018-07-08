import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Refacciones, Refacciones_Tecnico } from '../models/refaccion';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-ver-refaccion',
  templateUrl: './ver-refaccion.component.html',
  styleUrls: ['./ver-refaccion.component.css']
})
export class VerRefaccionComponent implements OnInit {

  displayedColumns = ['no', 'nombre', 'cantidad', 'editar'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  //Validaciones
  FormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  matcher = new MyErrorStateMatcher();

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  preventAbuse = false;
  text_busqueda: any = "";

  constructor(private heroService: DatosService, public dialog: MatDialog, private router: Router) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
    this.buscar();
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

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

  editar_refaccion(obj): void {
    let dialogRef = this.dialog.open(DialogEditarRefaccion, {
      width: '800px',
      disableClose: true,
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      //this.router.navigate(['/buscacarservicio/']);
    });
  }

  asignar_refaccion(obj): void {
    let dialogRef = this.dialog.open(DialogAsignarRefaccion, {
      width: '900px',
      disableClose: true,
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this.buscar();
    });
  }

  eliminar_refaccion(obj): void {
    let dialogRef = this.dialog.open(DialogEliminarRefaccion, {
      width: '800px',
      disableClose: true,
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this.buscar();
    });
  }
}

@Component({
  selector: 'dialog-editar-refaccion',
  templateUrl: './dialog-editar-refaccion.html',
})
export class DialogEditarRefaccion {
  public refaccion = new Refacciones();

  constructor(
    public dialogRef: MatDialogRef<DialogEditarRefaccion>,
    @Inject(MAT_DIALOG_DATA) public data: any, private heroService: DatosService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.refaccion = this.data;
    //console.log(this.data)
  }


  editar_refaccion(): void {
    this.heroService.service_general("Refacciones/Actualizar_refaccion", this.refaccion).subscribe((value) => {
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

@Component({
  selector: 'dialog-asignar-refaccion',
  templateUrl: './dialog-asignar-refaccion.html',
})
export class DialogAsignarRefaccion {

  preventAbuse: boolean = true;
  text_busqueda: string = "";
  ver: boolean = false;
  value_productos: any[] = [];


  displayedColumns = ['select', 'nombre', 'almacen', 'email'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<DialogAsignarRefaccion>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog, private heroService: DatosService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log(this.data)
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  set_productos(event, row, index) {
    console.log(row);
    if (event.checked) {
      let dialogRef = this.dialog.open(DialogCantidadRefaccion, {
        width: '400px',
        disableClose: true,
        data: this.data
      });

      dialogRef.afterClosed().subscribe(result => {
        //console.log(result);
        this.value_productos.push({
          //id: row.id,
          nombre: row.nombre,
          id_tecnico: row.id,
          id_material: this.data.id,
          estatus: 1,
          cantidad: localStorage.getItem("cantidad")
        });
      });
     
    }
    else {
      for (var i = 0; i < this.value_productos.length; i++) {
        if (this.value_productos[i].id == row.id) {
          this.value_productos.splice(i, 1);
        }
      }
    }
  };

  delete_tecnico(id) {
    console.log(id);
    for (var i = 0; i < this.value_productos.length; i++) {
      if (this.value_productos[i].id == id) {
        this.value_productos.splice(i, 1);
      }
    }
  };

  buscar() {
    this.preventAbuse = true;
    this.heroService.service_general("clientes/Busqueda_Tecnico", {
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

  asignar_tecnico(obj): void {
    console.log(this.value_productos);
    if (this.value_productos.length > 0) {
      this.heroService.service_general("Refacciones/Asignar_refaccion_tecnico", this.value_productos[0]).subscribe((value) => {
        if (value.response == "OK") {
          this.snackBar.open("Refacción asignada correctamente", "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
          this.dialogRef.close();
        }
      });
    }
    else {
      this.snackBar.open("Debes seleccionar por lo menos a un técnico", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
    
  }
}

@Component({
  selector: 'dialog-eliminar-refaccion',
  templateUrl: './dialog-eliminar-refaccion.html',
})
export class DialogEliminarRefaccion {

  constructor(
    public dialogRef: MatDialogRef<DialogEliminarRefaccion>,
    @Inject(MAT_DIALOG_DATA) public data: any, private heroService: DatosService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  eliminar_refaccion(): void {
    this.heroService.service_general("Refacciones/Eliminar_refaccion", this.data).subscribe((value) => {
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

@Component({
  selector: 'dialog-cantidad-refaccion',
  templateUrl: './dialog-cantidad-refaccion.html',
})
export class DialogCantidadRefaccion {

  refacciones = new Refacciones_Tecnico();
  constructor(
    public dialogRef: MatDialogRef<DialogCantidadRefaccion>,
    @Inject(MAT_DIALOG_DATA) public data: any, private heroService: DatosService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    //console.log(this.data);
  }

  asignar_cantidad(): void {
    console.log(this.data.cantidad);
    console.log(this.refacciones.cantidad);
    //this.data = this.refacciones;
    if (this.refacciones.cantidad > this.data.cantidad) {
      this.snackBar.open("La cantidad asignada no puede ser mayor al stock en inventario", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
    else {
      localStorage.setItem("cantidad", this.refacciones.cantidad.toString());
      this.dialogRef.close();
    }
  }
}
