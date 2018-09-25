import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DatosService } from '../../datos.service';
import { Router } from '@angular/router';
import { Refacciones, Refacciones_Tecnico, Cat_Lista_Precios } from '../../models/refaccion';

@Component({
  selector: 'app-dialog-nuevo-grupo-precio',
  templateUrl: './dialog-nuevo-grupo-precio.component.html',
  styleUrls: ['./dialog-nuevo-grupo-precio.component.css']
})
export class DialogNuevoGrupoPrecioComponent implements OnInit {

  public Cat_Lista_Precios = new Cat_Lista_Precios();

  constructor(
    public dialogRef: MatDialogRef<DialogNuevoGrupoPrecioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private heroService: DatosService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  guardar_grupo() {
    this.heroService.service_general("Refacciones/Guardar_Lista_Precios", this.Cat_Lista_Precios)
      .subscribe((value) => {
        console.log(value);
        if (value.response == "OK") {
          this.dialogRef.close();
        }
      });
  }
}
