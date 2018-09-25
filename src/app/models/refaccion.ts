import { DatosService } from '../datos.service';
import * as moment from 'moment';

export class Refacciones {
  id: number;
  no_material: string;
  descripcion: string;
  id_grupo_precio: number;
  cantidad: number;
  estatus: boolean = true;
}

export class Refacciones_Tecnico {
  id_material: number;
  id_user: number;
  no_material: string;
  descripcion: any;
  id_grupo_precio: number;
  cantidad: number;
  estatus: boolean = true;
}

export class Cat_Lista_Precios {
  id: number;
  grupo_precio: number;
  precio_sin_iva: string;
  estatus: boolean = true;
}

export class Cat_Materiales {
  id: number;
  descripcion: number;
  id_grupo_precio: number;
  no_material: string;
  cantidad: number;
  estatus: boolean;
}
