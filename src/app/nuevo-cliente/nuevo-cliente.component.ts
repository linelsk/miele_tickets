import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { DatosService } from '../datos.service';
import { Clientes, direccion, datosfiscales, servicio, producto, visita } from '../models/cliente';
import { Hero } from '../models/login';
import { MatTableDataSource } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators/map';
import { addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent, CalendarEventTimesChangedEvent, DAYS_OF_WEEK } from 'angular-calendar';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent implements OnInit {

  public cliente = new Clientes();
  public direccion = new direccion();
  public direccion_servicio = new direccion();
  public datosfiscales = new datosfiscales();
  public servicio = new servicio();
  public producto = new producto();
  public visita = new visita();
  value_productos: Productos_Servicio[] = [];
  value_productos_servicio: any[] = [];
  productos_cliente: Productos_Cliente[] = [];
  estados: string[] = [];
  municipios: string[] = [];
  localidades: string[] = [];
  tipo_servicio: string[] = [];
  distribuidor_servicio: string[] = [];
  estados_datos_fiscales: string[] = [];
  municipios_datos_fiscales: string[] = [];
  estados_direccion_servicios: string[] = [];
  municipios_direccion_servicios: string[] = [];
  localidades_datos_fiscales: string[] = [];
  localidades_direccion_servicios: string[] = [];
  mostrar_distribuidor: boolean = true;
  ver_productos: boolean = true;
  ver_nuevo_producto: boolean = false;
  preventAbuse = false;
  text_busqueda: string = "";
  valid_tipo_taller: boolean = false;
  categoria_servicio: number = 0;
  txt_tecnico: string;
  concepto: string;
  categoria_servicio_texto: string;
  categoria_servicio_cantidad: number;

  public mask = [/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public mask_telefono = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  public mask_cp = [/\d/, /\d/, /\d/, /\d/, /\d/];

  constructor(private heroService: DatosService, public dialog: MatDialog, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }
  displayedColumns = ['select', 'Modelo', 'SKU', 'Tipo'];
  dataSource = new MatTableDataSource();

  ngOnInit() {
    this.heroService.verificarsesion();
    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.getestados();
    this.gettiposervicio();
    this.getdistribuidor();
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  //Catalogos
  getestados(): void {
    this.heroService.service_general("Catalogos/Estados", {})
      .subscribe((value) => {
        this.estados = value;
      });
  }

  getmunicipios(): void {
    this.heroService.service_general("Catalogos/Municipio", {
      "id": this.direccion.id_estado
    })
      .subscribe((value) => {
        this.municipios = value;
      });
  }

  getestados_datos_fiscales(): void {
    this.heroService.service_general("Catalogos/Estados", {})
      .subscribe((value) => {
        this.estados_datos_fiscales = value;
      });
  }

  getmunicipios_datos_fiscales(): void {
    this.heroService.service_general("Catalogos/Municipio", {
      "id": this.datosfiscales.id_estado
    })
      .subscribe((value) => {
        this.municipios_datos_fiscales = value;
      });
  }

  getestados_direccion_servicio(): void {
    this.heroService.service_general("Catalogos/Estados", {})
      .subscribe((value) => {
        this.estados_direccion_servicios = value;
      });
  }

  getmunicipios_direccion_servicio(): void {
    this.heroService.service_general("Catalogos/Municipio", {
      "id": this.direccion_servicio.id_estado
    })
      .subscribe((value) => {
        this.municipios_direccion_servicios = value;
      });
  }

  gettiposervicio(): void {
    this.heroService.service_catalogos("Catalogos/TipoServicio")
      .subscribe((value) => {
        console.log(value);
        this.tipo_servicio = value;
      });
  }

  getdistribuidor(): void {
    this.heroService.service_catalogos("Catalogos/Distribuidor")
      .subscribe((value) => {
        this.distribuidor_servicio = value;
      });
  }

  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  guid() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
  }

  ver_distribuidor(id) {
    switch (id) {
      case 1:
        this.mostrar_distribuidor = true;
        break;
      case 2:
        this.mostrar_distribuidor = false;
        break;
      default:
    }
  }

  getproductos(): void {
    if (this.servicio.id_tipo_servicio.id != 0) {
      this.ver_productos = false;
    }

    if (this.servicio.id_tipo_servicio.id != 5) {
      this.valid_tipo_taller = false;
    }
    else {
      this.valid_tipo_taller = true;
    }

    this.concepto = this.servicio.id_tipo_servicio.desc_tipo_servicio
  };

  buscar() {
    if (this.text_busqueda == "") {
      this.snackBar.open("Ingresa un parametro de busqueda", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
    else {
      this.preventAbuse = true;
      this.heroService.service_general("Clientes/Busqueda_producto", {
        "texto": this.text_busqueda
      }).subscribe((value) => {
        setTimeout(() => {
          console.log(value);
          this.preventAbuse = false;
          this.ver_nuevo_producto = false;

          this.dataSource.data = value;
          console.log(this.dataSource.data);
        }, 400);
      });
    }
  }

  nuevo_producto() {
    this.ver_nuevo_producto = true;
  }

  regresar_busqueda() {
    this.ver_nuevo_producto = false;
  }

  set_productos(event, row, index) {
    //console.log(row);
    if (event.checked) {
      this.value_productos.push({
        id_producto: row.id,
        modelo: row.modelo,
        sku: row.sku,
        tipo: row.tipo,
        hora_tecnico: row.hora_tecnico,
        hora_precio: row.hora_precio
      });
      this.value_productos_servicio.push({
        estatus: 1,
        id_producto: row.id
      });
      this.productos_cliente.push({
        Id_Producto: row.id,
        FinGarantia: "01/01/1900",
        FechaCompra: "01/01/1900",
        NoPoliza: "S/N",
        Id_EsatusCompra: 1,
        NoOrdenCompra: "S/N"
      });

      this.categoria_servicio = this.categoria_servicio + parseInt(row.hora_tecnico);
      if (this.categoria_servicio > 2) {
        this.categoria_servicio_texto = "mayor";
      }
      else {
        this.categoria_servicio_texto = "menor";
      }

      this.categoria_servicio_cantidad = (this.categoria_servicio * 1490) + 890;
    }
    else {
      for (var i = 0; i < this.value_productos.length; i++) {
        if (this.value_productos[i].id_producto == row.id) {
          this.value_productos.splice(i, 1);
          this.productos_cliente.splice(i, 1);
          this.value_productos_servicio.splice(i, 1);
        }
      }
      this.categoria_servicio = this.categoria_servicio - parseInt(row.hora_tecnico);
    }
  };

  delete_producto(id) {
    console.log(id);
    for (var i = 0; i < this.value_productos.length; i++) {
      if (this.value_productos[i].id_producto == id) {
        this.value_productos.splice(i, 1);
      }
    }
  };

  guardar_producto() {
    this.heroService.service_general("Catalogos/Nuevo_Producto", this.producto)
      .subscribe((value) => {
        this.snackBar.open(value.value.response, "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
        this.value_productos.push({
          id_producto: value.value.item.id,
          modelo: value.value.item.modelo,
          sku: value.value.item.sku,
          tipo: value.value.item.nombre,
          hora_tecnico: value.value.item.hora_tecnico,
          hora_precio: value.value.item.hora_precio
        });
      });
  }

  copiar_direccion() {
    this.datosfiscales.cp = this.direccion.cp;
    this.sepomex_datos_fiscales();
    this.datosfiscales.calle_numero = this.direccion.calle_numero;
    this.datosfiscales.Int_fact = this.direccion.NumInt;
    this.datosfiscales.Ext_fact = this.direccion.NumExt;
    this.datosfiscales.telefono_fact = this.cliente.telefono;
    this.datosfiscales.email = this.cliente.email;
  }

  copiar_direccion_servicio() {
    this.direccion_servicio = this.direccion;
    this.direccion_servicio.telefono = this.cliente.telefono;
    this.sepomex_servicios();
  }

  tipo_calle: any[] = ["Calle", "calle", "av.", "Av.", "Avenida", "avenida", "Boulervar", "boulervar", "blvr", "Blvr", "av", "Callejon", "callejon", "Cerrada", "cerrada",]
  _tipo_calle_direccion: boolean = false;
  _nombre_calle: string = "";
  _tipo_calle_datos_fiscales: boolean = false;
  _nombre_calle_datos_fiscales: string = "";
  _tipo_calle_direccion_servicios: boolean = false;
  _nombre_calle_direccion_servicio: string = "";
  validar_calle() {
    let _string: any = this.direccion.calle_numero;
    for (var i = 0; this.tipo_calle.length > i; i++) {
      if (_string.includes(this.tipo_calle[i])) {
        this._tipo_calle_direccion = true;
        this._nombre_calle = this.tipo_calle[i];
        break;
      }
      else {
        this._tipo_calle_direccion = false;
      }
    }
  }

  validar_calle_datos_ficales() {
    let _string: any = this.datosfiscales.calle_numero;
    for (var i = 0; this.tipo_calle.length > i; i++) {
      if (_string.includes(this.tipo_calle[i])) {
        this._tipo_calle_datos_fiscales = true;
        this._nombre_calle_datos_fiscales = this.tipo_calle[i];
        break;
      }
      else {
        this._tipo_calle_datos_fiscales = false;
      }
    }
  }

  validar_calle_servicio() {
    let _string: any = this.direccion_servicio.calle_numero;
    for (var i = 0; this.tipo_calle.length > i; i++) {
      if (_string.includes(this.tipo_calle[i])) {
        this._tipo_calle_direccion_servicios = true;
        this._nombre_calle_direccion_servicio = this.tipo_calle[i];
        break;
      }
      else {
        this._tipo_calle_datos_fiscales = false;
      }
    }
  }

  sepomex() {
    if (this.direccion.cp.length == 5) {
      this.heroService.service_general("Servicios/Sepomex", { id: this.direccion.cp })
        .subscribe((value) => {
          this.direccion.id_estado = value[0].id_estado;
          this.getmunicipios();
          this.direccion.id_municipio = value[0].id_municipio;
          this.localidades = value[0].localidades;
          this.direccion.colonia = value[0].localidades[0].id_localidad;
          console.log(value);
        });
    }
  }

  sepomex_datos_fiscales() {
    if (this.datosfiscales.cp.length == 5) {
      this.heroService.service_general("Servicios/Sepomex", { id: this.datosfiscales.cp })
        .subscribe((value) => {
          this.datosfiscales.id_estado = value[0].id_estado;
          this.getestados_datos_fiscales();
          this.getmunicipios_datos_fiscales();
          this.datosfiscales.id_municipio = value[0].id_municipio;
          this.localidades_datos_fiscales = value[0].localidades;
          this.datosfiscales.colonia = value[0].localidades[0].id_localidad;
        });
    }
  }

  sepomex_servicios() {
    if (this.direccion_servicio.cp.length == 5) {
      this.heroService.service_general("Servicios/Sepomex", { id: this.direccion_servicio.cp })
        .subscribe((value) => {
          this.direccion_servicio.id_estado = value[0].id_estado;
          this.getestados_direccion_servicio();
          this.getmunicipios_direccion_servicio();
          this.direccion_servicio.id_municipio = value[0].id_municipio;
          this.localidades_direccion_servicios = value[0].localidades;
          this.direccion_servicio.colonia = value[0].localidades[0].id_localidad;
        });
    }
  };

  tecnicos: any[] = [];
  openAgenda(obj): void {
    if (this.servicio.id_tipo_servicio != undefined) {
      this.tecnicos = [];
      this.heroService.service_general("servicios/TecnicoAgenda", { id: this.servicio.id_tipo_servicio.id }).subscribe((value) => {
        for (var i = 0; i < value.length; i++) {
          this.tecnicos.push({
            id: value[i].id,
            tecnico: value[i].nombre + " " + value[i].paterno + " " + value[i].materno,
            tecnico_color: value[i].tecnico_color
          });
        }

        let dialogRef = this.dialog.open(DialogAgendaCliente, {
          width: '100%',
          height: '95%',
          disableClose: true,
          data: { tecnicos: this.tecnicos, tipo_servicio: this.servicio.id_tipo_servicio, horas_tecnico: this.categoria_servicio }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result == undefined) {
            this.txt_tecnico = "";
            this.visita.fecha_visita = "";
            this.visita.hora = "";
            localStorage.setItem("agenda", "");
          }
          else {
            if (localStorage.getItem("agenda") != "") {
              this.visita.id_tecnico = JSON.parse(localStorage.getItem("agenda")).tecnico;
              this.txt_tecnico = JSON.parse(localStorage.getItem("agenda")).tecnico.tecnico;
              this.visita.fecha_visita = JSON.parse(localStorage.getItem("agenda")).fecha;
              this.visita.hora = JSON.parse(localStorage.getItem("agenda")).hora_inicio;
            }
          }

        });
      })
    }
    else {
      this.snackBar.open("Para poder agendar es necesario elegir un tipo de servicio", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
  }

  guardar_cliente() {
    this.heroService.service_general("Clientes/Nuevo_cliente", {
      email: this.cliente.email,
      materno: this.cliente.materno,
      nombre: this.cliente.nombre,
      paterno: this.cliente.paterno,
      referencias: this.cliente.referencias,
      tipo_persona: this.cliente.tipo_persona,
      folio: this.guid(),
      telefono: this.cliente.telefono,
      telefono_movil: this.cliente.telefono_movil,
      estatus: 1,
      creado: this.heroService.fecha_hoy(),
      creadopor: JSON.parse(localStorage.getItem("user")).id,
      direccion: [this.direccion, this.direccion_servicio],
      datos_fiscales: [this.datosfiscales],
      Id_Cliente_Productos: this.productos_cliente,
      servicio: [{
        id_tipo_servicio: this.servicio.id_tipo_servicio.id,
        actualizado: "01/01/1900",
        actualizadopor: 0,
        creado: this.heroService.fecha_hoy(),
        creadopor: JSON.parse(localStorage.getItem("user")).id,
        id_solicitado_por: this.servicio.id_solicitado_por,
        id_distribuidor_autorizado: this.servicio.id_distribuidor_autorizado,
        contacto: this.servicio.contacto,
        activar_credito: this.servicio.activar_credito,
        id_solicitud_via: this.servicio.id_solicitud_via,
        descripcion_actividades: this.servicio.descripcion_actividades,
        id_categoria_servicio: this.servicio.id_categoria_servicio,
        no_servicio: "",
        fecha_servicio: this.visita.fecha_visita,
        id_estatus_servicio: 3,
        IBS: "",
        id_motivo_cierre: 0,
        fecha_inicio_servicio: "01/01/1900",
        visita: [{
          fecha_visita: this.visita.fecha_visita,
          id_tecnico: this.visita.id_tecnico.id,
          hora: JSON.parse(localStorage.getItem("agenda")).event,
          actividades_realizar: "",
          concepto: this.visita.concepto,
          cantidad: "6000",
          pagado: true,
          pago_pendiente: false,
          garantia: false,
          fecha_deposito: "01/01/1900",
          no_operacion: "1",
          comprobante: "",
          terminos_condiciones: false,
          factura: false,
          servicio_producto: this.value_productos_servicio,
          hora_fin: parseInt(localStorage.getItem("fecha_fin"))
        }]
      }]
    }).subscribe((data) => {
      console.log(data.value.ordenes[0].id_direccion[0].id);
      this.openIBS(data.value.ordenes[0].id);

      this.heroService.service_general("servicios/Actualizar_Folio", {
        "id": data.value.ordenes[0].id
      }).subscribe((value) => {
        this.heroService.service_general("servicios/Actualizar_direccion", {
          "id": data.value.ordenes[0].id_visita,
          "numero": data.value.ordenes[0].id_direccion[0].id
        }).subscribe((value) => {
          this.snackBar.open(data.value.response, "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
        });
      });
    });
  }

  openIBS(obj): void {
    let dialogRef = this.dialog.open(DialogIbsCliente, {
      width: '800px',
      disableClose: true,
      data: { response: obj }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      this.router.navigate(['/buscacarservicio/']);
    });
  }
}

@Component({
  selector: 'dialog-ibs-cliente',
  templateUrl: './dialog-ibs.html',
})
export class DialogIbsCliente {

  constructor(
    public dialogRef: MatDialogRef<DialogIbsCliente>,
    @Inject(MAT_DIALOG_DATA) public data: any, private heroService: DatosService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  guardar_ibs(): void {
    this.heroService.service_general("servicios/Actualizar_ibs", {
      "id": this.data.response,
      "numero": this.data.ibs
    }).subscribe((value) => {
      this.snackBar.open("Servicio e IBS guardados correctamente", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
      this.router.navigate(['/buscacarservicio/']);
    });
  }
}

@Component({
  selector: 'dialog-agenda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-agenda.html',
})
export class DialogAgendaCliente {

  constructor(
    public dialogRef: MatDialogRef<DialogAgendaCliente>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private heroService: DatosService, public dialog: MatDialog, public snackBar: MatSnackBar) { }

  view = 'week';
  viewDate: Date = new Date();
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  tecnicos: any[] = [];

  locale: string = 'es';

  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;

  weekendDays: number[] = [DAYS_OF_WEEK.MONDAY];

  eventClicked(event) {
    console.log("ok");
    console.log(event);
  }

  tecnico: any = 0;
  ddlhora_fin: any = 0;
  hexadecimal = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F")
  color_aleatorio = "#";
  numPosibilidades: any;
  aleat: any;
  //color_tecnico: any[] = [];
  tecnico_actual: any = 0;

  set_tecnico(obj) {

    this.tecnico_actual = obj;
  }

  hourSegmentClicked(event) {
    var fecha1 = moment(event.date);
    var fecha2 = moment();

    if (moment(event.date).format("MM/DD/YYYY") < moment().format("MM/DD/YYYY")) {
      this.snackBar.open("La visita no puede en una fecha anterior al día de hoy", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
    else {
      if (this.tecnico_actual == 0) {
        this.snackBar.open("Es necesario elegir un técnico", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      }
      else {
        if (moment(event.date).format("HH") != "09" && moment(event.date).format("HH") != "11" && moment(event.date).format("HH") != "14" && moment(event.date).format("HH") != "16" && moment(event.date).format("HH") != "13") {
          this.snackBar.open("La visita no puede se programada en este horario:" + moment(event.date).format("HH:mm"), "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
        }
        else {
          if (moment(event.date).format("HH") == "13") {
            this.snackBar.open("Es hora de la comida:" + moment(event.date).format("HH:mm"), "", {
              duration: 5000,
              verticalPosition: 'bottom',
              horizontalPosition: 'right',
              extraClasses: ['blue-snackbar']
            });
          }
          else {
            if (moment(event.date).diff(moment(), 'days') >= 2) {
              console.log(moment(event.date).diff(moment(), 'days'), ' dias de diferencia');
              let dialogRef = this.dialog.open(DialogVisitaHoraCliente, {
                width: '450px',
                disableClose: true,
                data: {
                  tecnico: this.tecnico_actual, tipo_servicio: this.data.tipo_servicio, event: moment(event.date).format("HH"), fecha: moment(event.date).format("MM/DD/YYYY"), hora_inicio: moment(event.date).format('LT'), horas_tecnico: this.data.horas_tecnico, propuesto: false
                }
              });

              dialogRef.afterClosed().subscribe(result => {
                console.log(result);
                if (result != undefined) {
                  localStorage.setItem("agenda", JSON.stringify((result)));
                  this.events.push(
                    {
                      start: addHours(startOfDay(new Date(result.fecha)), result.event),
                      end: addHours(startOfDay(new Date(result.fecha)), parseInt(localStorage.getItem("fecha_fin"))),
                      title: result.tipo_servicio.desc_tipo_servicio + "-" + result.tecnico.tecnico,
                      color: {
                        primary: '#FFC300',
                        secondary: '#FFC300  '
                      },
                      //draggable: true,
                      //resizable: {
                      //  beforeStart: true,
                      //  afterEnd: true
                      //}
                    }
                  );
                  this.refresh.next();
                }
                else {
                  localStorage.setItem("agenda", "");
                }
              });

            }
            else {
              this.snackBar.open("La visita solo puede ser programada con 48 hrs. de anticipación", "", {
                duration: 5000,
                verticalPosition: 'bottom',
                horizontalPosition: 'right',
                extraClasses: ['blue-snackbar']
              });
            }
          }
        }
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
                      }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();
  }

  aleatorio(inferior, superior) {
    this.numPosibilidades = superior - inferior
    this.aleat = Math.random() * this.numPosibilidades
    this.aleat = Math.floor(this.aleat)
    return parseInt(inferior) + this.aleat
  }

  filtro_tecnico(event, options) {

    if (event.source.checked) {
      this.heroService.service_general("servicios/Tecnico_id", { "id": options.id }).subscribe((value) => {
        console.log(value.value.item);
        if (value.value.item != "") {
          this.events = [];
          for (var i = 0; i < value.value.item.length; i++) {
            this.events.push(
              {
                start: addHours(startOfDay(new Date(value.value.item[i].fecha_visita)), value.value.item[i].hora_inicio),
                end: addHours(startOfDay(new Date(value.value.item[i].fecha_visita)), value.value.item[i].hora_fin),
                title: value.value.item[i].desc_tipo_servicio + "-" + value.value.item[i].tecnico,
                color: {
                  primary: value.value.item[i].tecnico_color,
                  secondary: value.value.item[i].tecnico_color
                },
                actions: []
              });
          }
   
          this.events.push(
            {
              start: addHours(startOfDay(new Date(value.value.item[0].fecha_propuesta)), value.value.item[0].hora_propuesta),
              end: addHours(startOfDay(new Date(value.value.item[0].fecha_propuesta)), (value.value.item[0].hora_propuesta * 1) + (this.data.horas_tecnico * 1)),
              title: value.value.item[0].desc_tipo_servicio + "-" + value.value.item[0].tecnico,
              color: {
                primary: '#FFC300',
                secondary: '#FFC300'
              },
              actions: []
            });

          let dialogRef = this.dialog.open(DialogVisitaHoraCliente, {
            width: '450px',
            disableClose: true,
            data: {
              tecnico: this.tecnico_actual, tipo_servicio: this.data.tipo_servicio, event: value.value.item[0].hora_propuesta, fecha: moment(value.value.item[0].fecha_propuesta).format("MM/DD/YYYY"), hora_inicio: moment("01-01-1900 " + value.value.item[0].hora_propuesta + ":00:00").format('LT'), horas_tecnico: this.data.horas_tecnico, propuesto: true
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result == undefined) {
              this.events = [];
              for (var i = 0; i < value.value.item.length; i++) {
                this.events.push(
                  {
                    start: addHours(startOfDay(new Date(value.value.item[i].fecha_visita)), value.value.item[i].hora_inicio),
                    end: addHours(startOfDay(new Date(value.value.item[i].fecha_visita)), value.value.item[i].hora_fin),
                    title: value.value.item[i].desc_tipo_servicio + "-" + value.value.item[i].tecnico,
                    color: {
                      primary: value.value.item[i].tecnico_color,
                      secondary: value.value.item[i].tecnico_color
                    },
                    actions: []
                  });
              }
              this.refresh.next();
            }
            else {
              localStorage.setItem("agenda", JSON.stringify((result)));
            }

          });

          this.refresh.next();
        }
        else {
          let dialogRef = this.dialog.open(DialogVisitaHoraCliente, {
            width: '450px',
            disableClose: true,
            data: {
              tecnico: this.tecnico_actual, tipo_servicio: this.data.tipo_servicio, event: "09", fecha: moment().add(2).format("MM/DD/YYYY"), hora_inicio: moment("01-01-1900 " + "09" + ":00:00").format('LT'), horas_tecnico: this.data.horas_tecnico, propuesto: true
            }
          });

          dialogRef.afterClosed().subscribe(result => {
            console.log(this.data);
            if (result == undefined) {
              this.events = [];
              for (var i = 0; i < value.value.item.length; i++) {
                this.events.push(
                  {
                    start: addHours(startOfDay(moment().add(2).toDate()), parseInt("09")),
                    end: addHours(startOfDay(moment().add(2).toDate()), parseInt("09") + (this.data.horas_tecnico * 1)),
                    title: this.data.tipo_servicio.desc_tipo_servicio + "-" + this.tecnico_actual,
                    color: {
                      primary: value.value.item[i].tecnico_color,
                      secondary: value.value.item[i].tecnico_color
                    },
                    actions: []
                  });
              }
              this.refresh.next();
            }
            else {
              localStorage.setItem("agenda", JSON.stringify((result)));
            }

          });

          this.refresh.next();
        }
      });
    }
    else {

    }

  }

  ver_todos() {
    this.events = [];
    this.heroService.service_general("servicios/TecnicoCalendario", { "id": this.data.tipo_servicio.id }).subscribe((value) => {
      //this.color_tecnico = value[0].tecnico_group;
      for (var i = 0; i < value.length; i++) {
        this.events.push(
          {
            start: addHours(startOfDay(new Date(value[i].fecha_visita)), value[i].hora_inicio),
            end: addHours(startOfDay(new Date(value[i].fecha_visita)), value[i].hora_fin),
            title: value[i].desc_tipo_servicio + "-" + value[i].tecnico,
            color: {
              primary: value[i].tecnico_color,
              secondary: value[i].tecnico_color
            },
            actions: [],
            //draggable: true,
            //resizable: {
            //  beforeStart: true,
            //  afterEnd: true
            //}
          });
      }

      //console.log(this.events);
      this.refresh.next();
    });
  }

  ngOnInit() {

    this.heroService.service_general("servicios/TecnicoCalendario", { "id": this.data.tipo_servicio.id }).subscribe((value) => {
      //this.color_tecnico = value[0].tecnico_group;
      for (var i = 0; i < value.length; i++) {
        this.events.push(
          {
            start: addHours(startOfDay(new Date(value[i].fecha_visita)), value[i].hora_inicio),
            end: addHours(startOfDay(new Date(value[i].fecha_visita)), value[i].hora_fin),
            title: value[i].desc_tipo_servicio + "-" + value[i].tecnico,
            color: {
              primary: value[i].tecnico_color,
              secondary: value[i].tecnico_color
            },
            actions: [],
            //draggable: true,
            //resizable: {
            //  beforeStart: true,
            //  afterEnd: true
            //}
          });
      }

      //console.log(this.events);
      this.refresh.next();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'dialog-vista-hora',
  templateUrl: './dialog-visita-hora.html',
})
export class DialogVisitaHoraCliente {

  ddlhora_inicio: any = "09";
  ddlhora_fin: any = "11";

  constructor(
    public dialogRef: MatDialogRef<DialogVisitaHoraCliente>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data.event);
    console.log(this.data.horas_tecnico);
    this.ddlhora_inicio = this.data.event;
    this.ddlhora_fin = ((this.data.event * 1) + ((this.data.horas_tecnico * 1))).toString();

    //console.log(this.ddlhora_fin);
    //10, 12, 3, 5
    if (this.ddlhora_fin == "10") {
      this.ddlhora_fin = "11";
    }

    if (this.ddlhora_fin == "12") {
      this.ddlhora_fin = "13";
    }

    if (this.ddlhora_fin == "15") {
      this.ddlhora_fin = "16";
    }

    if (this.ddlhora_fin == "17") {
      this.ddlhora_fin = "18";
    }

    localStorage.setItem("fecha_fin", this.ddlhora_fin);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  set_hora_fin(obj) {
    localStorage.setItem("fecha_fin", obj);
  }

}

export class Productos_Servicio {
  id_producto: number;
  modelo: string;
  sku: string;
  tipo: string;
  hora_tecnico: number;
  hora_precio: string;
}

export class Productos_Cliente {
  Id_Producto: number;
  FinGarantia: any;
  FechaCompra: any;
  NoPoliza: string;
  Id_EsatusCompra: any;
  NoOrdenCompra: string;
}
