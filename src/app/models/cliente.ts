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

}

export class Cat_Direccion {
  id_cliente: number;
  calle_numero: string;
  cp: string;
  id_estado: number;
  id_municipio: number;
  colonia: string;
  telefono: string;
  telefono_movil: string;
  estatus: boolean;

}
