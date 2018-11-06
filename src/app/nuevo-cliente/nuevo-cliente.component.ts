import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { DatosService } from '../datos.service';
import { Clientes, direccion, datosfiscales, servicio, producto, visita, tecnico } from '../models/cliente';
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
import { elementAt } from 'rxjs/operators/elementAt';
import { locale } from 'moment';
import { CalendarioComponent } from '../calendario/calendario.component';
import * as jquery from 'jquery';

@Component({
  selector: 'app-nuevo-cliente',
  templateUrl: './nuevo-cliente.component.html',
  styleUrls: ['./nuevo-cliente.component.css']
})
export class NuevoClienteComponent implements OnInit {

  public mask_telefono = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public cliente = new Clientes();
  public direccion = new direccion();
  //public direccion_servicio = new direccion();
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
  sub_tipo_servicio: string[] = [];
  distribuidor_servicio: string[] = [];
  estados_datos_fiscales: string[] = [];
  municipios_datos_fiscales: string[] = [];
  //estados_direccion_servicios: string[] = [];nuevo_producto
  //municipios_direccion_servicios: string[] = [];
  localidades_datos_fiscales: string[] = [];
  //localidades_direccion_servicios: string[] = [];
  mostrar_distribuidor: boolean = true;
  ver_productos: boolean = true;
  ver_nuevo_producto: boolean = false;
  preventAbuse = false;
  text_busqueda: string = "";
  //valid_tipo_taller: boolean = false;
  categoria_servicio: number = 0;
  no_tecnico: number = 0;
  no_checks: number = 0;
  txt_tecnico: string;
  concepto: string;
  id_producto_enviar: string = "";
  categoria_servicio_cantidad: number;
  public values: string[];

