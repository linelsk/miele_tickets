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
import { CalendarioComponent } from '../calendario/calendario.component';

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
  value_productos: Productos_Servicio[] = [];
  value_productos_servicio: any[] = [];
  id_producto_enviar: string = "";

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
      this.value_productos = value[0].productos;
      this.dataSource_visita.data = value[0].productos;
      this.detalle_visita = value[0].visitas;
      this.dllestatusservicio = value[0].id_estatus;
      this.servicio_reporte = value[0].visitas;
      //console.log(this.servicio_reporte);
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

  editar_ibs(txt) {
    this.mostrar_distribuidor = true;
    this.text_editaribs = txt;
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
      //console.log(this.servicio_detalle[0].ibs);
      if (result != undefined || result != "") {
        this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
          console.log(value[0].ibs);
          if (value[0].ibs != "") {
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
        });

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
  confirmacion_cancel(): void {

  };

  openCancelar(obj): void {

    setTimeout(() => {    //<<<---    using ()=> syntax
      this.servicio_detalle = JSON.parse(localStorage.getItem("servicio_detalle"))
      this.detalle_visita = JSON.parse(localStorage.getItem("detalle_visita"))
    }, 5000);

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
      //console.log(this.rdconfirmado);

    });
  }

  tecnicos: any[] = [];
  tipo_servicio: any[] = [];
  visita = new visita();
  nueva_visita = new nueva_visita();
  openAgenda(obj): void {

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.tecnicos = [];
    this.id_producto_enviar = "";

    this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((resp) => {
      console.log(resp[0].visitas[obj].id);
      for (var i = 0; i < resp[0].productos.length; i++) {
        this.id_producto_enviar += resp[0].productos[i].id + ",";
      }

      this.tipo_servicio.push({
        "desc_tipo_servicio": "",
        "id": resp[0].id_tipo_servicio
      })

      //console.log(this.id_producto_enviar);
      this.heroService.service_general("servicios/TecnicoAgenda", { id: resp[0].id_tipo_servicio, productos: this.id_producto_enviar }).subscribe((value) => {
        console.log(value);
        for (var i = 0; i < value.length; i++) {
          this.tecnicos.push({
            id: value[i].id,
            tecnico: value[i].nombre + " " + value[i].paterno + " " + value[i].materno,
            tecnico_color: value[i].tecnico_color
          });
        }

        let dialogRef = this.dialog.open(CalendarioComponent, {
          width: '100%',
          height: '95%',
          disableClose: true,
          data: { tecnicos: this.tecnicos, tipo_servicio: this.tipo_servicio, horas_tecnico: 0, no_tecnico: 1, id_producto_enviar: this.id_producto_enviar }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(resp[0].visitas[obj].id);
          this.visita.id = resp[0].visitas[obj].id;
          this.visita.id_tecnico = JSON.parse(localStorage.getItem("agenda")).tecnico[0].id;
          this.visita.fecha_visita = JSON.parse(localStorage.getItem("agenda")).fecha;
          this.visita.hora = JSON.parse(localStorage.getItem("agenda")).event;
          this.heroService.service_general("servicios/Actualizar_visita", this.visita).subscribe((value) => {

            this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
              console.log(value[0].visitas);
              this.detalle_visita = value[0].visitas;
            });
          });

        });
      });
    });
  }

  openAgendaVisita(): void {

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.tecnicos = [];
    this.id_producto_enviar = "";

    this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((resp) => {
      //console.log(resp[0].visitas[obj].id);
      for (var i = 0; i < resp[0].productos.length; i++) {
        this.id_producto_enviar += resp[0].productos[i].id + ",";
      }

      this.tipo_servicio.push({
        "desc_tipo_servicio": "",
        "id": resp[0].id_tipo_servicio
      })

      //console.log(this.id_producto_enviar);
      this.heroService.service_general("servicios/TecnicoAgenda", { id: resp[0].id_tipo_servicio, productos: this.id_producto_enviar }).subscribe((value) => {
        console.log(value);
        for (var i = 0; i < value.length; i++) {
          this.tecnicos.push({
            id: value[i].id,
            tecnico: value[i].nombre + " " + value[i].paterno + " " + value[i].materno,
            tecnico_color: value[i].tecnico_color
          });
        }

        let dialogRef = this.dialog.open(CalendarioComponent, {
          width: '100%',
          height: '95%',
          disableClose: true,
          data: { tecnicos: this.tecnicos, tipo_servicio: this.tipo_servicio, horas_tecnico: 0, no_tecnico: 1, id_producto_enviar: this.id_producto_enviar }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(resp[0]);
          this.nueva_visita.id_servicio = resp[0].visitas[0].id_servicio;
          this.nueva_visita.id_direccion = resp[0].visitas[0].id_direccion;
          this.nueva_visita.id_direccion = resp[0].visitas[0].id_direccion;
          this.nueva_visita.actividades_realizar = resp[0].productos;
          this.nueva_visita.servicio_producto = resp[0].visitas[0].actividades_realizar;
          this.nueva_visita.id_tecnico = JSON.parse(localStorage.getItem("agenda")).tecnico[0].id;
          this.nueva_visita.fecha_visita = JSON.parse(localStorage.getItem("agenda")).fecha;
          this.nueva_visita.hora = JSON.parse(localStorage.getItem("agenda")).event;
          this.heroService.service_general("servicios/Agregar_visita", this.nueva_visita).subscribe((value) => {

            this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
              console.log(value[0].visitas);
              this.detalle_visita = value[0].visitas;
            });
          });
        });
      });
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
    console.log(this.data);


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

  rdconfirmado: any = 0;
  editar_estatus() {
    console.log(this.rdconfirmado);

    if (this.data != undefined) {
      this.heroService.service_general("servicios/Actualizar_estatus_cancelado", {
        "id": this.data.id,
        "numero": this.rdconfirmado
      }).subscribe((value) => {
        this.snackBar.open("Servico cancelado correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });

        this.heroService.service_general_get("servicios/" + this.data.id, {}).subscribe((value) => {
          localStorage.setItem("servicio_detalle", JSON.stringify((value[0])));
          localStorage.setItem("detalle_visita", JSON.stringify((value[0].visitas)));
        });
      });
    }
  }
}

@Component({
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'snack-bar-component-example-snack.html',
  styles: [`.example-pizza-party { color: hotpink; }`],
})
export class PizzaPartyComponent { }

export class Productos_Servicio {
  id_producto: number;
  modelo: string;
  sku: string;
  tipo: string;
  hora_tecnico: number;
  hora_precio: string;
  precio_visita: number;
}

export class visita {
  id: number;
  fecha_visita: string;
  id_tecnico: number;
  hora: string;
}

export class nueva_visita {
  id_servicio: number;
  id_direccion: number;
  fecha_visita: string;
  id_tecnico: number;
  hora: string;
  hora_fin: string;
  actividades_realizar: string;
  concepto: string;
  cantidad: number;
  pagado: boolean = false;
  pago_pendiente: boolean = false;
  garantia: boolean = false;
  fecha_deposito: string;
  fecha_inicio_visita: string;
  no_operacion: string;
  comprobante: string;
  terminos_condiciones: boolean = true;
  factura: boolean = false;
  estatus: number

  servicio_producto: Rel_servicio_visita_producto[] = [];
}

export class Rel_servicio_visita_producto {
  id_producto: number;
  descripcion_cierre: string;
  estatus: number = 1;

}
