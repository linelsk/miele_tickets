import { DatosService } from '../datos.service';
import * as moment from 'moment';

export class tecnico {

  id: any;
  actualizado: any = "01/01/1900";
  actualizadopor: any = 0;
  creado: any = moment().format("MM/DD/YYYY HH:mm:ss");
  creadopor: any = JSON.parse(localStorage.getItem("user")).id;
  id_tipo_tecnico: any;
  noalmacen: any;
  color: any;
  tecnicos_actividad: tecnico_actividad[] = [];
  tecnicos_producto: tecnico_producto[] = [];
}

export class tecnico_actividad {

  id: any;
  id_actividad: any;
  id_user: any;
}

export class tecnico_producto {

  id: any;
  id_categoria_producto: any;
  id_user: any;
}
