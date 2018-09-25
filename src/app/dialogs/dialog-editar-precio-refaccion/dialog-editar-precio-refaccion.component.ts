import { Component, OnInit, OnDestroy, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { DatosService } from '../../datos.service';
import { Router } from '@angular/router';
import { Refacciones, Refacciones_Tecnico, Cat_Materiales } from '../../models/refaccion';

@Component({
  selector: 'app-dialog-editar-precio-refaccion',
  templateUrl: './dialog-editar-precio-refaccion.component.html',
  styleUrls: ['./dialog-editar-precio-refaccion.component.css']
})
export class DialogEditarPrecioRefaccionComponent implements OnInit {

  public Cat_Lista_Precios = new Cat_Materiales();
  public lista_precios: any;
  public precio: any;
  public id_grupo: any;

  constructor(
    public dialogRef: MatDialogRef<DialogEditarPrecioRefaccionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private heroService: DatosService, public snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    console.log(this.data.obj.id);
    this.heroService.service_general("Catalogos/ListaPrecios", {})
      .subscribe((value) => {
        console.log(value);
        this.lista_precios = value;
        this.Cat_Lista_Precios.id_grupo_precio = this.data.obj.grupo_precio;
        this.precio = this.data.obj.precio_sin_iva;
      });
  }


  onNoClick(): void {
    this.dialogRef.close();
  }

  editar_grupo() {
    this.Cat_Lista_Precios.id = this.data.obj.id;
    console.log(this.Cat_Lista_Precios);
    this.heroService.service_general("Refacciones/Guardar_Lista_Precios_Refaccion", {
      id: this.data.obj.id,
      id_grupo_precio: this.id_grupo
    })
      .subscribe((value) => {
        console.log(value);
        if (value.response == "OK") {
          this.dialogRef.close();
        }
      });
  }

  ver_precio(obj) {
    console.log(obj);
    this.id_grupo = obj.id;
    this.precio = obj.precio_sin_iva;
  }
}
