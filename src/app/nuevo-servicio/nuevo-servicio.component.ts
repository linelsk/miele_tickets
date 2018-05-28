import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { DatosService } from '../datos.service';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';
import { Subject } from 'rxjs/Subject';
import { CalendarEvent, CalendarEventTimesChangedEvent, DAYS_OF_WEEK } from 'angular-calendar';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Router } from '@angular/router';
import { Productos_Servicio } from '../models/login';
import * as moment from 'moment';

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.css']
})
export class NuevoServicioComponent implements OnInit {
  preventAbuse = false;
  id: number;
  public sub: any;
  public detalle: string[] = [];
  public detalle_direccion: any[] = [];
  value_productos: Productos_Servicio[] = [];
  public ddltipo_servicio = new Tipo_Servicio();

  factura: any = {};
  razonsocial: string;
  rfc: string;
  email: string;

  //Valdaciones
  valid_tipo: boolean = true;
  valid_tipo_taller: boolean = false;
  valid_solicitado_por: boolean = true;
  valid_solicitado_via: boolean = true;
  valid_autorizao: boolean = true;
  valid_contacto: boolean = true;
  valid_descripcion_actividades: boolean = true;
  //valid_categoria_servicio: boolean = true;
  valid_fecha_visita: boolean = true;
  valid_tecnico_visita: boolean = true;
  valid_hora_visita: boolean = true;
  //valid_actividades_realizar: boolean = true;
  valid_acepto_terminos: boolean = true;
  //Valdaciones

  //ddltipo_servicio: number = 0;
  rdsolicitado: number = 1;
  rdsolicitudvia: number = 1;
  ddldistribuidor_autorizado: number = 0;
  txtcontacto: string = "";
  activarcredito: number = 0;
  txtdescripcion_actividades: string = "";
  categoriaservicio: string[] = [];
  categoria_servicio: number = 0;
  categoria_servicio_texto: string = "";
  categoria_servicio_cantidad: number = 0;
  txtfecha_cita: string = "";
  tiposervicio: string[] = [];
  ddlcategoria_servicio: number = 0;
  distribuidorservicio: string[] = [];
  mostrar_distribuidor: boolean = false;
  validform: boolean = true;
  productos: boolean = true;
  id_direccion: number = 0;
  id_tecnico: tecnico;
  //txtactividades_realizar: string = "";
  //Direccion
  txtcalle_numero: string = "";
  txtcp: string = "";
  txtcolonia: string = "";
  txttelefono: string = "";
  estados: string[] = [];
  estadosFactura: string[] = [];
  ddlestado: number = 0;
  ddlfactura_estado: number = 0;
  municipios: string[] = [];
  municipiosfactura: string[] = [];
  productos_cliente: any[] = [];
  checked: boolean = false;
  txttecnico_servicio: string = "";
  txthora_servicio: any = "";
  ddlmunicipio: number = 0;
  concepto: string = "";
  terminos_condiciones: boolean = false;
  requiere_factura: boolean = false;

