import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from '../datos.service';
import { HttpClient } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { MatPaginator, MatTableDataSource, MatPaginatorIntl, MatSnackBar } from '@angular/material';
import { Refacciones } from '../models/refaccion';

@Component({
  selector: 'app-nuevo-refaccion',
  templateUrl: './nuevo-refaccion.component.html',
  styleUrls: ['./nuevo-refaccion.component.css']
})
export class NuevoRefaccionComponent implements OnInit {
  public refaccion = new Refacciones();

  displayedColumns_buscar = ['no', 'nombre', 'cantidad'];
  displayedColumns = ['no', 'nombre', 'cantidad'];
  dataSource = new MatTableDataSource();
  dataSource_excel = new MatTableDataSource();
  excel_visible: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];
  listaprecios: any[] = [];
  preventAbuse = false;
  text_busqueda: any = "";

  constructor(private heroService: DatosService, public snackBar: MatSnackBar) { }

  @ViewChild("fileInput") fileInput;
  fileToUpload: any[] = [];
  response; string;

  handleFileInput(event) {
    let fi = this.fileInput.nativeElement;
    if (fi.files && fi.files[0]) {

      //(fi.files[0]);
      this.heroService.upload_xls(fi.files[0]).subscribe((value) => {
        //console.log(value.response);
        this.response = value;
        //console.log(this.response.response);
        this.heroService.service_general("Servicios/Excel_Producto", {
          "sku": this.response.response
        }).subscribe((result) => {
          console.log(result);
          if (result != "") {
            this.excel_visible = true;
            this.dataSource_excel.data = result;
            this.refaccion = result;
          }
        });
      });
    }
  }

  Guardar_Refacciones() {
    //console.log(this.refaccion[1].no_material);
    for (var i = 0; i < this.dataSource_excel.data.length; i++) {
      this.heroService.service_general("Refacciones/Guardar_refaccion_Excel", {
        no_material: this.refaccion[i].no_material,
        descripcion: this.refaccion[i].descripcion,
        id_grupo_precio: this.refaccion[i].id_grupo_precio,
        cantidad: this.refaccion[i].cantidad,
        estatus: 1,
      }).subscribe((result) => {
        //console.log(result);
        if (result.response == "OK-ADD" || result.response == "OK-UPDATE") {
          this.excel_visible = false;
          this.buscar();
          this.snackBar.open("Refacciones agregadas correctamente", "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
        }
      });
    }
  }

  buscar() {
    this.preventAbuse = true;
    this.heroService.service_general("Refacciones/Busqueda_refaccion", {
      "texto": this.text_busqueda
    }).subscribe((value) => {
      setTimeout(() => {
        console.log(value);
        if (value.item == "No hay resultado para la busqueda") {

          this.dataSource.data = [];
        }
        else {
          this.dataSource.data = value;
        }
        this.preventAbuse = false;
      }, 400);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
    this.getlistaprecios();
    this.buscar();
    //this.heroService.service_general("Refacciones/No_material", {}).subscribe((value) => {
    //  console.log(value);
    //  this.refaccion.no_material = (parseInt(value[0].no_material) + 1).toString();
    //});
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  //Catalogos
  getlistaprecios(): void {
    this.heroService.service_general("Catalogos/ListaPrecios", {})
      .subscribe((value) => {
        this.listaprecios = value;
      });
  }

  guardar_refaccion() {
    this.heroService.service_general("Refacciones/Guardar_refaccion", this.refaccion).subscribe((value) => {
      if (value.response == "OK") {
        this.buscar();
        this.snackBar.open("Refacción agregada correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      }
    });
  }

  validar_refaccion() {
    //console.log(this.refaccion.no_material.toString());
    this.heroService.service_general("Refacciones/no_material_validar", {
      no_material: this.refaccion.no_material.toString()
    })
      .subscribe((value) => {
        console.log(value);
        this.refaccion = value[0];
      });
  }
}
