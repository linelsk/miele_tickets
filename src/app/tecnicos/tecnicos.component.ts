import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { DatosService } from '../datos.service';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs/Observable';
import { map, startWith } from 'rxjs/operators';
import { Productos, Cobertura, Actividad } from '../models/login';

@Component({
  selector: 'app-tecnicos',
  templateUrl: './tecnicos.component.html',
  styleUrls: ['./tecnicos.component.css']
})

export class TecnicosComponent implements OnInit, OnDestroy {
  value_slide: Productos[] = [];
  value_cobertura: Cobertura[] = [];
  value_actividad: Actividad[] = [];
  almacen: string = "";
  name: string = "";
  paterno: string = "";
  materno: string = "";
  previsita: number = 0;
  instalacion: number = 0;
  email: string = "";
  telefono: string = "";
  celular: string = "";
  tipotecnico: string = "";
  cobertura: string = "";
  refri: string = "";
  tipocobertura: string = "";
  password: string;
  token: boolean;
  count_check: number = 0;
  count_check_cobertura: number = 0;
  count_slide: number = 0;
  validar: boolean = false;
  validar_cobertura: boolean = false;
  validar_slide: boolean = false;
  message: string;
  message_slide: string;
  validform: boolean = true;
  validform_responde: boolean = false;
  message_response: string;
  aviso: string;
  public values: string[];
  public tipo: string[];
  public tiposervicio: string[];
  public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  startedClass = false;
  completedClass = false;
  preventAbuse = false;

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;

  separatorKeysCodes = [ENTER, COMMA];

  fruitCtrl = new FormControl();

  filteredFruits: Observable<any>;

  fruits = [
    { id: "1", name: "CDMX" }
  ];

  allFruits = [
    { id: "1", name: "CDMX" }, { id: "2", name: "Estado de México" }, { id: "3", name: "Aguascalientes" }
  ];

  @ViewChild('fruitInput') fruitInput: ElementRef;