  public mask = [/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public mask_telefono = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  ELEMENT_DATA: Element[] = [];

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(private heroService: DatosService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar) { }
  myControl: FormControl = new FormControl();

  displayedColumns = ['select', 'Modelo', 'SKU', 'Tipo', 'Garantia', 'Poliza', 'Estatus'];
  displayedColumns_direccion = ['select', 'Calle', 'Colonia', 'Estado', 'Municipio', 'CP'];

  dataSource = new MatTableDataSource();
  dataSource_direccion = new MatTableDataSource();
  selection = new SelectionModel<Element>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  //isAllSelected() {
  //  //console.log(this.selection.selected);
  //  const numSelected = this.selection.selected.length;
  //  const numRows = this.dataSource.data.length;
  //  return numSelected === numRows;
  //}

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  //masterToggle() {
  //  console.log(this.dataSource.data);
  //  this.isAllSelected() ?
  //    this.selection.clear() :
  //    this.dataSource.data.forEach(row => this.selection.select());
  //}

  options: any[] = [];

  filteredOptions: Observable<any[]>;

  //chk_productos: any;
  set_productos(event, row, index) {

    if (event.checked) {
      this.value_productos.push({
        estatus: 1,
        id_producto: row.id,
      });
    }
    else {
      for (var i = 0; i < this.value_productos.length; i++) {
        if (this.value_productos[i].id_producto == row.id) {
          this.value_productos.splice(i, 1);
        }
      }
    }

  };

  direccion(row) {
    this.id_direccion = row.id;
  };

  validacion_tipo() {
    if (this.ddltipo_servicio.id != 5) {
      this.valid_tipo = this.heroService.validar_input(this.ddltipo_servicio);
      this.valid_tipo_taller = false;
    }
    else {
      this.valid_tipo_taller = true;
    }

    return this.valid_tipo;
  }

  validacion_solicitado_por() {
    this.valid_solicitado_por = this.heroService.validar_input(this.rdsolicitado);
    if (!this.valid_solicitado_por) { window.scrollTo(0, 500); };
    return this.valid_solicitado_por;
  }

  validacion_via() {
    this.valid_solicitado_via = this.heroService.validar_input(this.rdsolicitudvia);
    if (!this.valid_solicitado_via) { window.scrollTo(0, 500); };
    return this.valid_solicitado_via;
  }

  validacion_ddl_autorizacion() {
    if (this.rdsolicitado == 2) {
      this.valid_autorizao = this.heroService.validar_input(this.ddldistribuidor_autorizado);
    }
    return this.valid_autorizao;
  }

  validacion_contacto() {
    if (this.rdsolicitado == 2) {
      this.valid_contacto = this.heroService.validar_input(this.txtcontacto);
    }

    return this.valid_contacto;
  }

  validacion_descripcion_actividades() {
    return this.valid_descripcion_actividades = this.heroService.validar_input(this.txtdescripcion_actividades);
  }

  //validacion_categoria_servicio() {
  //  if (this.ddltipo_servicio.id == 3 || this.ddltipo_servicio.id == 4 || this.ddltipo_servicio.id == 5) {
  //    this.valid_categoria_servicio = true;
  //  }
  //  else {
  //    this.valid_categoria_servicio = this.heroService.validar_input(this.ddlcategoria_servicio);
  //  }

  //  return this.valid_categoria_servicio;
  //}

  Validacion_fecha_visita() {
    if (this.ddltipo_servicio.id == 5) {
      this.valid_fecha_visita = true;
    }
    else {
      this.valid_fecha_visita = this.heroService.validar_input(this.txtfecha_cita);
    }

    return this.valid_fecha_visita;
  }

  validacion_tecnico_visita() {
    return this.valid_tecnico_visita = this.heroService.validar_input(this.txttecnico_servicio);
  }

  validacion_hora_visita() {
    if (this.ddltipo_servicio.id == 5) {
      this.valid_hora_visita = true;
    }
    else {
      this.valid_hora_visita = this.heroService.validar_input(this.txthora_servicio);
    }

    return this.valid_hora_visita;
  }

  //validacion_actividades_realizar() {
  //  return this.valid_actividades_realizar = this.heroService.validar_input(this.txtactividades_realizar);
  //}

  validacion_terminos_condiciones() {
    return this.valid_acepto_terminos = this.heroService.validar_input(this.terminos_condiciones);
  }

  guardar_servicio(obj) {
    this.validacion_tipo();
    this.validacion_solicitado_por();
    this.validacion_via();
    this.validacion_ddl_autorizacion();
    this.validacion_contacto();
    this.validacion_descripcion_actividades();
    //this.validacion_categoria_servicio();
    this.Validacion_fecha_visita();
    this.validacion_tecnico_visita();
    this.validacion_hora_visita();
    //this.validacion_actividades_realizar();
    this.validacion_terminos_condiciones();
    console.log(this.value_productos);

    if (this.validacion_tipo() && this.validacion_solicitado_por() && this.validacion_ddl_autorizacion() && this.validacion_contacto() && this.validacion_descripcion_actividades()
      && this.Validacion_fecha_visita() && this.validacion_tecnico_visita() && this.validacion_hora_visita() &&
      this.validacion_terminos_condiciones()) {

      //console.log(this.value_productos);
      if (this.ddltipo_servicio != undefined) {
        this.heroService.service_general("servicios", {
          "id_cliente": this.id,
          "id_tipo_servicio": this.ddltipo_servicio.id,
          "actualizado": "01/01/1900",
          "actualizadopor": 0,
          "creado": this.heroService.fecha_hoy(),
          "creadopor": JSON.parse(localStorage.getItem("user")).id,
          "id_solicitado_por": this.rdsolicitado,
          "id_distribuidor_autorizado": this.ddldistribuidor_autorizado,
          "contacto": this.txtcontacto,
          "activar_credito": this.activarcredito,
          "id_solicitud_via": this.rdsolicitudvia,
          "descripcion_actividades": this.txtdescripcion_actividades,
          "id_categoria_servicio": this.ddlcategoria_servicio,
          "no_servicio": "",
          "fecha_servicio": this.txtfecha_cita,
          "id_estatus_servicio": 3,
          "IBS": "",
          "id_motivo_cierre": 0,
          "fecha_inicio_servicio": "01/01/1900",
          "visita": [{
            "id_direccion": this.id_direccion,
            "fecha_visita": this.txtfecha_cita,
            "id_tecnico": this.id_tecnico.id,
            "hora": this.txthora_servicio,
            "actividades_realizar": "",
            "concepto": this.concepto,
            "cantidad": "6000",
            "pagado": true,
            "pago_pendiente": false,
            "garantia": false,
            "fecha_deposito": "01/01/1900",
            "no_operacion": "1",
            "comprobante": "",
            "terminos_condiciones": this.terminos_condiciones,
            "factura": this.requiere_factura,
            "servicio_producto": this.value_productos,
            "hora_fin": parseInt(localStorage.getItem("fecha_fin"))
          }]
        }).subscribe((value) => {
          //console.log(value.value.response);
          this.openIBS(value.value);
          this.heroService.service_general("servicios/Actualizar_Folio", {
            "id": value.value.response
          }).subscribe((value) => {
            //console.log(value);
          });
        });
      }      
    }
    else {
      console.log("no");
    }

    //console.log(this.value_productos);

  }

  guardar_borrador() {
    if (this.validacion_tipo() && this.validacion_solicitado_por() && this.validacion_ddl_autorizacion() && this.validacion_contacto() && this.validacion_descripcion_actividades()
      && this.Validacion_fecha_visita() && this.validacion_tecnico_visita() && this.validacion_hora_visita() &&
      this.validacion_terminos_condiciones()) {
      this.heroService.service_general("servicios", {
        "id_cliente": this.id,
        "id_tipo_servicio": this.ddltipo_servicio.id,
        "actualizado": "01/01/1900",
        "actualizadopor": 0,
        "creado": this.heroService.fecha_hoy(),
        "creadopor": JSON.parse(localStorage.getItem("user")).id,
        "id_solicitado_por": this.rdsolicitado,
        "id_distribuidor_autorizado": this.ddldistribuidor_autorizado,
        "contacto": this.txtcontacto,
        "activar_credito": this.activarcredito,
        "id_solicitud_via": this.rdsolicitudvia,
        "descripcion_actividades": this.txtdescripcion_actividades,
        "id_categoria_servicio": this.ddlcategoria_servicio,
        "no_servicio": "",
        "fecha_servicio": this.heroService.fecha_formato(this.txtfecha_cita),
        "id_estatus_servicio": 2,
        "IBS": "",
        "id_motivo_cierre": 0,
        "fecha_inicio_servicio": "01/01/1900",
        "visita": [{
          "id_direccion": this.id_direccion,
          "fecha_visita": this.heroService.fecha_formato(this.txtfecha_cita),
          "id_tecnico": this.id_tecnico,
          "hora": this.txthora_servicio,
          "actividades_realizar": "",
          "concepto": this.concepto,
          "cantidad": "6000",
          "pagado": true,
          "pago_pendiente": false,
          "garantia": false,
          "fecha_deposito": "01/01/1900",
          "no_operacion": "1",
          "comprobante": "",
          "terminos_condiciones": this.terminos_condiciones,
          "factura": this.requiere_factura,
          "servicio_producto": [{
            id_producto: 2,
            estatus: 1
          },
          {
            id_producto: 3,
            estatus: 1
          },
          ]
        }]
      }).subscribe((value) => {
        //console.log(value);
        this.snackBar.open("Borrador guardado correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      });
    }

  }

  guardar_direccion(ev) {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    //console.log(this.txtcalle_numero + "---" + this.txtcolonia + "---" + this.txtcp + "---" + this.id + "---" + this.ddlestado + "---" + this.ddlmunicipio + "---" + this.txttelefono + "---" + this.heroService.fecha_hoy() + "---" + JSON.parse(localStorage.getItem("user")).id);
    this.heroService.service_general("servicios/Agregar_Direccion", {
      "calle_numero": this.txtcalle_numero,
      "colonia": this.txtcolonia,
      "cp": this.txtcp,
      "estatus": true,
      "id_cliente": this.id,
      "id_estado": this.ddlestado,
      "id_municipio": this.ddlmunicipio,
      "telefono": this.txttelefono,
      "actualizado": "01/01/1900",
      "actualizadopor": 0,
      "creado": this.heroService.fecha_hoy(),
      "creadopor": JSON.parse(localStorage.getItem("user")).id
    }).subscribe((value) => {
      //console.log(value);
      this.getdireccioncliente(this.id);
    });
  }

  ngOnInit() {
    this.gettiposervicio();
    this.getdistribuidor();
    this.getestados();
    this.getfacturaestados();

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
      startWith(''),
      map(val => this.filter(val))
      );

    this.heroService.verificarsesion();
    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.heroService.service_general_get("Clientes/" + this.id, {}).subscribe((value) => {
      //console.log(value);
      this.detalle = value[0];
      if (value[0].direcciones != "") {
        this.detalle_direccion = value[0].direcciones[0];
      }
      else {
        this.detalle_direccion = [{
          calle_numero: "",
          estado: "",
          colonia: "",
          cp: "",
          municipio: "",

        }]
      }
      //this.detalle_direccion = value[0].direcciones[0];
    });

    this.getdireccioncliente(this.id);
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  filter(val: string) {
    //console.log(this.options);
    return this.options.filter(option =>
      option.desc_distribuidor.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  //llenar_productos
  getproductos(): void {
    this.productos_cliente = [];
    this.value_productos = [];
    this.categoria_servicio = 0;

    if (this.ddltipo_servicio.id != 0) {
      this.productos = false;
    }

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    //console.log(this.ddltipo_servicio);
    this.heroService.service_general("servicios/Productos_Servicio_Solicitado", {
      "id": this.id
    }).subscribe((value) => {
      //console.log(value);
      for (var i = 0; i < value.length; i++) {
        if (this.ddltipo_servicio.id == 1) {
          if (value[i].estatus == "Entregado") {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": true
            });
            this.categoria_servicio = this.categoria_servicio + parseInt(value[i].hora_tecnico);
          }
          else {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": false
            });
          }
        }

        if (this.ddltipo_servicio.id == 2 || this.ddltipo_servicio.id == 3) {
          if (value[i].estatus == "Instalado") {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": true
            });
            this.categoria_servicio = this.categoria_servicio + parseInt(value[i].hora_tecnico);
          }
          else {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": false
            });
          }
        }

        if (this.ddltipo_servicio.id == 4) {
          if (value[i].estatus == "Liberado") {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": true
            });
          }
          else {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": false
            });
          }
        }

        if (this.ddltipo_servicio.id == 5) {
          if (value[i].estatus == "En diagnostico") {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": true
            });
          }
          else {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": false
            });
          }
        }
      }

      for (var i = 0; i < this.productos_cliente.length; i++) {
        if (this.productos_cliente[i].checked) {
          this.value_productos.push({
            estatus: 1,
            id_producto: this.productos_cliente[i].id,
          });
        }
      }
      //console.log(this.categoria_servicio);
      if (this.categoria_servicio > 2) {
        this.categoria_servicio_texto = "mayor";
      }
      else {
        this.categoria_servicio_texto = "menor";
      }

      this.categoria_servicio_cantidad = (this.categoria_servicio * 1490) + 890;
      //console.log(this.productos_cliente);
      this.dataSource.data = this.productos_cliente;
      //console.log(this.dataSource.data[0].checked);

    });

    if (this.ddltipo_servicio.id == 1) {
      console.log("Instalación");

      this.concepto = "Instalación";
    }
    if (this.ddltipo_servicio.id == 2) {
      console.log("Matenimiento");
      this.concepto = "Matenimiento";
    }
    if (this.ddltipo_servicio.id == 3) {
      console.log("Reparación");
      this.concepto = "Reparación";
    }
    if (this.ddltipo_servicio.id == 4) {
      console.log("Entrega");
      this.concepto = "Entrega";
    }
    if (this.ddltipo_servicio.id == 5) {
      console.log("Diagnostico en taller");
      this.concepto = "Diagnostico en taller";
    }
  }

  //Catalogos
  gettiposervicio(): void {
    this.heroService.service_catalogos("Catalogos/TipoServicio")
      .subscribe((value) => {
        console.log(value);
        this.tiposervicio = value;
      });
  }

  getdistribuidor(): void {
    this.heroService.service_catalogos("Catalogos/Distribuidor")
      .subscribe((value) => {
        this.distribuidorservicio = value;
        this.options = value;
      });
  }

  getcategoriaservicio(): void {
    console.log(this.ddltipo_servicio);
    this.heroService.service_general("Catalogos/CategoriaServicio", {
      "id": this.ddltipo_servicio.id
    })
      .subscribe((value) => {

        //console.log(value);
        this.categoriaservicio = value;
      });
  }

  getdireccioncliente(id): void {
    this.heroService.service_general("Servicios/Direcciones_cliente", {
      "id": id
    })
      .subscribe((value) => {
        //console.log(value);
        this.dataSource_direccion.data = value;
      });
  }

  getestados(): void {
    this.heroService.service_general("Catalogos/Estados", {})
      .subscribe((value) => {
        this.estados = value;
      });
  }

  getmunicipios(): void {
    this.heroService.service_general("Catalogos/Municipio", {
      "id": this.ddlestado
    })
      .subscribe((value) => {
        this.municipios = value;
      });
  }

  getfacturaestados(): void {
    this.heroService.service_general("Catalogos/Estados", {})
      .subscribe((value) => {
        this.estadosFactura = value;
      });
  }

  getfacturamunicipios(): void {
    this.heroService.service_general("Catalogos/Municipio", {
      "id": this.ddlfactura_estado
    })
      .subscribe((value) => {
        this.municipiosfactura = value;
      });
  }

  ver_distribuidor(id) {
    //console.log(id);
    this.rdsolicitado = id;
    switch (id) {
      case 1:
        this.mostrar_distribuidor = false;
        this.ddldistribuidor_autorizado = 0;
        break;
      case 2:
        this.mostrar_distribuidor = true;
        break;
      default:
    }
  }

  openIBS(obj): void {
    let dialogRef = this.dialog.open(DialogIbsDialog, {
      width: '800px',
      disableClose: true,
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      this.router.navigate(['/buscacarservicio/']);
    });
  }

  tecnicos: any[] = [];
  openAgenda(obj): void {
    this.tecnicos = [];
    this.heroService.service_general("servicios/TecnicoAgenda", { id: this.ddltipo_servicio.id }).subscribe((value) => {
      for (var i = 0; i < value.length; i++) {
        this.tecnicos.push({
          id: value[i].id,
          tecnico: value[i].nombre + " " + value[i].paterno + " " + value[i].materno
        });
      }

      let dialogRef = this.dialog.open(DialogAgenda, {
        width: '100%',
        height: '95%',
        disableClose: true,
        data: { tecnicos: this.tecnicos, tipo_servicio: this.ddltipo_servicio, horas_tecnico: this.categoria_servicio }
      });

      dialogRef.afterClosed().subscribe(result => {
        //console.log(result);
        if (result == undefined) {
          this.txttecnico_servicio = "";
          this.txtfecha_cita = "";
          this.txthora_servicio = "";
          localStorage.setItem("agenda", "");
        }
        else {
          if (localStorage.getItem("agenda") != "") {
            this.id_tecnico = JSON.parse(localStorage.getItem("agenda")).tecnico;
            this.txttecnico_servicio = JSON.parse(localStorage.getItem("agenda")).tecnico.tecnico;
            this.txtfecha_cita = JSON.parse(localStorage.getItem("agenda")).fecha;
            this.txthora_servicio = JSON.parse(localStorage.getItem("agenda")).hora_inicio;
          }
        }

      });
    })
  }

}

