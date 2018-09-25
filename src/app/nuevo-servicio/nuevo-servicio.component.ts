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
import * as moment from 'moment';
import { CalendarioComponent } from '../calendario/calendario.component';
import { Clientes, direccion, datosfiscales, servicio, producto, visita } from '../models/cliente';
import * as jquery from 'jquery';

@Component({
  selector: 'app-nuevo-servicio',
  templateUrl: './nuevo-servicio.component.html',
  styleUrls: ['./nuevo-servicio.component.css']
})
export class NuevoServicioComponent implements OnInit {
  public direccion_cliente = new direccion();

  preventAbuse = false;
  id: number;
  public sub: any;
  public servicio = new servicio();
  localidades: string[] = [];
  terminos_y_condiciones: boolean = false;
  productos: boolean = true;
  public detalle = new Clientes();
  public detalle_direccion: any[] = [];
  value_productos: Productos_Servicio[] = [];
  value_productos_servicio: any[] = [];
  public ddltipo_servicio = new Tipo_Servicio();
  public visita = new visita();

  factura: any = {};
  razonsocial: string;
  rfc: string;
  email: string;
  view_editar_direccion: boolean = false;

  categoriaservicio: string[] = [];
  categoria_servicio: number = 0;
  categoria_servicio_texto: string = "";
  categoria_servicio_cantidad: number = 0;
  tiposervicio: string[] = [];
  sub_tipo_servicio: string[] = [];
  distribuidorservicio: string[] = [];
  id_direccion: number = 0;
  id_tecnico: tecnico;
  id_producto_enviar: string = "";
  txttecnico_servicio: string = "";
  estados: string[] = [];
  estadosFactura: string[] = [];
  municipios: string[] = [];
  municipiosfactura: string[] = [];
  productos_cliente: any[] = [];
  concepto: string = "";
  terminos_condiciones: boolean = false;
  no_tecnico: number = 0;

