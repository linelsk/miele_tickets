import { Component, OnInit } from '@angular/core';
import { DatosService } from './datos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
  token : boolean;

  constructor(private heroService: DatosService) { }

  ngOnInit() {
    this.token = this.heroService.getToken();
    this.heroService.getrol();    
  }

  //ngDoCheck() {
  //  this.heroService.verificarsesion();
  //}
}
