import { Injectable } from '@angular/core';

// Importar objetos de la librería http
//import { Http, Response, RequestOptions, Headers } from '@angular/http';
// Importar la clase Observable desde la librería rxjs
//import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import { Hero } from './models/login';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import { NgxPermissionsService } from 'ngx-permissions';

const httpOptions = {
  //headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DatosService {

  private heroesUrl = 'http://23.253.173.64/api/';  // URL to web api
  //private heroesUrl = 'http://localhost:50570/api/';  // URL to web api
  public imageUrl = 'http://23.253.173.64/';  // URL images

  constructor(private http: HttpClient, private https: Http, private permissionsService: NgxPermissionsService) { }

  login(name, pass): Observable<any> {
    //console.log(name + pass);
    // Los envíos de información deben configurarse a mano
    // esto es fácilmente generalizable y reutilizable
    //let body = JSON.stringify(datoslogin);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    //let options = new RequestOptions({ headers: headers });
    // declarar la llamada y retornar el observable
    // las variables de configuración y los datos, van como parámetros
    return this.http.post(this.heroesUrl + 'Token', {
      "Username": name,
      "Password": pass
    }, { headers: headers });
  }

  cerrarsesiones(id): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.delete(this.heroesUrl + 'Token/' + id, {});
  }

  service_catalogos(url): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.heroesUrl + url, {});
  }

  service_notificacion(parametros) {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.heroesUrl + 'Notificaciones', parametros);
  }

  service_general(url, parametros): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.heroesUrl + url, parametros);
  }

  service_general_get(url, parametros): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.heroesUrl + url, parametros);
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  registro(
    username,
    password,
    name,
    paterno,
    materno,
    email,
    avatar,
    telefono,
    telefono_movil,
    creado,
    //tecnicos
    noalmacen,
    id_tipo_tecnico,
    //Actividad
    id_actividad,
    id_cobertura,
    id_producto
  ): Observable<any> {
    //console.log(name + pass);
    // Los envíos de información deben configurarse a mano
    // esto es fácilmente generalizable y reutilizable
    //let body = JSON.stringify(datoslogin);
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    //let options = new RequestOptions({ headers: headers });
    // declarar la llamada y retornar el observable
    // las variables de configuración y los datos, van como parámetros
    return this.http.post(this.heroesUrl + 'Registro', {
      "username": username,
      "password": password,
      "name": name,
      "paterno": paterno,
      "materno": materno,
      "fecha_nacimiento": "01/01/1900",
      "email": email,
      "avatar": avatar,
      "telefono": telefono,
      "telefono_movil": telefono_movil,
      "estatus": true,
      "creado": creado,
      "creadopor": localStorage.getItem("id"),
      "actualizado": "01/01/1900",
      "actualizadopor": 0,
      "id_rol": 2,
      "id_app": 1,
      "tecnicos": [{
        "noalmacen": noalmacen,
        "id_tipo_tecnico": id_tipo_tecnico,
        "tecnicos_actividad": id_actividad,
        "tecnicos_cobertura": id_cobertura,
        "tecnicos_producto": id_producto,
        "color": this.getRandomColor()
      }]
    });
  }

  perfilme(): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.heroesUrl + 'Registro/' + localStorage.getItem("id"), {});
  }

  recuperarpass(email): Observable<any> {
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.http.get(this.heroesUrl + 'CambiarPassword/' + email, {});
  }

  cambiarpass(id, passold, passnew): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');

    return this.http.put(this.heroesUrl + 'CambiarPassword/' + id, {
      "NewPassword": passnew,
      "OldPassword": passold
    }, { headers: headers });
  }

  getToken() {
    if (localStorage.getItem("token") != "usuarios no existe" && localStorage.getItem("token") != "password incorrecto" && localStorage.getItem("token") != null) {
      return true;
    }
    return false;
  }

  getrol(): void {
    let rol: any[] = [localStorage.getItem("rol")];
    this.permissionsService.loadPermissions([rol.toString().trim()]);
  }

  verificarsesion() {
    //console.log(localStorage.getItem("token"));
    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    return this.https.post(this.heroesUrl + 'token/token', {
      "token": localStorage.getItem("token"),
      "Fecha": ""
    }).subscribe((value) => {
      //console.log(value.json().value.token);
      if (value.json().value.token == "") {
        localStorage.clear();
        window.location.href = "";
      }
    });
  }

  fecha_hoy() {
    return moment().format("MM/DD/YYYY HH:mm:ss");
  }

  fecha_formato(fecha) {
    var _fecha = fecha.split("/");
    console.log(_fecha);
    return _fecha[1] + "/" + _fecha[0] + "/" + _fecha[2];
  }

  upload(fileToUpload: any) {
    let input = new FormData();
    input.append("file", fileToUpload);

    return this.http.post(this.heroesUrl + "Servicios/Upload", input);
  }

  upload_xls(fileToUpload: any) {
    let input = new FormData();
    input.append("file", fileToUpload);

    return this.http.post(this.heroesUrl + "Servicios/Upload_xls", input);
  }

  //Validaciones
  validar_input(input: any) {
    let _input: boolean = true;
    if (input == "" || input == false || input == 0) {
      _input = false;
    }
    return _input;
  }

}

