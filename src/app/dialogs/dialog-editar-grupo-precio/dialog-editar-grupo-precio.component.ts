import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DatosService } from '../../datos.service';
import { Router } from '@angular/router';
import { Refacciones, Refacciones_Tecnico, Cat_Lista_Precios } from '../../models/refaccion';

@Component({
  selector: 'app-dialog-editar-grupo-precio',
  templateUrl: './dialog-editar-grupo-precio.component.html',
  styleUrls: ['./dialog-editar-grupo-precio.component.css']
})
export class DialogEditarGrupoPrecioComponent implements OnInit {

  public Cat_Lista_Precios = new Cat_Lista_Precios();
  public lista_precios: any;

  constructor(
    public dialogRef: MatDialogRef<DialogEditarGrupoPrecioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private heroService: DatosService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    console.log(this.data.id);
    this.heroService.service_general("Catalogos/ListaPrecios", {})
      .subscribe((value) => {
        console.log(value);
        this.lista_precios = value;
        this.Cat_Lista_Precios.grupo_precio = this.data.id;
      });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  editar_grupo() {
    this.heroService.service_general("Refacciones/Guardar_Lista_Precios", this.Cat_Lista_Precios)
      .subscribe((value) => {
        console.log(value);
        if (value.response == "OK") {
          this.dialogRef.close();
        }
      });
  }
}