  constructor(private heroService: DatosService) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => fruit ? this.filter(fruit) : this.allFruits.slice()));
  }

  add(event: MatChipInputEvent): void {
    console.log(event);
    const input = event.input;
    const value = event.value;
    
    // Add our fruit
    //if ((value || '').trim()) {
    //  this.fruits.push(value.trim());
    //}

    //// Reset the input value
    //if (input) {
    //  input.value = '';
    //}

    //this.fruitCtrl.setValue(null);
  }

  remove(fruit: any): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }

  filter(obj: any) {
    var _obj: any = JSON.parse(obj);
    console.log(_obj);
    //return this.allFruits.filter(fruit =>
    //  fruit.name.toLowerCase().indexOf(_obj.name.toLowerCase()) === 0);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    console.log(event);
    this.fruits.push(event.option.value);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
  }

  autocompleteItems = [{ id: "1", name: "CDMX" }, { id: "2", name: "Estado de México" }, { id: "3", name: "Aguascalientes" }];

  ngOnInit() {
    this.heroService.verificarsesion();
    // add the the body classes
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');

    this.getproducto();
    this.gettipotecnico();
    this.gettiposervicio();
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  public onTextChange(text) {
    console.log('text changed: value is ' + text);
  }

  onAdd(item): void {
    console.log('tag added: value is ' + item);
  }

  public onAdding(tag): Observable<any> {

    return Observable
      .of(tag);
  }

  public onRemoving(tag): Observable<any> {
    return Observable
      .of(tag);
  }

  getproducto(): void {
    this.heroService.service_catalogos("Catalogos/CategoriaProducto")
      .subscribe((value) => {
        //console.log(value);
        this.values = value;
      });
  }

  gettipotecnico(): void {
    this.heroService.service_catalogos("Catalogos/Tipo")
      .subscribe((value) => {
        //console.log(value.json());
        this.tipo = value;
      });
  }

  gettiposervicio(): void {
    this.heroService.service_catalogos("Catalogos/TipoServicio")
      .subscribe((value) => {
        console.log(value);
        //console.log(value.json());
        this.tiposervicio = value;
      });
  }

  registro(obj): void {
    var hoy: any = new Date();
    var dd: any = hoy.getDate();
    var mm: any = hoy.getMonth() + 1; //hoy es 0!
    var yyyy: any = hoy.getFullYear();

    if (dd < 10) {
      dd = '0' + dd
    }

    if (mm < 10) {
      mm = '0' + mm
    }

    function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
    this.heroService.registro(
      this.name,
      "$miele" + guid().substring(0, 4),
      this.name,
      this.paterno,
      this.materno,
      this.email,
      "",
      this.telefono,
      this.celular,
      mm + '/' + dd + '/' + yyyy,
      this.almacen,
      1,
      this.value_actividad,
      [],
      this.value_slide
    )
      .subscribe((value) => {
        setTimeout(() => {
          this.preventAbuse = false;
        }, 800);
        console.log(value);
        this.message_response = value.response;
        if (value.response == "El email ingresado ya existe.") {
          this.aviso = "alert-danger-aviso-rojo";
          this.validform_responde = true;
        }
        else {
          this.aviso = "alert-danger-aviso";
          this.validform_responde = true;
        }
        
      });

  }

  validacion_form(obj) {

    if (this.count_slide != 0 && this.almacen != "" && this.name != "" && this.paterno != "" && this.email != "" && this.celular != "") {
      this.validform = false;
    }
    else {
      this.validform = true;
    }
  }

  check(obj, id) {
    if (obj.checked == true) {
      this.value_actividad.push({
        id_actividad: id
      });
      this.count_check++;
    }
    else {
      for (var i = 0; i < this.value_actividad.length; i++) {
        if (this.value_actividad[i].id_actividad == id) {
          this.value_actividad.splice(i, 1);
        }
      }
      this.count_check--;
    }

    if (this.count_check == 0) {
      this.validar = true;
    }
    else {
      this.validar = false;
    }

    if (this.count_check != 0 && this.count_check_cobertura != 0 && this.almacen != "" && this.name != "" && this.paterno != "" && this.email != "" && this.celular != "" && this.tipotecnico != "") {
      this.validform = false;
    }
    else {
      this.validform = true;
      this.message = "Actividad requerida";
    }
    console.log(this.value_actividad);
  }

  check_cobertura(obj, id) {

    if (obj.checked == true) {
      this.value_cobertura.push({
        id_cobertura: id
      });
      this.count_check_cobertura++;
    }
    else {
      for (var i = 0; i < this.value_cobertura.length; i++) {
        if (this.value_cobertura[i].id_cobertura == id) {
          this.value_cobertura.splice(i, 1);
        }
      }
      this.count_check_cobertura--;
    }

    if (this.count_check_cobertura == 0) {
      this.validar_cobertura = true;
    }
    else {
      this.validar_cobertura = false;
    }

    if (this.count_slide != 0 && this.count_check != 0 && this.almacen != "" && this.name != "" && this.paterno != "" && this.email != "" && this.celular != "") {
      this.validform = false;
    }
    else {
      this.validform = true;
      this.message = "Actividad requerida";
    }
  }

  slide(obj, id, desc) {
    console.log(obj + ' ' + desc);
    if (obj.checked == true) {
      this.value_slide.push({
        id_categoria_producto: id
      });
      this.count_slide++;
    }
    else {
      for (var i = 0; i < this.value_slide.length; i++) {
        if (this.value_slide[i].id_categoria_producto == id) {
          this.value_slide.splice(i, 1);
        }
      }
      this.count_slide--;
    }

    if (this.count_slide == 0) {
      this.validar_slide = true;
    }
    else {
      this.validar_slide = false;
    }

    if (this.count_slide != 0 && this.count_check != 0 && this.almacen != "" && this.name != "" && this.paterno != "" && this.email != "" && this.celular != "") {
      this.validform = false;
    }
    else {
      this.validform = true;
      this.message_slide = "Campo requerido";

    }
    console.log(this.value_slide);
  }
}