  public mask = [/[0-9]/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  public mask_cp = [/\d/, /\d/, /\d/, /\d/, /\d/];

  constructor(private heroService: DatosService, public dialog: MatDialog, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }
  displayedColumns = ['select', 'Modelo', 'SKU', 'Tipo'];
  dataSource = new MatTableDataSource();

  ngOnInit() {
    this.heroService.verificarsesion();
    this.cliente.tipo_persona = "Persona fisica";
    this.servicio.id_solicitado_por = 1;
    this.servicio.id_solicitud_via = 1;
    this.visita.factura = true;
    this.visita.terminos_condiciones = true;

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
    this.dataSource.data = [];
    this.value_productos = [];
    this.no_tecnico = 0;
    this.text_busqueda = "";
    this.productos_cliente = [];
    this.visita.fecha_visita = "";
    this.txt_tecnico = "";
    this.visita.hora = "";
    this.categoria_servicio = 0;
    this.categoria_servicio_cantidad = 0
    this.concepto = this.servicio.id_tipo_servicio.desc_tipo_servicio

    this.heroService.service_general("Catalogos/SubTipoServicio", { id: this.servicio.id_tipo_servicio.id })
      .subscribe((value) => {
        this.sub_tipo_servicio = value;
      });
  };

  mensaje: string = "";
  ver: boolean = false;
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
        "texto": this.text_busqueda,
        "id": this.servicio.id_tipo_servicio.id
      }).subscribe((value) => {
        if (value != "") {
          this.ver = false;
          this.mensaje = "";
          setTimeout(() => {
            this.preventAbuse = false;
            this.ver_nuevo_producto = false;

            this.dataSource.data = value;
          }, 400);
        }
        else {
          this.ver = true;
          this.mensaje = "No hay productos con la busqueda " + this.text_busqueda;
          this.preventAbuse = false;
          this.ver_nuevo_producto = false;
          this.dataSource.data = [];
        }

      });
    }
  }

  nuevo_producto() {
    this.ver_nuevo_producto = true;
    this.getproducto();
  }

  regresar_busqueda() {
    this.ver_nuevo_producto = false;
  }


  set_productos(event, row, index) {
    console.log(row);
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
        Id_EsatusCompra: 1006,
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
      console.log(row);
      for (var i = 0; i < this.value_productos.length; i++) {
        if (this.value_productos[i].id_producto == row.id) {
          this.value_productos.splice(i, 1);
          this.productos_cliente.splice(i, 1);
          this.value_productos_servicio.splice(i, 1);
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
        this.no_tecnico = 0;
      }
      if (this.value_productos.length == 1) {//Agregar este if a nuevo cliente, nuevo servicio y reagandar 
        this.categoria_servicio_cantidad = row.precio_visita;
      }
      if (this.servicio.id_tipo_servicio.id != 1) {
        console.log("HHJKK");
        if (this.value_productos.length > 1) {//Agregar este if a nuevo cliente, nuevo servicio y reagandar
          console.log("9999");
          this.categoria_servicio_cantidad = this.categoria_servicio_cantidad - 490;
        }
      }
    }
  };

  delete_producto(obj) {
    console.log(obj);
    for (var i = 0; i < this.value_productos.length; i++) {
      if (this.value_productos[i].id_producto == obj.id_producto) {
        this.value_productos.splice(i, 1);

        this.categoria_servicio = this.categoria_servicio - parseFloat(obj.hora_tecnico);//Agregar esta linea a nuevo cliente, nuevo servicio y reagandar 
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
      this.no_tecnico = 0;
    }
    if (this.value_productos.length == 1) {//Agregar este if a nuevo cliente, nuevo servicio y reagandar 
      this.categoria_servicio_cantidad = 890;
    }
    if (this.servicio.id_tipo_servicio.id != 1) {
      if (this.value_productos.length > 1) {//Agregar este if a nuevo cliente, nuevo servicio y reagandar 
        this.categoria_servicio_cantidad = this.categoria_servicio_cantidad - 490;
      }
    }
  };

  guardar_producto() {
    //console.log(this.producto.id_categoria.id);
    if (this.producto.id_categoria.id != undefined) {
      this.heroService.service_general("Catalogos/Nuevo_Producto", {
        sku: this.producto.sku,
        modelo: this.producto.id_categoria.codigo,
        nombre: this.producto.id_categoria.descripcion,
        descripcion_corta: this.producto.descripcion_corta,
        descripcion_larga: this.producto.descripcion_larga,
        atributos: this.producto.atributos,
        precio_sin_iva: this.producto.precio_sin_iva,
        precio_con_iva: this.producto.precio_con_iva,
        id_categoria: this.producto.id_categoria.id,
        id_linea: this.producto.id_linea,
        id_sublinea: this.producto.id_sublinea,
        ficha_tecnica: this.producto.ficha_tecnica,
        horas_tecnico: this.producto.horas_tecnico,
        precio_hora: this.producto.precio_hora,
        estatus: this.producto.estatus,
        creado: this.producto.creado,
        creadopor: this.producto.creadopor,
        actualizado: this.producto.actualizado,
        actualizadopor: this.producto.actualizadopor,
        tipo: this.producto.tipo
      })
        .subscribe((value) => {
          console.log(value);
          this.snackBar.open(value.value.response, "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
          this.heroService.service_general("Catalogos/Horas_tecnico", {
            id_categoria: value.value.item[0].id_categoria,
            id_tipo_servicio: this.servicio.id_tipo_servicio.id
          }).subscribe((result) => {
            //console.log(result.value.item.id);
            this.categoria_servicio = this.categoria_servicio + parseFloat(result.value.item.horas_tecnicos);
            if (result.value.item.no_tecnicos == null) {
              this.no_tecnico = 1;
            }
            else {
              if (this.no_tecnico < result.value.item.no_tecnicos) {
                this.no_tecnico = result.value.item.no_tecnicos;
              }
            }
       
            this.value_productos.push({
              id_producto: value.value.item[0].id,
              modelo: value.value.item[0].modelo,
              sku: value.value.item[0].sku,
              tipo: value.value.item[0].nombre,
              id_categoria: result.value.item.id_categoria,
              hora_tecnico: result.value.item.horas_tecnicos,
              hora_precio: result.value.item.hora_precio,
              precio_visita: result.value.item.precio_visita,
              no_tecnicos: result.value.item.no_tecnicos,
              primera_visita: true
            });
            this.productos_cliente.push({
              Id_Producto: value.value.item[0].id,
              FinGarantia: "01/01/1900",
              FechaCompra: "01/01/1900",
              NoPoliza: "S/N",
              Id_EsatusCompra: 1006,
              NoOrdenCompra: "S/N"
            });

            if (this.value_productos.length == 1 && this.servicio.id_tipo_servicio.id != 1) {
              this.categoria_servicio_cantidad = result.value.item.precio_visita;
            }
            else {
              if (this.servicio.id_tipo_servicio.id != 1) {
                this.categoria_servicio_cantidad = this.categoria_servicio_cantidad + 490
              }
              if (this.servicio.id_tipo_servicio.id == 1) {
                this.categoria_servicio_cantidad = 0
              }
            }
          });
        });
    }
    else {
      this.snackBar.open("Ingresa una categoría de producto", "", {
        duration: 5000,
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        extraClasses: ['blue-snackbar']
      });
    }
  }

  copiar_direccion() {
    this.datosfiscales.cp = this.direccion.cp;
    this.sepomex_datos_fiscales();
    this.datosfiscales.calle_numero = this.direccion.calle_numero;
    this.datosfiscales.Int_fact = this.direccion.NumInt;
    this.datosfiscales.Ext_fact = this.direccion.NumExt;
    this.datosfiscales.telefono_fact = this.cliente.telefono;
    this.datosfiscales.email = this.cliente.email;
    if (this.cliente.nombre == "" || this.cliente.nombre == null) {
      this.datosfiscales.razon_social = this.cliente.nombre_comercial;
    }
    else {
      this.datosfiscales.razon_social = this.cliente.nombre + " " + this.cliente.paterno + " " + this.cliente.materno
    }
  }

  tipo_calle: any[] = ["CALLE", "calle", "AV.", "Av.", "AVENIDA", "avenida", "BOULEVAR", "boulevar", "blvr", "BLVR", "av", "CALLEJON", "callejon", "CERRADA", "cerrada",]
  _tipo_calle_direccion: boolean = false;
  _nombre_calle: string = "";
  _tipo_calle_datos_fiscales: boolean = false;
  _nombre_calle_datos_fiscales: string = "";
  //_tipo_calle_direccion_servicios: boolean = false;
  //_nombre_calle_direccion_servicio: string = "";
  validar_calle() {
    console.log(this.direccion.calle_numero);
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
  desc_localidad: string;
  set_colonia(obj) {
    console.log(obj);
    this.desc_localidad = obj;
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
          //this.desc_localidad = value[0].localidades[0].desc_localidad;
          this.datosfiscales = new datosfiscales();
          //console.log(value);
        });
    }
  }

  sepomex_datos_fiscales() {
    if (this.datosfiscales.cp.length == 5) {
      this.heroService.service_general("Servicios/Sepomex", { id: this.datosfiscales.cp })
        .subscribe((value) => {
          //console.log(this.direccion.id_localidad);
          this.datosfiscales.id_estado = value[0].id_estado;
          this.getestados_datos_fiscales();
          this.getmunicipios_datos_fiscales();
          this.datosfiscales.id_municipio = value[0].id_municipio;
          this.localidades_datos_fiscales = value[0].localidades;
          this.datosfiscales.colonia = this.desc_localidad;
        });
    }
  }

  validaciones(event) {
    for (var i = 0; i < event.length; i++) {
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

  tecnicos: any[] = [];
  openAgenda(obj): void {

    if (this.servicio.id_tipo_servicio != undefined) {
      if (this.no_tecnico != 0) {
        this.tecnicos = [];
        this.id_producto_enviar = "";

        console.log(this.no_tecnico);
        console.log(this.value_productos);
        for (var i = 0; i < this.value_productos.length; i++) {
          this.id_producto_enviar += this.value_productos[i].id_categoria + ",";
        }
        //console.log(this.id_producto_enviar);
        this.heroService.service_general("servicios/TecnicoAgenda", { id: this.servicio.id_tipo_servicio.id, productos: this.id_producto_enviar }).subscribe((value) => {
          //console.log(value);
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
            console.log(result);
            if (result == undefined) {
              this.txt_tecnico = "";
              this.visita.fecha_visita = "";
              this.visita.hora = "";
              localStorage.setItem("agenda", "");
            }
            else {
              if (localStorage.getItem("agenda") != "") {
                //console.log(JSON.parse(localStorage.getItem("agenda")).tecnico[0]);
                this.visita.id_tecnico = JSON.parse(localStorage.getItem("agenda")).tecnico[0].id;
                this.txt_tecnico = JSON.parse(localStorage.getItem("agenda")).tecnico[0].tecnico;
                this.visita.fecha_visita = JSON.parse(localStorage.getItem("agenda")).fecha;
                this.visita.hora = JSON.parse(localStorage.getItem("agenda")).hora_inicio;
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

  set_terminos(event) {
    if (event.checked) {
      this.terminos_y_condiciones = false;
    }
    else {
      this.terminos_y_condiciones = true;
    }
  }

  terminos_y_condiciones: boolean = false;
  tecnicos_visita: any[] = [];
  rel_tecnico_visita: any[] = [];
  guardar_cliente() {
    //console.log(this.value_productos);
    for (var i = 0; i < JSON.parse(localStorage.getItem("tecnicos_visita")).length; i++) {
      this.rel_tecnico_visita.push({
        id_tecnico: JSON.parse(localStorage.getItem("tecnicos_visita"))[i].id,
        tecnico_responsable: false
      });
    }

    this.tecnicos_visita.push({
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
    })

    if (this.visita.terminos_condiciones) {
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
        direccion: [this.direccion],
        datos_fiscales: [this.datosfiscales],
        Id_Cliente_Productos: this.productos_cliente,
        servicio: [{
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
          no_servicio: "",
          fecha_servicio: this.visita.fecha_visita,
          id_estatus_servicio: 3,
          IBS: "",
          id_motivo_cierre: 0,
          fecha_inicio_servicio: "01/01/1900",
          visita: this.tecnicos_visita
        }]
      }).subscribe((data) => {
        console.log(data);
        this.openIBS(data.value.ordenes[0].id);
        this.heroService.service_notificacion({
          descripcion: 'El servicio número ' + data.value.ordenes[0].id + ' esta listo para comenzar un prediagnostico',
          estatus_leido: false,
          evento: 'Servicio Pre Scheduled',
          rol_notificado: 10009,
          creado: this.heroService.fecha_hoy(),
          creadopor: JSON.parse(localStorage.getItem("user")).id
        }).subscribe((notificacion) => {
          //(notificacion);
        });
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

  getproducto(): void {
    this.heroService.service_catalogos("Catalogos/CategoriaProducto")
      .subscribe((value) => {
        console.log(value);
        this.values = value;
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

export class Productos_Cliente {
  Id_Producto: number;
  FinGarantia: any;
  FechaCompra: any;
  NoPoliza: string;
  Id_EsatusCompra: any;
  NoOrdenCompra: string;
}