  public mask = [/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  public mask_telefono = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  ELEMENT_DATA: Element[] = [];

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(private heroService: DatosService, private route: ActivatedRoute, private router: Router, public dialog: MatDialog, public snackBar: MatSnackBar) { }
  myControl: FormControl = new FormControl();

  displayedColumns = ['select', 'Modelo', 'SKU', 'Tipo', 'Garantia', 'Poliza', 'Estatus', 'visitas'];
  displayedColumns_direccion = ['select', 'Calle', 'Colonia', 'Estado', 'Municipio', 'CP', 'boton'];

  dataSource = new MatTableDataSource();
  dataSource_direccion = new MatTableDataSource();
  selection = new SelectionModel<Element>(true, []);

  options: any[] = [];

  filteredOptions: Observable<any[]>;
  
  set_productos(event, row, index) {
    if (event.checked) {
      this.value_productos.push({
        id_producto: row.id,
        modelo: row.modelo,
        sku: row.sku,
        tipo: row.tipo,
        id_categoria: row.id_categoria,
        hora_tecnico: row.hora_tecnico,
        hora_precio: row.hora_precio,
        precio_visita: row.precio_visita,
        no_tecnicos: row.no_tecnicos,
        primera_visita: true
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

      this.categoria_servicio = this.categoria_servicio + parseFloat(row.hora_tecnico);
      if (row.no_tecnicos == null) {
        this.no_tecnico = 1;
      }
      else {
        if (this.no_tecnico < row.no_tecnicos) {
          this.no_tecnico = row.no_tecnicos;
        }        
      }

      //if (this.value_productos.length == 1) {
      //  this.categoria_servicio_cantidad = row.precio_visita;
      //}
      //else {
      //  if (this.servicio.id_tipo_servicio.id != 1 && this.servicio.id_tipo_servicio.id != 2) {
      //    this.categoria_servicio_cantidad = this.categoria_servicio_cantidad + 490
      //  }        
      //}

      if (this.value_productos.length == 1 && this.servicio.id_tipo_servicio.id != 1) {
        this.categoria_servicio_cantidad = row.precio_visita;
      }
      else {
        if (this.servicio.id_tipo_servicio.id != 1) {
          this.categoria_servicio_cantidad = this.categoria_servicio_cantidad + 490
        }
        if (this.servicio.id_tipo_servicio.id == 1) {
          this.categoria_servicio_cantidad = 0
        }
      }
    }
    else {
      for (var i = 0; i < this.value_productos.length; i++) {
        if (this.value_productos[i].id_producto == row.id) {
          //console.log(this.value_productos);
          this.value_productos.splice(i, 1);
          this.productos_cliente.splice(i, 1);
          this.value_productos_servicio.splice(i, 1);
          this.categoria_servicio = this.categoria_servicio - parseFloat(row.hora_tecnico);//Agregar esta linea a nuevo cliente, nuevo servicio y reagandar 
        }
      }
      for (var i = 0; i < this.value_productos.length; i++) {
        if (this.value_productos[i].no_tecnicos == 2) {
          this.no_tecnico = this.value_productos[i].no_tecnicos;
          break;
        }
        else {
          this.no_tecnico = this.value_productos[i].no_tecnicos;
        }
      }
      if (this.value_productos.length == 0) {//Agregar este if a nuevo cliente, nuevo servicio y reagandar 
        this.categoria_servicio = 0;
        this.categoria_servicio_cantidad = 0;
      }
      if (this.value_productos.length == 1) {//Agregar este if a nuevo cliente, nuevo servicio y reagandar 
        this.categoria_servicio_cantidad = row.precio_visita;
      }
      if (this.servicio.id_tipo_servicio.id != 1 && this.servicio.id_tipo_servicio.id != 2) {
        if (this.value_productos.length > 1) {//Agregar este if a nuevo cliente, nuevo servicio y reagandar 
          this.categoria_servicio_cantidad = this.categoria_servicio_cantidad + 490;
        }
      }
      
    }

  };

  direccion(row) {
    this.id_direccion = row.id;
  };

  tecnicos_visita: any[] = [];
  rel_tecnico_visita: any[] = [];
  guardar_servicio(obj) {

    //console.log(JSON.parse(localStorage.getItem("tecnicos_visita")));
    for (var i = 0; i < JSON.parse(localStorage.getItem("tecnicos_visita")).length; i++) {
      this.rel_tecnico_visita.push({
        id_tecnico: JSON.parse(localStorage.getItem("tecnicos_visita"))[i].id,
        tecnico_responsable: false
      });
    }

    this.tecnicos_visita.push({
      id_direccion: this.direccion_cliente.id,
      fecha_visita: this.visita.fecha_visita,
      //id_tecnico: JSON.parse(localStorage.getItem("tecnicos_visita"))[i].id,
      hora: JSON.parse(localStorage.getItem("agenda")).event,
      actividades_realizar: this.servicio.descripcion_actividades,
      concepto: this.concepto,
      cantidad: this.categoria_servicio_cantidad,
      pagado: true,
      pago_pendiente: this.visita.pago_pendiente,
      garantia: false,
      fecha_deposito: "01/01/1900",
      no_operacion: "1",
      comprobante: "",
      terminos_condiciones: this.visita.terminos_condiciones,
      factura: this.visita.factura,
      servicio_producto: this.value_productos,
      hora_fin: parseInt(localStorage.getItem("fecha_fin")),
      rel_tecnico_visita: this.rel_tecnico_visita,
      asignacion_refacciones: false,
      pre_diagnostico: false,
      si_acepto_tecnico_refaccion: false,
      entrega_refacciones: false
    });
    if (this.visita.terminos_condiciones) {
      this.heroService.service_general("servicios", {
        id_cliente: this.id,
        id_tipo_servicio: this.servicio.id_tipo_servicio.id,
        id_sub_tipo_servicio: this.servicio.id_sub_tipo_servicio,
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
        no_servicio: this.servicio.no_servicio,
        fecha_servicio: this.visita.fecha_visita,
        id_estatus_servicio: 3,
        IBS: this.servicio.IBS,
        id_motivo_cierre: this.servicio.id_motivo_cierre,
        fecha_inicio_servicio: "01/01/1900",
        visita: this.tecnicos_visita        
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
      this.terminos_y_condiciones = true;

      this.snackBar.open("Debes de aceptar terminos y condiciones", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
  }

  set_terminos(event) {
    if (event.checked) {
      this.terminos_y_condiciones = false;
    }
    else {
      this.terminos_y_condiciones = true;
    }
  }

  //guardar_borrador() {

  //  this.heroService.service_general("servicios", {
  //    "id_cliente": this.id,
  //    "id_tipo_servicio": this.ddltipo_servicio.id,
  //    "actualizado": "01/01/1900",
  //    "actualizadopor": 0,
  //    "creado": this.heroService.fecha_hoy(),
  //    "creadopor": JSON.parse(localStorage.getItem("user")).id,
  //    "id_solicitado_por": this.rdsolicitado,
  //    "id_distribuidor_autorizado": this.ddldistribuidor_autorizado,
  //    "contacto": this.txtcontacto,
  //    "activar_credito": this.activarcredito,
  //    "id_solicitud_via": this.rdsolicitudvia,
  //    "descripcion_actividades": this.txtdescripcion_actividades,
  //    "id_categoria_servicio": this.ddlcategoria_servicio,
  //    "no_servicio": "",
  //    "fecha_servicio": this.heroService.fecha_formato(this.txtfecha_cita),
  //    "id_estatus_servicio": 2,
  //    "IBS": "",
  //    "id_motivo_cierre": 0,
  //    "fecha_inicio_servicio": "01/01/1900",
  //    "visita": [{
  //      "id_direccion": this.id_direccion,
  //      "fecha_visita": this.heroService.fecha_formato(this.txtfecha_cita),
  //      "id_tecnico": this.tecnico_id,
  //      "hora": this.txthora_servicio,
  //      "actividades_realizar": "",
  //      "concepto": this.concepto,
  //      "cantidad": "6000",
  //      "pagado": true,
  //      "pago_pendiente": false,
  //      "garantia": false,
  //      "fecha_deposito": "01/01/1900",
  //      "no_operacion": "1",
  //      "comprobante": "",
  //      "terminos_condiciones": this.terminos_condiciones,
  //      "factura": this.requiere_factura,
  //      "servicio_producto": [{
  //        id_producto: 2,
  //        estatus: 1
  //      },
  //      {
  //        id_producto: 3,
  //        estatus: 1
  //      },
  //      ]
  //    }]
  //  }).subscribe((value) => {
  //    //console.log(value);
  //    this.snackBar.open("Borrador guardado correctamente", "", {
  //      duration: 5000,
  //      verticalPosition: 'bottom',
  //      horizontalPosition: 'right',
  //      extraClasses: ['blue-snackbar']
  //    });
  //  });

  //}

  guardar_direccion(ev) {
    //console.log(this.direccion_cliente.id);
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.heroService.service_general("Servicios/Editar_Direccion", this.direccion_cliente)
      .subscribe((value) => {
        if (value.response == "OK") {
          this.getdireccioncliente(this.id);
          this.heroService.service_general_get("Clientes/" + this.id, {}).subscribe((value) => {
            this.detalle = value[0];
            console.log(this.detalle);
          });
        }
        this.view_editar_direccion = false;
      });
  }

  ngOnInit() {
    this.servicio.id_solicitado_por = 1;
    this.servicio.id_solicitud_via = 1;
    this.visita.factura = false;
    this.gettiposervicio();
    this.getdistribuidor();
    //this.getfacturaestados();

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
      console.log(value);
      this.detalle = value[0];
      this.detalle.datos_fiscales = value[0].datos_fiscales[0];
      if (value[0].direcciones != "") {
        this.detalle_direccion = value[0].direcciones[0];
        this.direccion_cliente = value[0].direcciones[0];
        this.direccion_cliente.telefono = value[0].telefono;
        this.direccion_cliente.telefono_movil = value[0].telefono_movil;
        this.direccion_cliente.Fecha_Estimada = value[0].referencias;
        this.direccion_cliente.id_cliente = this.id;
        this.sepomex();
        this.sepomexdatosfiscales();
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

  sepomex() {
    console.log(this.direccion_cliente.cp.length);
    if (this.direccion_cliente.cp.length == 5) {
      this.heroService.service_general("Servicios/Sepomex", { id: this.direccion_cliente.cp })
        .subscribe((value) => {
          this.getestados();
          this.direccion_cliente.id_estado = value[0].id_estado;
          this.getmunicipios();
          this.direccion_cliente.id_municipio = value[0].id_municipio;
          this.localidades = value[0].localidades;
          this.direccion_cliente.colonia = value[0].localidades[0].id_localidad;
        });
    }
  }

  sepomexdatosfiscales() {
    console.log(this.detalle.datos_fiscales.cp);
    if (this.detalle.datos_fiscales.cp.length == 5) {
      this.heroService.service_general("Servicios/Sepomex", { id: this.detalle.datos_fiscales.cp })
        .subscribe((value) => {
          this.getfacturaestados();
          this.detalle.datos_fiscales.id_estado = value[0].id_estado;
          this.getfacturamunicipios();
          this.detalle.datos_fiscales.id_municipio = value[0].id_municipio;
          //this.localidades = value[0].localidades;
          this.detalle.datos_fiscales.colonia = value[0].localidades[0].localidad;
        });
    }
  }

  //llenar_productos
  getproductos(): void {
    this.productos_cliente = [];
    this.value_productos = [];
    this.categoria_servicio = 0;
    this.categoria_servicio_cantidad = 0;
    this.no_tecnico = 0;

    this.heroService.service_general("Catalogos/SubTipoServicio", { id: this.servicio.id_tipo_servicio.id })
      .subscribe((value) => {
        this.sub_tipo_servicio = value;
      });

    if (this.servicio.id_tipo_servicio.id != 0) {
      this.productos = false;
    }

    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });

    this.heroService.service_general("servicios/Productos_Servicio_Solicitado", {
      id_cliente: this.id,
      id_tipo: this.servicio.id_tipo_servicio.id
    }).subscribe((value) => {
      //console.log(value);
      this.categoria_servicio_cantidad = 0;
      for (var i = 0; i < value.length; i++) {
        if (this.servicio.id_tipo_servicio.id == 1) {
          if (value[i].estatus.trim() == "Pending to install" || value[i].estatus.trim() == "Ready to Install") {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "id_categoria": value[i].id_categoria,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": true,
              "no_visitas": value[i].no_visitas,
              "hora_tecnico": value[i].hora_tecnico,
              "hora_precio": value[i].precio_hora,
              "precio_visita": value[i].precio_visita,
              "no_tecnicos": value[i].no_tecnico
            });
          }
          else {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "id_categoria": value[i].id_categoria,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": false,
              "no_visitas": value[i].no_visitas,
              "hora_tecnico": value[i].hora_tecnico,
              "hora_precio": value[i].precio_hora,
              "precio_visita": value[i].precio_visita,
              "no_tecnicos": value[i].no_tecnico
            });
          }
        }

        if (this.servicio.id_tipo_servicio.id == 2 || this.servicio.id_tipo_servicio.id == 3) {
         // console.log(value[i].estatus + "==" + "Installed");
          if (value[i].estatus.trim() == "Installed" || value[i].estatus.trim() == "Completed") {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "id_categoria": value[i].id_categoria,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": true,
              "no_visitas": value[i].no_visitas,
              "hora_tecnico": value[i].hora_tecnico,
              "hora_precio": value[i].precio_hora,
              "precio_visita": value[i].precio_visita,
              "no_tecnicos": value[i].no_tecnico
            });
          }
          else {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "id_categoria": value[i].id_categoria,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": false,
              "no_visitas": value[i].no_visitas,
              "hora_tecnico": value[i].hora_tecnico,
              "hora_precio": value[i].precio_hora,
              "precio_visita": value[i].precio_visita,
              "no_tecnicos": value[i].no_tecnico
            });
          }
        }

        if (this.servicio.id_tipo_servicio.id == 5) {
          if (value[i].estatus.trim() == "Delivered") {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "id_categoria": value[i].id_categoria,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": true,
              "no_visitas": value[i].no_visitas,
              "hora_tecnico": value[i].hora_tecnico,
              "hora_precio": value[i].precio_hora,
              "precio_visita": value[i].precio_visita,
              "no_tecnicos": value[i].no_tecnico
            });
          }
          else {
            this.productos_cliente.push({
              "id": value[i].id,
              "modelo": value[i].modelo,
              "sku": value[i].sku,
              "tipo_equipo": value[i].tipo_equipo,
              "id_categoria": value[i].id_categoria,
              "garantia": value[i].garantia,
              "poliza": value[i].poliza,
              "estatus": value[i].estatus,
              "checked": false,
              "no_visitas": value[i].no_visitas,
              "hora_tecnico": value[i].hora_tecnico,
              "hora_precio": value[i].precio_hora,
              "precio_visita": value[i].precio_visita,
              "no_tecnicos": value[i].no_tecnico
            });
          }
        }
      }

