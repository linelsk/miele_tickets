import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../datos.service';

@Component({
  selector: 'app-starter-header',
  templateUrl: './starter-header.component.html',
  styleUrls: ['./starter-header.component.css']
})
export class StarterHeaderComponent implements OnInit {

  name: string;
  inicial: string;

  constructor(private heroService: DatosService) { }

  ngOnInit() {
    this.name = localStorage.getItem("nombre") + " " + localStorage.getItem("paterno");
    this.inicial = localStorage.getItem("inicial");
  }

  //ngDoCheck() {
  //  this.heroService.verificarsesion();
  //}

  salir(obj): void {

    localStorage.clear();
    window.location.href = "";

  }
}
