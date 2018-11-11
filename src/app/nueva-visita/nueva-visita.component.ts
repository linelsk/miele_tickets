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
  selector: 'app-nueva-visita',
  templateUrl: './nueva-visita.component.html',
  styleUrls: ['./nueva-visita.component.css']
})
export class NuevaVisitaComponent implements OnInit {

  public direccion_cliente = new direccion();

  preventAbuse = false;
  id: number;
  id_cliente: number;
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
  public servicio_detalle: any[] = [];

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

  //chk_productos: any;
  set_productos(event, row, index) {    
    if (event.checked) {
      console.log(row);
      let _id_tipo_servicio: any = [];
      _id_tipo_servicio.push({
        id: this.servicio.id_tipo_servicio,
        desc_tipo_servicio: this.servicio.tipo_servicio
      });
      this.value_productos.push({
        id_producto: row.id,
        modelo: row.modelo,
        sku: row.sku,
        tipo: row.tipo,
        id_categoria: row.id_categoria,
        hora_tecnico: row.precio_hora,
        hora_precio: row.hora_precio,
        precio_visita: row.precio_visita,
        no_tecnicos: row.no_tecnico,
        primera_visita: false
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
      if (row.no_tecnico == null) {
        this.no_tecnico = 1;
      }
      else {
        if (this.no_tecnico < row.no_tecnico) {
          this.no_tecnico = row.no_tecnico;
        }
      }

      //if (this.value_productos.length == 1) {//Agregar este if a nuevo cliente, nuevo servicio y reagandar 
      //  this.categoria_servicio_cantidad = row.precio_visita;
      //}
      //else {
      //  if (_id_tipo_servicio.id != 1 && _id_tipo_servicio.id != 2) {
      //    this.categoria_servicio_cantidad = this.categoria_servicio_cantidad + 490
      //  }
      //}

      if (this.value_productos.length == 1 && _id_tipo_servicio.id != 1) {
        this.categoria_servicio_cantidad = row.precio_visita;
      }
      else {
        if (_id_tipo_servicio.id != 1) {
          this.categoria_servicio_cantidad = this.categoria_servicio_cantidad + 490
        }
        if (_id_tipo_servicio.id == 1) {
          this.categoria_servicio_cantidad = 0
        }
      }
    }
    else {
      let _id_tipo_servicio: any = [];
      _id_tipo_servicio.push({
        id: this.servicio.id_tipo_servicio,
        desc_tipo_servicio: this.servicio.tipo_servicio
      });
      for (var i = 0; i < this.value_productos.length; i++) {
        if (this.value_productos[i].id_producto == row.id) {
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
      if (_id_tipo_servicio.id != 1 && _id_tipo_servicio.id != 2) {
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

    this.sub = this.route.params.subscribe(params => {
      this.id_cliente = +params['id_cliente'];
      this.id = +params['id'];
    });

    //console.log(JSON.parse(localStorage.getItem("tecnicos_visita")));
    for (var i = 0; i < JSON.parse(localStorage.getItem("tecnicos_visita")).length; i++) {
      this.rel_tecnico_visita.push({
        id_tecnico: JSON.parse(localStorage.getItem("tecnicos_visita"))[i].id,
        tecnico_responsable: false
      });
    }

    this.tecnicos_visita.push({
      id_servicio: this.id,
      id_direccion: this.direccion_cliente.id,
      fecha_visita: this.visita.fecha_visita,
      hora: JSON.parse(localStorage.getItem("agenda")).event,
      actividades_realizar: this.servicio.descripcion_actividades,
      concepto: this.concepto,
      cantidad: 2,//this.categoria_servicio_cantidad,
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
      console.log(this.tecnicos_visita[0]);
      this.heroService.service_general("servicios/Agregar_visita", this.tecnicos_visita[0]).subscribe((value) => {
        //console.log(value);
        if (value.response = "OK") {
          this.snackBar.open("Visita guardada correctamente", "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
          this.router.navigate(['/editarservicio/' + this.id]);
        }
        //this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
        //  (value[0].visitas);
        //  //this.detalle_visita = value[0].visitas;
        //});
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

  ngOnInit() {
    this.servicio.id_solicitado_por = 1;
    this.servicio.id_solicitud_via = 1;
    this.visita.factura = false;
    this.visita.terminos_condiciones = true;
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
      this.id_cliente = +params['id_cliente'];
      this.id = +params['id'];
    });

    this.heroService.service_general_get("servicios/" + this.id, {}).subscribe((value) => {
      console.log(value);
      this.servicio_detalle = value[0];
      //this.dataSource.data = value[0].productos;
      this.servicio = value[0];
      //this.servicio.id_tipo_servicio.id = value[0].id_tipo_servicio;
      this.getproductos(value[0].id_tipo_servicio);
    });

    this.heroService.service_general_get("Clientes/" + this.id_cliente, {}).subscribe((value) => {
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
  getproductos(obj): void {
    this.productos_cliente = [];
    this.value_productos = [];
    this.categoria_servicio = 0;
    this.categoria_servicio_cantidad = 0;
    this.no_tecnico = 0;

    this.sub = this.route.params.subscribe(params => {
      this.id_cliente = +params['id_cliente'];
    });
    console.log(obj);
    this.heroService.service_general("servicios/Productos_Servicio_Solicitado", {
      id_cliente: this.id_cliente,
      id_tipo: obj
    }).subscribe((value) => {
      console.log(value);
      for (var i = 0; i < value.length; i++) {
        if (this.servicio.id_tipo_servicio.id == 1) {
          if (value[i].estatus == "Entregado") {
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
          if (value[i].estatus == "Instalado") {
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

        if (this.servicio.id_tipo_servicio.id == 4) {
          if (value[i].estatus == "Liberado") {
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
          if (value[i].estatus == "En diagnostico") {
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
            primera_visita: false
          });
          this.categoria_servicio = this.categoria_servicio + parseFloat(this.productos_cliente[i].hora_tecnico);
          if (this.productos_cliente[i].no_tecnicos == null) {
            this.no_tecnico = 1;
          }
          else {
            this.no_tecnico = parseInt(this.productos_cliente[i].no_tecnicos);
          }
          //console.log(this.productos_cliente[i].precio_visita);
          //this.categoria_servicio_cantidad =+ this.productos_cliente[i].hora_precio;
        }

        this.categoria_servicio_cantidad = (this.categoria_servicio * this.productos_cliente[0].hora_precio) + this.productos_cliente[0].precio_visita;
      }
      console.log(this.productos_cliente);
      this.dataSource.data = value;
      //console.log(this.dataSource.data[0].checked);

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

  getfacturamunicipios(): void {
    this.heroService.service_general("Catalogos/Municipio", {
      "id": this.detalle.datos_fiscales.id_estado
    })
      .subscribe((value) => {
        this.municipiosfactura = value;
      });
  }

  tecnicos: any[] = [];
  openAgenda(obj): void {
    console.log(this.value_productos);
    //let _id_tipo_servicio: any = [];
    //_id_tipo_servicio.push({
    //  id: this.servicio.id_tipo_servicio,
    //  desc_tipo_servicio: this.servicio.tipo_servicio
    //});

    if (this.servicio.id_tipo_servicio != undefined) {
      if (this.value_productos.length != 0) {
        this.tecnicos = [];
        this.id_producto_enviar = "";

        for (var i = 0; i < this.value_productos.length; i++) {
          this.id_producto_enviar += this.value_productos[i].id_categoria + ",";
        }
        //console.log(this.id_producto_enviar);
        this.heroService.service_general("servicios/TecnicoAgenda", { id: this.servicio.id_tipo_servicio, productos: this.id_producto_enviar }).subscribe((value) => {
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
            data: {
              tecnicos: this.tecnicos, tipo_servicio: { id: this.servicio.id_tipo_servicio, desc_tipo_servicio: this.servicio.tipo_servicio}, horas_tecnico: this.categoria_servicio, no_tecnico: this.no_tecnico, id_producto_enviar: this.id_producto_enviar }
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
  primera_visita: boolean = false;
}