      for (var i = 0; i < this.productos_cliente.length; i++) {
        if (this.productos_cliente[i].checked) {
          this.value_productos.push({
            id_producto: this.productos_cliente[i].id,
            modelo: this.productos_cliente[i].modelo,
            sku: this.productos_cliente[i].sku,
            tipo: this.productos_cliente[i].tipo_equipo,
            id_categoria: this.productos_cliente[i].id_categoria,
            hora_tecnico: this.productos_cliente[i].hora_tecnico,
            hora_precio: this.productos_cliente[i].hora_precio,
            precio_visita: this.productos_cliente[i].precio_visita,
            no_tecnicos: this.productos_cliente[i].no_tecnico,
            primera_visita: true
          });

          this.categoria_servicio = this.categoria_servicio + parseFloat(this.productos_cliente[i].hora_tecnico);
          if (this.productos_cliente[i].no_tecnico == null) {
            this.no_tecnico = 1;
          }
          else {
            if (this.no_tecnico < this.productos_cliente[i].no_tecnico) {
              this.no_tecnico = this.productos_cliente[i].no_tecnico;
            }
          }
        }
      }
      if (this.value_productos.length != 0) {
        if (this.productos_cliente.length == 1 && this.servicio.id_tipo_servicio.id != 1) {
          this.categoria_servicio_cantidad = this.productos_cliente[0].precio_visita;
        }
        else {
          if (this.servicio.id_tipo_servicio.id != 1) {
            //console.log(this.productos_cliente);
            this.categoria_servicio_cantidad = this.productos_cliente[0].precio_visita + 490
          }
          if (this.servicio.id_tipo_servicio.id == 1) {
            this.categoria_servicio_cantidad = 0
          }
        }
      }
     
