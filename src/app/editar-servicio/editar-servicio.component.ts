import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { DatosService } from '../datos.service';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { CalendarEvent } from 'angular-calendar';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Lightbox } from 'angular2-lightbox';

@Component({
  selector: 'app-editar-servicio',
  templateUrl: './editar-servicio.component.html',
  styleUrls: ['./editar-servicio.component.css']
})
export class EditarServicioComponent implements OnInit {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  id: number;
  public sub: any;
  public detalle: string[] = [];
  public servicio_detalle: any[] = [];
  public servicio_reporte: string[] = [];
  public detalle_direccion: string[] = [];
  public detalle_visita: string[] = [];
  public tiposervicio: string[] = [];
  dllestatusservicio: number = 0;
  panelOpenState: boolean = false;
  mostrar_distribuidor: boolean = false;
  text_editaribs: string = ""; 
  private _albums: any[] = [];

  foods = [
    { value: '1', viewValue: 'Cancelar' },
    { value: '2', viewValue: 'Reagendar' }
  ];

  constructor(private heroService: DatosService, private route: ActivatedRoute, public dialog: MatDialog, public snackBar: MatSnackBar, private _lightbox: Lightbox) { }

  image_url = this.heroService.imageUrl;

  displayedColumns = ['#Servicio', 'Modelo', 'SKU', 'Tipo', 'Garantia', 'Poliza', 'Estatus'];
  dataSource = new MatTableDataSource();

  displayedColumns_visita = ['#Servicio', 'Modelo', 'SKU', 'Tipo', 'Garantia', 'Poliza', 'Estatus'];
  dataSource_visita = new MatTableDataSource();

  @ViewChild("fileInput") fileInput;
  fileToUpload: any[] = [];
  response; string;

  addFile(): void {
    let fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {

      //this.fileToUpload.push({
      //  file: fi.files[0],
      //  id_visita: 1,
      //  id_producto: 1,
      //  creado: this.heroService.fecha_hoy(),
      //  creadopor: 1
      //})
      console.log(fi.files[0]);
      this.heroService.upload(fi.files[0]).subscribe((value) => {
        console.log(value);
        this.response = value;

        this.heroService.service_general("Servicios/Guardar_Imagen_Producto", {
          "id_visita": 1,
          "id_producto": 1,
          "path": this.response.response,
          "estatus": 1,
          "creado": "01/01/1900",
          "creadopor": 1
        }).subscribe((value) => {
          console.log(this.response.response);
        });
      });
    }
  }

