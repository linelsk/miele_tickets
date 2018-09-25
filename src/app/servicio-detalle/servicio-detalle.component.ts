import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import persons from '../models/mock-login';
import 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { Clientes, direccion, datosfiscales } from '../models/cliente';
import { DialogTroubleshootingComponent } from '../dialogs/dialog-troubleshooting/dialog-troubleshooting.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servicio-detalle',
  templateUrl: './servicio-detalle.component.html',
  styleUrls: ['./servicio-detalle.component.css']
})
export class ServicioDetalleComponent implements OnInit {

  public mask_telefono = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public cliente = new Clientes();
  public direccion = new direccion();
  public datosfiscales = new datosfiscales();

  preventAbuse = false;
  id: number;
  public sub: any;
  public detalle: string[] = [];
  public detalle_direccion: any[] = [];
  localidades: string[] = [];
  estados: string[] = [];
  municipios: string[] = [];
  ir_servicio: boolean = true;

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(private heroService: DatosService, private route: ActivatedRoute, public dialog: MatDialog, private router: Router, public snackBar: MatSnackBar) {
  }

  displayedColumns = ['#Servicio', 'Modelo', 'SKU', 'Garantia', 'Poliza', 'Estatus', 'Imagen'];
  dataSource = new MatTableDataSource();

  ngOnInit() {
    this.heroService.verificarsesion();

    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
    //this.getestados();
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      console.log(this.id);
      // In a real app: dispatch action to load the details here.
    });

    this.heroService.service_general_get("Clientes/" + this.id, {}).subscribe((value) => {
      this.cliente = value[0];
      console.log(value[0].datos_fiscales[0]);

      if (value[0].datos_fiscales[0] != undefined) {
        this.datosfiscales = value[0].datos_fiscales[0]
      }
      else {
        this.datosfiscales = {
          id_cliente: 0,
          calle_numero: "",
          colonia: "",
          cp: "",
          email: "",
          id_estado: 0,
          estado: "",
          id_municipio: 0,
          municipio: "",
          razon_social: "",
          rfc: "",
          Ext_fact: "",
          Int_fact: "",
          nombre_fact: "",
          telefono_fact: ""
        }
      }

      if (value[0].direcciones != "") {
        this.direccion = value[0].direcciones[0];
        this.direccion.id_cliente = this.id;
        //console.log(this.direccion.id_localidad);
        //this.getmunicipios();
        this.sepomex();
      }
      else {
        this.detalle_direccion = [{
          calle_numero: "",
          estado: "",
          colonia: "",
          cp: "",
          municipio: "",

        }]
      }

    });
    
    this.heroService.service_general("Servicios/Productos_Servicio_Detalle", {
      "id_cliente": this.id
    }).subscribe((value) => {
      if (value != "") {
        for (var i = 0; i < value.length; i++) {
          if (value[i].estatus != 'Pending by Miele') {
            this.ir_servicio = true;
            break;
          }
          else {
            this.ir_servicio = false;
          }
        }
        console.log(value);
        this.dataSource.data = value;
      }
      else {
        this.dataSource.data = [];
      }
    });
  }

  validar_servicio() {
    this.snackBar.open("No se puede agendar servicios para este cliente", "", {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      extraClasses: ['blue-snackbar']
    });
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

  editar_direccion(obj) {
    this.heroService.service_general("Servicios/Editar_Direccion", this.direccion)
      .subscribe((value) => {
        //console.log(value);
        if (value.response == "OK") {
          this.snackBar.open("Dirección editada correctamente", "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
        }
        else {
          this.snackBar.open(value.response, "", {
            duration: 5000,
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
            extraClasses: ['blue-snackbar']
          });
        }
      });
  }

  troubleshooting(obj) {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    let dialogRef = this.dialog.open(DialogTroubleshootingComponent, {
      width: '800px',
      disableClose: true,
      data: { obj, id_cliente: this.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      //this.router.navigate(['/buscacarservicio/']);
    });
  }

  sepomex() {
    //console.log(this.direccion.cp.length);
    if (this.direccion.cp.length == 5) {
      this.heroService.service_general("Servicios/Sepomex", { id: this.direccion.cp })
        .subscribe((value) => {
          console.log(this.direccion);
          this.getestados();
          this.direccion.id_estado = value[0].id_estado;
          this.getmunicipios();
          this.direccion.id_municipio = value[0].id_municipio;
          this.localidades = value[0].localidades;
          this.direccion.colonia = this.direccion.id_localidad;
        });
    }
  }

  mostrar_no_cliente: boolean = true;
  editar_no_cliente(obj) {
    console.log(obj);
    this.mostrar_no_cliente = false;
  }

  editar_cliente(){
    this.mostrar_no_cliente = true;
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.heroService.service_general("Clientes/Editar_numero_cliente", this.cliente)
      .subscribe((value) => {
        this.snackBar.open("Número de cliente editado correctamente", "", {
          duration: 5000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
          extraClasses: ['blue-snackbar']
        });
      });
  }
}