      this.dataSource.data = this.productos_cliente;

    });

    if (this.servicio.id_tipo_servicio.id == 1) {
      console.log("Instalación");

      this.concepto = "Instalación";
    }
    if (this.servicio.id_tipo_servicio.id == 2) {
      console.log("Matenimiento");
      this.concepto = "Matenimiento";
    }
    if (this.servicio.id_tipo_servicio.id == 3) {
      console.log("Reparación");
      this.concepto = "Reparación";
    }
    if (this.servicio.id_tipo_servicio.id == 4) {
      console.log("Entrega");
      this.concepto = "Entrega";
    }
    if (this.servicio.id_tipo_servicio.id == 5) {
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
      "id": this.direccion_cliente.id_estado
    })
      .subscribe((value) => {
        this.municipios = value;
      });
  }

  getfacturaestados(): void {
    this.heroService.service_general("Catalogos/Estados", {})
      .subscribe((value) => {
        console.log(value);
        this.estadosFactura = value;
      });
  }

  getfacturamunicipios(): void {
    this.heroService.service_general("Catalogos/Municipio", {
      "id": this.detalle.datos_fiscales.id_estado
    })
      .subscribe((value) => {
        this.municipiosfactura = value;
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

  tecnicos: any[] = [];
  openAgenda(obj): void {    

    if (this.servicio.id_tipo_servicio != undefined) {
      if (this.value_productos.length != 0) {
        this.tecnicos = [];
        this.id_producto_enviar = "";

        for (var i = 0; i < this.value_productos.length; i++) {
          this.id_producto_enviar += this.value_productos[i].id_categoria + ",";
        }
        //console.log(this.id_producto_enviar);
        this.heroService.service_general("servicios/TecnicoAgenda", { id: this.servicio.id_tipo_servicio.id, productos: this.id_producto_enviar }).subscribe((value) => {
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
            data: { tecnicos: this.tecnicos, tipo_servicio: this.servicio.id_tipo_servicio, horas_tecnico: this.categoria_servicio, no_tecnico: this.no_tecnico, id_producto_enviar: this.id_producto_enviar }
          });
          dialogRef.afterClosed().subscribe(result => {
            console.log(localStorage.getItem("agenda"));
            if (result == undefined) {
              this.txttecnico_servicio = "";
              this.visita.fecha_visita = "";
              this.visita.hora = "";
              localStorage.setItem("agenda", "");
            }
            else {
              if (localStorage.getItem("agenda") != "") {
                console.log(JSON.parse(localStorage.getItem("agenda")).tecnico[0]);
                this.visita.id_tecnico = JSON.parse(localStorage.getItem("agenda")).tecnico[0].id;
                this.txttecnico_servicio = JSON.parse(localStorage.getItem("agenda")).tecnico[0].tecnico;
                this.visita.fecha_visita = JSON.parse(localStorage.getItem("agenda")).fecha;
                this.visita.hora = JSON.parse(localStorage.getItem("agenda")).event + ":00 hrs";
              }
            }

          });
        })
      }
      else {
        this.snackBar.open("Para poder agendar es necesario elegir uno o mas productos", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      }
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

  view_direccion(row) {
    //console.log(row);
    this.view_editar_direccion = true;
  }

  view_direccion_regresar() {
    //console.log(row);
    this.view_editar_direccion = false;
  }

  validaciones(event) {

    for (var i = 0; i < event.length; i++) {
      console.log(event[i].name);
      if (!event[i].valid) {
        $("#" + event[i].name).focus();
        break;
      }
    }
    this.snackBar.open("Algunos campos necesitan ser revisados", "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']
    });
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

export class Productos_Servicio {
  id_producto: number;
  modelo: string;
  sku: string;
  tipo: string;
  id_categoria: number;
  hora_tecnico: number;
  hora_precio: string;
  precio_visita: number;
  no_tecnicos: number;
  primera_visita: boolean = true;
}