  ngOnInit() {
    this.heroService.verificarsesion();
    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
      //console.log(value[0].);
      this.servicio_detalle = value[0];
      this.dataSource.data = value[0].productos;
      this.dataSource_visita.data = value[0].productos;
      this.detalle_visita = value[0].visitas;
      this.dllestatusservicio = value[0].id_estatus;
      this.servicio_reporte = value[0].visitas;
      console.log(this.servicio_reporte);
      this.heroService.service_general_get("Clientes/" + value[0].id_cliente, {}).subscribe((result) => {
        //console.log(result[0]);
        this.detalle = result[0];
        this.detalle_direccion = result[0].direcciones[0];
      });
    });
  }

  open(index: number, obj: any): void {
    console.log(obj);
    console.log(index);
    this._albums = [];

    const src = 'http://104.130.1.18' + obj;
    const thumb = 'http://104.130.1.18' + obj + '-thumb.jpg';
    const album = {
      src: src,
      thumb: thumb
    };

    this._albums.push(album);

    this._lightbox.open(this._albums, 0);
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  editar_ibs() {
    this.mostrar_distribuidor = true;
  }

  guardar_ibs() {
    this.mostrar_distribuidor = false;
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.heroService.service_general("servicios/Actualizar_ibs", {
      "id": this.id,
      "numero": this.text_editaribs
    }).subscribe((value) => {
      this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
        //console.log(value[0].visitas);
        this.servicio_detalle = value[0];
      });
      this.snackBar.open("IBS editado correctamente", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    });
  }

  guadar_estatus() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    console.log(this.text_editaribs);
    if (this.text_editaribs != "") {
      this.heroService.service_general("servicios/Actualizar_estatus", {
        "id": this.id,
        "numero": this.dllestatusservicio
      }).subscribe((value) => {
        this.snackBar.open("Estatus de servico editado correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      });
    }
    else {
      this.snackBar.open("Para guardar el servicio es necesario ingresar un IBS", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
  }

  openEstatus(obj): void {
    if (obj == 1) {
      this.sub = this.route.params.subscribe(params => {
        this.id = +params['id'];
      });
    }

    let dialogRef = this.dialog.open(DialogEditarEstatus, {
      width: '350px',
      disableClose: true,
      data: { id: this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != undefined) {
        if (this.text_editaribs != "") {
          this.heroService.service_general("servicios/Actualizar_estatus_servicio_visita", {
            "id": result.id
          }).subscribe((value) => {
            this.snackBar.open("Estatus de servico editado correctamente", "", {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              extraClasses: ['blue-snackbar']
            });
            this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
              this.servicio_detalle = value[0];
              this.detalle_visita = value[0].visitas;
            });
          });
        }
        else {
          this.snackBar.open("Para guardar el servicio es necesario ingresar un IBS", "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
        }
      }
    });
  }

  openFinal(obj): void {
    if (obj == 1) {
      this.sub = this.route.params.subscribe(params => {
        this.id = +params['id'];
      });
    }

    let dialogRef = this.dialog.open(DialogFinal, {
      width: '350px',
      disableClose: true,
      data: { id: this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != undefined) {
        this.heroService.service_general("servicios/Actualizar_estatus_final", {
          "id": result.id
        }).subscribe((value) => {
          this.snackBar.open("Status de servico editado correctamente", "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
          this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
            this.servicio_detalle = value[0];
            this.detalle_visita = value[0].visitas;
          });
        });
      }
    });
  }
  rdconfirmado: any = 0;
  openCancelar(obj): void {
    if (obj == 1) {
      this.sub = this.route.params.subscribe(params => {
        this.id = +params['id'];
      });
    }

    let dialogRef = this.dialog.open(DialogCancelarEstatus, {
      width: '350px',
      disableClose: true,
      data: { id: this.id, status: this.rdconfirmado }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if (result != undefined) {
        this.heroService.service_general("servicios/Actualizar_estatus_cancelado", {
          "id": result.id,
          "numero": result.status
        }).subscribe((value) => {
          this.snackBar.open("Servico cancelado correctamente", "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
          this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
            this.servicio_detalle = value[0];
            this.detalle_visita = value[0].visitas;
          });
        });
      }
    });
  }
}

@Component({
  selector: 'dialog-final',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-final.html',
})
export class DialogFinal {

  constructor(
    public dialogRef: MatDialogRef<DialogFinal>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private heroService: DatosService, private route: ActivatedRoute, public snackBar: MatSnackBar) { }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editar_estatus() {
    console.log(this.data.id);
  }
}

@Component({
  selector: 'dialog-editar-estatus',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-editar-estatus.html',
})
export class DialogEditarEstatus {

  constructor(
    public dialogRef: MatDialogRef<DialogEditarEstatus>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private heroService: DatosService, private route: ActivatedRoute, public snackBar: MatSnackBar) { }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editar_estatus() {
    console.log(this.data.id);
  }
}

@Component({
  selector: 'dialog-cancelar-servicio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-cancelar-servicio.html',
})
export class DialogCancelarEstatus {

  constructor(
    public dialogRef: MatDialogRef<DialogCancelarEstatus>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private heroService: DatosService, private route: ActivatedRoute, public snackBar: MatSnackBar) { }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editar_estatus() {
    console.log(this.data.id);
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'snack-bar-component-example-snack.html',
  styles: [`.example-pizza-party { color: hotpink; }`],
})
export class PizzaPartyComponent { }
