import { DatosService } from '../datos.service';
import * as moment from 'moment';

export class Clientes {
  folio: string;
  nombre: string;
  paterno: string;
  materno: string;
  nombre_comercial: string;
  nombre_contacto: string;
  email: string;
  telefono: string;
  telefono_movil: string;
  referencias: string;
  tipo_persona: string;
  estatus: boolean;
  creado: any;
  creadopor: number;

  datos_fiscales = new datosfiscales();
}

export class direccion {
  id: number;
  id_cliente: number;
  calle_numero: string;
  cp: string;
  id_estado: number;
  id_localidad: number;
  estado: string;
  id_municipio: number;
  municipio: string;
  colonia: number;
  telefono: string;
  telefono_movil: string;
  estatus: boolean;
  creado: any = moment().format("MM/DD/YYYY HH:mm:ss");
  creadopor: number = JSON.parse(localStorage.getItem("user")).id;
  tipo_direccion: number = 1;
  nombrecontacto: string;
  NumExt: string;
  NumInt: string;
  Fecha_Estimada: string;
}

export class datosfiscales {
  id_cliente: number;
  calle_numero: string;
  colonia: string;
  cp: string;
  email: string;
  id_estado: number;
  estado: string;
  id_municipio: number;
  municipio: string;
  razon_social: string;
  rfc: string;
  Ext_fact: string;
  Int_fact: string;
  nombre_fact: string;
  telefono_fact: string;
}

export class servicio {
  id_cliente: number;
  id_tipo_servicio: Tipo_Servicio;
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
}

export class visita {
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
  asignacion_refacciones: boolean = false;
  pre_diagnostico: boolean = false;
  si_acepto_tecnico_refaccion: boolean = false;
  entrega_refacciones: boolean = false;
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
