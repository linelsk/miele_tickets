import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
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
import { tecnico } from '../models/cliente';
import { Refacciones } from '../models/refaccion';
import { log } from 'util';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { Router } from '@angular/router';
import * as jquery from 'jquery';
import * as jsPDF from 'jspdf'
import * as moment from 'moment';
import { } from '@types/googlemaps';

declare var MarkerClusterer: any;
@Component({
  selector: 'app-editar-servicio',
  templateUrl: './editar-servicio.component.html',
  styleUrls: ['./editar-servicio.component.css']
})
export class EditarServicioComponent implements OnInit {

  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  servicio = new servicio();

  id: number;
  public sub: any;
  public detalle: string[] = [];
  public servicio_detalle: any[] = [];
  public servicio_reporte: string[] = [];
  public detalle_direccion: string[] = [];
  public detalle_visita: string[] = [];
  public tiposervicio: string[] = [];
  public prediagnostico = new prediagnostico();
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

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: any[] = [];
  materiales: any[] = [];
  public refacciones = new Refacciones();
  allFruits: any[] = [];
  asignacion_tecnico1: any = [];
  asignacion_tecnico2: any = [];
  _tecnico1: any;
  _tecnico2: any;

  @ViewChild('fruitInput') fruitInput: ElementRef;

