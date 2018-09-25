import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../datos.service';

@Component({
  selector: 'app-starter-left-side',
  templateUrl: './starter-left-side.component.html',
  styleUrls: ['./starter-left-side.component.css']
})
export class StarterLeftSideComponent implements OnInit {

  constructor(private heroService: DatosService) { }

  ngOnInit() {
    
  }

}
