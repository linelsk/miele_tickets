import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DatosService } from '../../datos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dialog-troubleshooting',
  templateUrl: './dialog-troubleshooting.component.html',
  styleUrls: ['./dialog-troubleshooting.component.css']
})
export class DialogTroubleshootingComponent implements OnInit {

  acordion: any[] = [];
  estatus_trouble_shooting: any[] = [];
  id: number;
  observaciones_troubleshooting: string = "";
  estatustroubleshooting: number = 0;

  constructor(
    public dialogRef: MatDialogRef<DialogTroubleshootingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private heroService: DatosService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    console.log(this.data);
    this.heroService.service_general("Servicios/Troubleshooting_Producto", {
      "id": this.data.obj.id
    }).subscribe((value) => {
      console.log(value);
      this.acordion = value;
    });

    this.heroService.service_catalogos("Catalogos/Estatus_Troubleshooting")
      .subscribe((value) => {
        console.log(value);
        this.estatus_trouble_shooting = value;
    });

  }

  tecnicos_visita: any[] = [];
  guardar_troubleshooting() {

    this.tecnicos_visita.push({
      id_direccion: 0,
      fecha_visita: "01/01/1900",
      id_tecnico: 0,
      hora: 0,
      actividades_realizar: "",
      concepto: "",
      cantidad: "",
      pagado: false,
      pago_pendiente: false,
      garantia: false,
      fecha_deposito: "01/01/1900",
      no_operacion: "1",
      comprobante: "",
      terminos_condiciones: true,
      factura: false,
      servicio_producto: [],
      hora_fin: 0
    });

    this.heroService.service_general("servicios", {
      "id_cliente": this.data.id_cliente,
      "id_tipo_servicio": 6,
      "actualizado": "01/01/1900",
      "actualizadopor": 0,
      "creado": this.heroService.fecha_hoy(),
      "creadopor": JSON.parse(localStorage.getItem("user")).id,
      "id_solicitado_por": 1,
      "id_distribuidor_autorizado": 0,
      "contacto": "",
      "activar_credito": false,
      "id_solicitud_via": 1,
      "descripcion_actividades": this.observaciones_troubleshooting,
      "id_categoria_servicio": 0,
      "no_servicio": "",
      "fecha_servicio": "01/01/1900",
      "id_estatus_servicio": 1,
      "IBS": "",
      "id_motivo_cierre": 0,
      "fecha_inicio_servicio": "01/01/1900",
      "visita": [],
      "servicio_troubleshooting": [{
        "id_estatus_troubleshooting": this.estatustroubleshooting,
        "observciones": this.observaciones_troubleshooting,
        "estatus": 1
      }]
    }).subscribe((value) => {
      console.log(value);
      this.heroService.service_general("servicios/Actualizar_Folio", {
        "id": value.value.response
      }).subscribe((value) => {
        this.snackBar.open("Registro guardado correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      });
    });
  }

}