@Component({
  selector: 'dialog-ibs',
  templateUrl: './dialog-ibs.html',
})
export class DialogIbsDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogIbsDialog>,
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


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'dialog-vista-hora',
  templateUrl: './dialog-visita-hora.html',
})
export class DialogVisitaHora {

  ddlhora_inicio: any = "09";
  ddlhora_fin: any = "11";

  constructor(
    public dialogRef: MatDialogRef<DialogVisitaHora>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    console.log(this.data.event);
    console.log(this.data.horas_tecnico);
    this.ddlhora_inicio = this.data.event;
    this.ddlhora_fin = ((this.data.event * 1) + ((this.data.horas_tecnico * 1))).toString();

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

@Component({
  selector: 'dialog-agenda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-agenda.html',
})
export class DialogAgenda {

  constructor(
    public dialogRef: MatDialogRef<DialogAgenda>,
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

  rdtecnico: any = 0;
  tecnico: any = 0;
  ddlhora_fin: any = 0;
  hexadecimal = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F")
  color_aleatorio = "#";
  numPosibilidades: any;
  aleat: any;
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
              let dialogRef = this.dialog.open(DialogVisitaHora, {
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

          let dialogRef = this.dialog.open(DialogVisitaHora, {
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
          let dialogRef = this.dialog.open(DialogVisitaHora, {
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
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true
            }
          });
      }

      //console.log(this.events);
      this.refresh.next();
    });
  }

  color() {
    for (var i = 0; i < 6; i++) {
      let aleatorio;
      let posarray = this.aleatorio(0, this.hexadecimal.length)
      this.color_aleatorio += this.hexadecimal[posarray]
    };
    return this.color_aleatorio
  }

  ngOnInit() {

    this.heroService.service_general("servicios/TecnicoCalendario", { "id": this.data.tipo_servicio.id }).subscribe((value) => {
     
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
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true
            }
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
  selector: 'snack-bar-component-example-snack',
  templateUrl: 'snack-bar-component-example-snack.html',
  styles: [`.example-pizza-party { color: hotpink; }`],
})
export class PizzaPartyComponent { }

export class Element {
  modelo: string;
  sku: string;
  tipo_equipo: string;
  garantia: string;
  poliza: string;
  estatus: string;
}

export class Distribuidor {
  id: number;
  desc_distribuidor: string;
  estatus: boolean;
  servicio: string
}

export class Tipo_Servicio {

  desc_tipo_servicio: string;
  estatus: boolean;
  id: number;
  servicio: any;
}

export class tecnico {

  id: any;
  tecnico: any;
}
