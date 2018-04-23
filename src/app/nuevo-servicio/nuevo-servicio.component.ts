import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
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
import { Router } from '@angular/router';
import { Productos_Servicio } from '../models/login';

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
  valid_categoria_servicio: boolean = true;
  valid_fecha_visita: boolean = true;
  valid_tecnico_visita: boolean = true;
  valid_hora_visita: boolean = true;
  //valid_actividades_realizar: boolean = true;
  valid_acepto_terminos: boolean = true;
  //Valdaciones

  ddltipo_servicio: number = 0;
  rdsolicitado: number = 1;
  rdsolicitudvia: number = 1;
  ddldistribuidor_autorizado: number = 0;
  txtcontacto: string = "";
  activarcredito: number = 0;
  txtdescripcion_actividades: string = "";
  categoriaservicio: string[] = [];
  txtfecha_cita: string = "";
  tiposervicio: string[] = [];
  ddlcategoria_servicio: number = 0;
  distribuidorservicio: string[] = [];
  mostrar_distribuidor: boolean = false;
  validform: boolean = true;
  productos: boolean = true;
  id_direccion: number = 0;
  id_tecnico: number = 0;
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
    if (this.ddltipo_servicio != 5) {
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

  validacion_categoria_servicio() {
    if (this.ddltipo_servicio == 3 || this.ddltipo_servicio == 4 || this.ddltipo_servicio == 5) {
      this.valid_categoria_servicio = true;
    }
    else {
      this.valid_categoria_servicio = this.heroService.validar_input(this.ddlcategoria_servicio);
    }

    return this.valid_categoria_servicio;
  }

  Validacion_fecha_visita() {
    if (this.ddltipo_servicio == 5) {
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
    if (this.ddltipo_servicio == 5) {
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
    this.validacion_categoria_servicio();
    this.Validacion_fecha_visita();
    this.validacion_tecnico_visita();
    this.validacion_hora_visita();
    //this.validacion_actividades_realizar();
    this.validacion_terminos_condiciones();
    console.log(this.value_productos);
    
    if (this.validacion_tipo() && this.validacion_solicitado_por() && this.validacion_ddl_autorizacion() && this.validacion_contacto() && this.validacion_descripcion_actividades()
      && this.validacion_categoria_servicio() && this.Validacion_fecha_visita() && this.validacion_tecnico_visita() && this.validacion_hora_visita() &&
      this.validacion_terminos_condiciones()) {

      //console.log(this.value_productos);
      this.heroService.service_general("servicios", {
        "id_cliente": this.id,
        "id_tipo_servicio": this.ddltipo_servicio,
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
        "id_estatus_servicio": 3,
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
          "servicio_producto": this.value_productos
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
    else {
      console.log("no");
    }

    //console.log(this.value_productos);

  }

  guardar_borrador() {
    if (this.validacion_tipo() && this.validacion_solicitado_por() && this.validacion_ddl_autorizacion() && this.validacion_contacto() && this.validacion_descripcion_actividades()
      && this.validacion_categoria_servicio() && this.Validacion_fecha_visita() && this.validacion_tecnico_visita() && this.validacion_hora_visita() &&
      this.validacion_terminos_condiciones()) {
      this.heroService.service_general("servicios", {
        "id_cliente": this.id,
        "id_tipo_servicio": this.ddltipo_servicio,
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
    if (this.ddltipo_servicio != 0) {
      this.productos = false;
    }

    // console.log(this.ddltipo_servicio);
    this.heroService.service_general("servicios/Productos_Servicio_Solicitado", {
      "id": this.ddltipo_servicio
    }).subscribe((value) => {
      //console.log(value);
      for (var i = 0; i < value.length; i++) {
        if (this.ddltipo_servicio == 1) {
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

        if (this.ddltipo_servicio == 2 || this.ddltipo_servicio == 3) {
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

        if (this.ddltipo_servicio == 4) {
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

        if (this.ddltipo_servicio == 5) {
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

      //console.log(this.productos_cliente);
      this.dataSource.data = this.productos_cliente;
      //console.log(this.dataSource.data[0].checked);

    });

    if (this.ddltipo_servicio == 1) {
      console.log("Instalación");

      this.concepto = "Instalación";
    }
    if (this.ddltipo_servicio == 2) {
      console.log("Matenimiento");
      this.concepto = "Matenimiento";
    }
    if (this.ddltipo_servicio == 3) {
      console.log("Reparación");
      this.concepto = "Reparación";
    }
    if (this.ddltipo_servicio == 4) {
      console.log("Entrega");
      this.concepto = "Entrega";
    }
    if (this.ddltipo_servicio == 5) {
      console.log("Diagnostico en taller");
      this.concepto = "Diagnostico en taller";
    }
  }

  //Catalogos
  gettiposervicio(): void {
    this.heroService.service_catalogos("Catalogos/TipoServicio")
      .subscribe((value) => {
        //console.log(value);
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
    //console.log(this.ddltipo_servicio);
    this.heroService.service_general("Catalogos/CategoriaServicio", {
      "id": this.ddltipo_servicio
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

  openDatosFiscales(): void {

    let dialogRef = this.dialog.open(DialogFactura, {
      width: '700px',
      disableClose: true,
      data: {
        razonsocial: this.razonsocial,
        rfc: this.rfc,
        email: this.email
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result);
      if (result != undefined) {
        this.factura = result;
        this.openIBS(result);
      }
    });
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

  _idtecnico: string;
  _tecnico: string;

  openAgenda(obj): void {
    let dialogRef = this.dialog.open(DialogAgenda, {
      width: '700px',
      disableClose: true,
      data: { _idtecnico: "", _tecnico: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log(result._idtecnico);
      //this.id_tecnico = result._idtecnico;
      this.heroService.service_general("Catalogos/TecnicosId", {
        "id": result._idtecnico
      }).subscribe((value) => {
        //console.log(value[0].id);
        this.id_tecnico = value[0].id;
        this.txttecnico_servicio = value[0].tecnico;
      });
    });
  }

}

@Component({
  selector: 'dialog-factura',
  templateUrl: './dialog-factura.html',
})
export class DialogFactura {

  constructor(
    public dialogRef: MatDialogRef<DialogFactura>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
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

@Component({
  selector: 'dialog-agenda',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dialog-agenda.html',
})
export class DialogAgenda {

  view: string = 'month';
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  tecnicos: string[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogAgenda>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private heroService: DatosService) { }

  ngOnInit() {
    this.gettecnicos();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  //llenar_tecnicos
  gettecnicos(): void {
    this.heroService.service_general("Catalogos/Tecnicos", {}).subscribe((value) => {
      //console.log(value);
      this.tecnicos = value;
    });
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