  constructor(private heroService: DatosService, private route: ActivatedRoute, public dialog: MatDialog, public snackBar: MatSnackBar, private _lightbox: Lightbox, private router: Router) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: any | null) => fruit ? this._filter(fruit) : this.allFruits));
  }

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

      //(fi.files[0]);
      this.heroService.upload(fi.files[0]).subscribe((value) => {
        //(value);
        this.response = value;

        this.heroService.service_general("Servicios/Guardar_Imagen_Producto", {
          "id_visita": 1,
          "id_producto": 1,
          "path": this.response.response,
          "estatus": 1,
          "creado": "01/01/1900",
          "creadopor": 1
        }).subscribe((value) => {
          //(this.response.response);
        });
      });
    }
  }

  estatus_prediagnostico: boolean;
  refacciones_asignadas: any[] = [];
  asignacion_refacciones: any;
  //asignacion_refacciones_validar: any;
  tiempo_vista: any;

  google_maps(lat_in, lon_in) {
    //console.log(lat_in + " " + lon_in);
    //var map = new google.maps.Map(document.getElementById('gmap'), {
    //  center: { lat: 19.36730338792858, lng: -99.26228728557646 },
    //  zoom: 14,
    //  mapTypeId: google.maps.MapTypeId.ROADMAP
    //});
    //console.log(this.gmapElement);
    //var _map = new google.maps.Map(document.getElementById('gmap'));
    //console.log(_map);
    var mapProp = {
      center: new google.maps.LatLng(lat_in, lon_in),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.ROADMAP
      //mapTypeId: google.maps.MapTypeId.HYBRID
      // mapTypeId: google.maps.MapTypeId.SATELLITE
      // mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    var marker = new google.maps.Marker({ position: mapProp.center });
    marker.setMap(this.map);

    //var infowindow = new google.maps.InfoWindow({
    //  content: "Hey, We are here"
    //});
    //infowindow.open(this.map, marker);
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
      //console.log(value[0].id_tipo_servicio);
      this.asignacion_refacciones = value[0].visitas[0].asignacion_refacciones;
      //this.asignacion_refacciones_validar = value[0].visitas[0].asignacion_refacciones;
      this.detalle_visita = value[0].visitas;

      //console.log(value[0].visitas);
      if (value[0].visitas.length != 0) {
        let hora1: any = (value[0].visitas[0].hora_fin).split(":"),
          hora2: any = (value[0].visitas[0].hora_inicio).split(":"),
          t1 = new Date(),
          t2 = new Date();

        t1.setHours(hora1[0], hora1[1], hora1[2]);
        t2.setHours(hora2[0], hora2[1], hora2[2]);

        t1.setHours(t1.getHours() - t2.getHours(),
          t1.getMinutes() - t2.getMinutes(),
          t1.getSeconds() - t2.getSeconds()
        );

        this.tiempo_vista = (t1.getHours() ? t1.getHours() + (t1.getHours() > 1 ? " horas" : " hora") : "") + (t1.getMinutes() ? ", " + t1.getMinutes() + " minutos" : "") + (t1.getSeconds() ? (t1.getHours() || t1.getMinutes() ? " y " : "") + t1.getSeconds() + " segundos" : "");
        //console.log(value[0].visitas[0].hora_fin - value[0].visitas[0].hora);
        this.prediagnostico.id_visita = value[0].visitas[0].id;
        this.estatus_prediagnostico = value[0].visitas[0].pre_diagnostico ? true : false;

        this.heroService.service_general("Refacciones/Asignar_Refacciones", {
          id: value[0].visitas[0].id
        }).subscribe((response) => {
          console.log(response[0]);
          this.refacciones_asignadas = response[0];
          if (response[0].tecnicos.length > 1) {
            this.asignacion_tecnico1 = response[0].tecnicos[0];
            this.asignacion_tecnico2 = response[0].tecnicos[1];
          }
          else {
            this.asignacion_tecnico1 = response[0].tecnicos[0];
            this.asignacion_tecnico2 = [];
          }

          });
        //setTimeout(() => {
        //  this.google_maps(value[0].visitas[0].latitud_inicio, value[0].visitas[0].longitud_inicio);
        //}, 400);
      }

      this.servicio = value[0];
      this.servicio_detalle = value[0];
      this.dataSource.data = value[0].productos;
      this.value_productos = value[0].productos;
      //this.dataSource_visita.data = value[0].productos;   
      this.dllestatusservicio = value[0].id_estatus;
      this.servicio_reporte = value[0].visitas;
      //console.log(this.estatus_prediagnostico);
      this.heroService.service_general_get("Clientes/" + value[0].id_cliente, {}).subscribe((result) => {
        //console.log(result[0]);
        this.detalle = result[0];
        this.detalle_direccion = result[0].direcciones[0];
      });
    });

    //Refacciones
    this.heroService.service_general("Refacciones/Busqueda_refaccion", {
      "texto": ""
    }).subscribe((value) => {
      setTimeout(() => {
        //console.log(value);
        this.refacciones = value;
        this.allFruits = value;
        //this.allFruits = [
        //  { id: "1", name: "CDMX" }, { id: "2", name: "Estado de México" }, { id: "3", name: "Aguascalientes" }
        //]
        //console.log(this.allFruits);
      }, 400);
    });

  }

  ver_mapa(lat, lon) {

    console.log(lat + "---" + lon);
    this.google_maps(lat, lon);
  }

  open(index: number, obj: any): void {
    //(obj);
    //(index);
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
    //(this.text_editaribs);
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
          //(value[0].ibs);
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
      //(result);
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
  visita_reagendar = new visita_reagendar();
  openAgenda(obj): void {

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.tecnicos = [];
    this.id_producto_enviar = "";
    this.categoria_servicio = 0;

    this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((resp) => {
      console.log(resp[0]);
      for (var i = 0; i < resp[0].productos.length; i++) {
        this.id_producto_enviar += resp[0].productos[i].id + ",";
      }

      for (var i = 0; i < resp[0].productos.length; i++) {
        this.heroService.service_general("servicios/Producto_Categoria_Info", { id_cliente: resp[0].productos[i].id, id_tipo: resp[0].id_tipo_servicio }).subscribe((producto) => {
          console.log(producto[0]);
          this.categoria_servicio = this.categoria_servicio + parseFloat(producto[0].horas_tecnico);
          if (producto[0].no_tecnicos == null) {
            this.no_tecnico = 1;
          }
          else {
            this.no_tecnico = parseInt(producto[0].no_tecnicos);
          }

          this.categoria_servicio_cantidad = (this.categoria_servicio * producto[0].precio_hora_tecnico) + producto[0].precio_visita;
        });
      }

      this.tipo_servicio.push({
        "desc_tipo_servicio": resp[0].tipo_servicio,
        "id": resp[0].id_tipo_servicio
      })

      //console.log(this.id_producto_enviar);
      this.heroService.service_general("servicios/TecnicoAgenda", { id: resp[0].id_tipo_servicio, productos: this.id_producto_enviar }).subscribe((value) => {
        //(value);
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
          data: { tecnicos: this.tecnicos, tipo_servicio: this.tipo_servicio, horas_tecnico: this.categoria_servicio, no_tecnico: this.no_tecnico, id_producto_enviar: this.id_producto_enviar }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(resp[0]);
          if (result != undefined) {
            this.visita_reagendar.id = resp[0].visitas[obj].id;
            this.visita_reagendar.id_tecnico = JSON.parse(localStorage.getItem("agenda")).tecnico[0].id;
            this.visita_reagendar.fecha_visita = JSON.parse(localStorage.getItem("agenda")).fecha;
            this.visita_reagendar.hora = JSON.parse(localStorage.getItem("agenda")).event;
            this.visita_reagendar.hora_fin = parseFloat(localStorage.getItem("fecha_fin")).toString();
            this.heroService.service_general("servicios/Actualizar_visita", this.visita_reagendar).subscribe((value) => {

              this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
                (value[0].visitas);
                this.detalle_visita = value[0].visitas;
              });
            });

          }

        });
      });
    });
  }

  categoria_servicio: number = 0;
  no_tecnico: number = 0;
  categoria_servicio_cantidad: number;
  tecnicos_visita: any[] = [];
  openAgendaVisita(): void {

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.tecnicos = [];
    this.id_producto_enviar = "";

    this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((resp) => {
      console.log(resp[0]);
      for (var i = 0; i < resp[0].productos.length; i++) {
        this.id_producto_enviar += resp[0].productos[i].id_categoria + ",";
        this.value_productos_servicio.push({
          estatus: 1,
          id_producto: resp[0].productos[i].id
        });
      }

      for (var i = 0; i < resp[0].productos.length; i++) {
        this.heroService.service_general("servicios/Producto_Categoria_Info", { id_cliente: resp[0].productos[i].id, id_tipo: resp[0].id_tipo_servicio }).subscribe((producto) => {
          console.log(producto[0]);
          this.categoria_servicio = this.categoria_servicio + parseFloat(producto[0].horas_tecnico);
          if (producto[0].no_tecnicos == null) {
            this.no_tecnico = 1;
          }
          else {
            this.no_tecnico = parseInt(producto[0].no_tecnicos);
          }

          this.categoria_servicio_cantidad = (this.categoria_servicio * producto[0].precio_hora_tecnico) + producto[0].precio_visita;
        });
      }

      this.tipo_servicio.push({
        "desc_tipo_servicio": resp[0].tipo_servicio,
        "id": resp[0].id_tipo_servicio
      })

      this.heroService.service_general("servicios/TecnicoAgenda", { id: resp[0].id_tipo_servicio, productos: this.id_producto_enviar }).subscribe((value) => {
        //console.log(value);
        for (var i = 0; i < value.length; i++) {
          this.tecnicos.push({
            id: value[i].id,
            tecnico: value[i].nombre + " " + value[i].paterno + " " + value[i].materno,
            tecnico_color: value[i].tecnico_color
          });
        }
        console.log(this.tipo_servicio);
        let dialogRef = this.dialog.open(CalendarioComponent, {
          width: '100%',
          height: '95%',
          disableClose: true,
          data: { tecnicos: this.tecnicos, tipo_servicio: this.tipo_servicio, horas_tecnico: this.categoria_servicio, no_tecnico: this.no_tecnico, id_producto_enviar: this.id_producto_enviar }
        });
        dialogRef.afterClosed().subscribe(result => {
          //console.log(parseFloat(localStorage.getItem("fecha_fin"));
          if (result != undefined) {
            for (var i = 0; i < JSON.parse(localStorage.getItem("tecnicos_visita")).length; i++) {
              this.tecnicos_visita.push({
                id_servicio: this.id,
                id_direccion: resp[0].visitas[0].id_direccion,
                fecha_visita: JSON.parse(localStorage.getItem("agenda")).fecha,
                id_tecnico: JSON.parse(localStorage.getItem("tecnicos_visita"))[i].id,
                hora: JSON.parse(localStorage.getItem("agenda")).event,
                actividades_realizar: resp[0].actividades_realizar,
                concepto: resp[0].visitas[0].concepto,
                cantidad: this.categoria_servicio_cantidad,
                pagado: true,
                pago_pendiente: false,
                garantia: false,
                fecha_deposito: "01/01/1900",
                no_operacion: "1",
                comprobante: "",
                terminos_condiciones: true,
                factura: false,
                servicio_producto: this.value_productos_servicio,
                hora_fin: parseInt(localStorage.getItem("fecha_fin"))
              })
            }

            console.log(this.tecnicos_visita[0]);
            this.heroService.service_general("servicios/Agregar_visita", this.tecnicos_visita[0]).subscribe((value) => {

              this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
                //(value[0].visitas);
                this.detalle_visita = value[0].visitas;
              });
            });
          }
        });
      });
    });
  }

  cancelarVisita(id) {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    let dialogRef = this.dialog.open(DialogEditarEstatusVisita, {
      width: '350px',
      disableClose: true,
      data: { id: id, id_servicio: this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result != undefined) {
        this.heroService.service_general_get("servicios/" + result.id_servicio, {}).subscribe((value) => {
          this.detalle_visita = value[0].visitas;
        });
      }

    });
  }

  //Chips
  //add(event: MatChipInputEvent): void {
  //  console.log("add");
  //  const input = event.input;
  //  const value = event.value;

  //  // Add our fruit
  //  if ((value || '').trim()) {
  //    this.fruits.push(value.trim());
  //  }

  //  // Reset the input value
  //  if (input) {
  //    input.value = '';
  //  }

  //  this.fruitCtrl.setValue(null);
  //}

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value);
    this.materiales.push({
      "id_material": event.option.value.id
    });
    this.fruits.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  private _filter(value: any): string[] {
    //console.log(this.allFruits);
    //console.log(value);
    if (value.id == undefined) {
      const filterValue = value.toLowerCase();
      return this.allFruits.filter(fruit => fruit.descripcion.toLowerCase().indexOf(filterValue) === 0);
    }
    else {
      const filterValue = value.descripcion.toLowerCase();
      return this.allFruits.filter(fruit => fruit.descripcion.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  guardar_prediagnostico() {
    this.heroService.service_general("Refacciones/Prediagnostico", {
      id_visita: this.prediagnostico.id_visita,
      observaciones: this.prediagnostico.observaciones,
      refacciones: this.materiales
    }).subscribe((value) => {
      if (value.response = "OK") {
        this.sub = this.route.params.subscribe(params => {
          this.id = +params['id'];
        });
        this.heroService.service_notificacion({
          descripcion: 'El servicio número ' + this.id + ' tiene prediagnostico concluido y puede realizar la solucitud de asignacion de técnico responsable y refacciones',
          estatus_leido: false,
          evento: 'Prediagnostico concluido ',
          rol_notificado: 10010,
          creado: this.heroService.fecha_hoy(),
          creadopor: JSON.parse(localStorage.getItem("user")).id
        }).subscribe((notificacion) => { });
        this.snackBar.open("Prediagnostico guardado correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
        this.router.navigate(['/ultimosservicios/']);
      }
    });
  }

  materiales_asignacion_envio: any = "";
  tecnicos_asignacion_envio: any = "";
  garantia_asignacion_envio: any = "";
  fecha_refacciones_entrega: any = "01/01/1900";
  asignar_refacciones(obj) {
    //console.log(this.materiales_asignacion.length);
    //if (this.refacciones_asignadas[0].refacciones.le)
    //if (this.materiales_asignacion.length == 0) {
    //  this.snackBar.open("Debes elegir por lo menos una refacción", "", {
    //    duration: 5000,
    //    verticalPosition: 'bottom',
    //    horizontalPosition: 'right',
    //    extraClasses: ['blue-snackbar']
    //  });
    //}
    //else {

    //}

    //console.log(new Date(this.fecha_refacciones_entrega));
    //console.log(moment(obj[0].fecha_visita));
    //if (new Date(this.fecha_refacciones_entrega) < new Date(obj[0].fecha_visita)) {
    //  console.log(new Date(this.fecha_refacciones_entrega));
    //}

    if (this.tecnico_asignacion.length == 0) {
      this.snackBar.open("Debes elegir por lo menos a un técnico", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
    else {

      for (var i = 0; i < this.materiales_asignacion.length; i++) {
        this.materiales_asignacion_envio += this.materiales_asignacion[i].id_material + ",";
      }

      for (var i = 0; i < this.tecnico_asignacion.length; i++) {
        this.tecnicos_asignacion_envio += this.tecnico_asignacion[i].id_tecnico + ",";
      }

      for (var i = 0; i < this.garantia_asignacion.length; i++) {
        this.garantia_asignacion_envio += this.garantia_asignacion[i].id_material + ",";
      }

      //console.log(this.materiales_asignacion_envio);
      //console.log(this.tecnicos_asignacion_envio);
      //console.log(this.garantia_asignacion_envio);
      this.heroService.service_general("Refacciones/Asignar_Refacciones_Tecnico", {
        id: this.prediagnostico.id_visita,
        asignacion_refacciones: true,
        no_operacion: this.materiales_asignacion_envio,
        comprobante: this.tecnico_asignacion,
        fecha_entrega_refaccion: this.fecha_refacciones_entrega,
        concepto: this.garantia_asignacion_envio
      }).subscribe((value) => {
        this.snackBar.open("Solicitud de asignación de refacciones guardado correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
        this.router.navigate(['/ultimosservicios/']);
      });
    }
  }

  materiales_asignacion: any = [];
  validar_refaccion(event, material) {
    if (event.checked) {
      //this.materiales_asignacion += material.no_material.toString() + ",";
      this.materiales_asignacion.push({
        "id_material": material.id,
      });

      this.heroService.service_general("Refacciones/Validar_Refaccion", {
        no_material: material.no_material
      }).subscribe((value) => {
        //console.log(value[0].cantidad);
        if (value[0].cantidad < 1) {
          this.snackBar.open("La refcación asignada no tiene stock en almacen", "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
        }
        else {

        }
      });
    }
    else {
      for (var i = 0; i < this.materiales_asignacion.length; i++) {
        if (this.materiales_asignacion[i].id_material == material.id) {
          this.materiales_asignacion.splice(i, 1);
        }
      }
    }
  }

  garantia_asignacion: any = [];
  garantia(event, material) {
    if (event.checked) {
      //this.materiales_asignacion += material.no_material.toString() + ",";
      this.garantia_asignacion.push({
        "id_material": material.id,
      });
    }
    else {
      for (var i = 0; i < this.garantia_asignacion.length; i++) {
        if (this.garantia_asignacion[i].id_material == material.id) {
          this.garantia_asignacion.splice(i, 1);
        }
      }
    }
  }

  tecnico_asignacion: any = [];
  validar_tecnico(event, id, id_tecnico) {
    if (event.checked) {
      this.tecnico_asignacion = id_tecnico;
      if (id == 1) {
        this._tecnico2 = false;
        this._tecnico1 = true;
      }
      if (id == 2) {
        this._tecnico2 = true;
        this._tecnico1 = false;
      }
    }
    else {
      this.tecnico_asignacion = "";
    }
  }

  validar_visitas() {
    console.log(this.detalle);
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    if (this.servicio.id_tipo_servicio == 1) {
      if (this.servicio.visitas[0].productos.length == 1) {
        //console.log("OKKK");
        let dialogRef = this.dialog.open(DialogValidacionNo_visitas, {
          width: '350px',
          disableClose: true,
          data: { id: this.id }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result != undefined) {
            this.router.navigate(['/nuevavisita/' + this.servicio.id_cliente + '/' + this.id]);
          }
        });
      }
      if (this.servicio.visitas[0].productos.length > 1) {
        //console.log("OKKK_2");
        this.heroService.service_general("Servicios/No_visitas", {
          id_servicio: this.id
        }).subscribe((value) => {
          //console.log(value[0].no_visitas);
          if (value[0].no_visitas >= 3) {

            let dialogRef = this.dialog.open(DialogValidacionNo_visitas, {
              width: '350px',
              disableClose: true,
              data: { id: this.id }
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result != undefined) {
                this.router.navigate(['/nuevavisita/' + this.servicio.id_cliente + '/' + this.id]);
              }
            });

          }
          else {
            this.router.navigate(['/nuevavisita/' + this.servicio.id_cliente + '/' + this.id]);
          }
        });
      }
    }
    else {
      this.router.navigate(['/nuevavisita/' + this.servicio.id_cliente + '/' + this.id]);
    }
  }

  generar_pdf(value) {
    console.log(value);
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.heroService.service_general("PDFCreator/pdf", {
      id: value.id,
      id_servicio: this.id
    }).subscribe((value) => {

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
    //(this.data);


  }
}

@Component({
  selector: 'dialog-editar-estatus-visita',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-editar-estatus-visita.html',
})
export class DialogEditarEstatusVisita {

  constructor(
    public dialogRef: MatDialogRef<DialogEditarEstatusVisita>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private heroService: DatosService, private route: ActivatedRoute, public snackBar: MatSnackBar) { }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editar_estatus() {
    //(this.data.id);
  }

  id: number;
  public sub: any;
  rdconfirmado: number;

  cancelar_visita() {

    this.heroService.service_general("servicios/CancelarVisita", {
      id: this.data.id,
      numero: this.rdconfirmado.toString()
    }).subscribe((value) => {
      this.snackBar.open("Visita cancelada correctamente", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    });
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
    //(this.data.id);
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
    //(this.rdconfirmado);

    if (this.data != undefined) {
      this.heroService.service_general("servicios/Actualizar_estatus_cancelado", {
        "id": this.data.id,
        "numero": this.rdconfirmado
      }).subscribe((value) => {
        if (value.response == "OK") {
          this.heroService.service_notificacion({
            descripcion: 'El servicio número ' + this.data.id + ' fue cancelado, puedes realizar una llamada de seguimiento',
            estatus_leido: false,
            evento: 'Servicio cancelado ',
            rol_notificado: 10008,
            creado: this.heroService.fecha_hoy(),
            creadopor: JSON.parse(localStorage.getItem("user")).id
          }).subscribe((notificacion) => { });
          this.heroService.service_notificacion({
            descripcion: "El servicio número " + this.data.id + " fue cancelado, ahora puedes auditar la cancelación",
            estatus_leido: false,
            evento: 'Servicio cancelado ',
            rol_notificado: 10010,
            creado: this.heroService.fecha_hoy(),
            creadopor: JSON.parse(localStorage.getItem("user")).id
          }).subscribe((notificacion) => { });
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
        }
      });
    }
  }
}

@Component({
  selector: 'dialog-validacion-no_visitas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-validacion-no_visitas.html',
})
export class DialogValidacionNo_visitas {

  constructor(
    public dialogRef: MatDialogRef<DialogValidacionNo_visitas>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private heroService: DatosService, private route: ActivatedRoute, public snackBar: MatSnackBar) { }

  ngOnInit() {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

//@Component({
//  selector: 'snack-bar-component-example-snack',
//  templateUrl: 'snack-bar-component-example-snack.html',
//  styles: [`.example-pizza-party { color: hotpink; }`],
//})
//export class PizzaPartyComponent { }

export class Productos_Servicio {
  id_producto: number;
  modelo: string;
  sku: string;
  tipo: string;
  hora_tecnico: number;
  hora_precio: string;
  precio_visita: number;
}

export class visita_reagendar {
  id: number;
  fecha_visita: string;
  id_tecnico: number;
  hora: string;
  hora_fin: string;
}

export class Rel_servicio_visita_producto {
  id_producto: number;
  descripcion_cierre: string;
  estatus: number = 1;

}

export class visita {
  id_servicio: any;
  id_direccion: any;
  fecha_visita: any;
  id_tecnico: tecnico;
  hora: any;
  hora_fin: any;
  actividades_realizar: string;
  concepto: string;
  pagado: boolean;
  pago_pendiente: boolean = false;
  garantia: boolean;
  fecha_deposito: string;
  fecha_inicio_visita: any;
  no_operacion: string;
  comprobante: string;
  terminos_condiciones: boolean;
  factura: boolean;
  estatus: number;
  productos = new producto();
}

export class servicio {
  id_cliente: number;
  id_tipo_servicio: number;
  id_sub_tipo_servicio: number;
  id_solicitado_por: number;
  id_distribuidor_autorizado: number;
  contacto: string;
  id_solicitud_via: number;
  descripcion_actividades: string;
  id_categoria_servicio: number;
  no_servicio: string;
  fecha_servicio: string;
  id_estatus_servicio: number;
  IBS: string;
  id_motivo_cierre: number;
  activar_credito: boolean;
  tipo_servicio: string;
  creado: any;
  creadopor: number;
  visitas = new visita();
}

export class producto {

  sku: any = "";
  modelo: any = "";
  nombre: any = "";
  descripcion_corta: any = "";
  descripcion_larga: any = "";
  atributos: any = "";
  precio_sin_iva: any = "0";
  precio_con_iva: any = "0";
  id_categoria: any = 1;
  id_linea: any = 1;
  id_sublinea: any = 1;
  ficha_tecnica: any = "";
  horas_tecnico: any = 1;
  precio_hora: any = 1490;
  estatus: any = 1;
  creado: any = "01/01/1900";
  creadopor: any = 0;
  actualizado: any = "01/01/1900";
  actualizadopor: any = 0;
  tipo: 1;
}

export class prediagnostico {
  id_visita: any;
  observaciones: any;

  refacciones = new Prediagnostico_Refacciones();
}

export class Prediagnostico_Refacciones {
  id_material: any;
}
