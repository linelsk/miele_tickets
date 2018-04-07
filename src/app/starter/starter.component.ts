import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatosService } from '../datos.service';
import 'hammerjs';

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.css']
})
export class StarterComponent implements OnInit, OnDestroy {

  bodyClasses = 'skin-blue sidebar-mini';
  body: HTMLBodyElement = document.getElementsByTagName('body')[0];

  constructor(private heroService: DatosService) { }

  ngOnInit() {
    this.heroService.verificarsesion();

    // add the the body classes
    //console.log(this.body.width());
    this.body.classList.add('skin-blue');
    this.body.classList.add('sidebar-mini');
  }

  ngOnDestroy() {
    // remove the the body classes
    this.body.classList.remove('skin-blue');
    this.body.classList.remove('sidebar-mini');
  }

  //ngDoCheck() {
  //  this.heroService.verificarsesion();
  //}

}
