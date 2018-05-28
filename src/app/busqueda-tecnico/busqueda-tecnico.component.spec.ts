import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaTecnicoComponent } from './busqueda-tecnico.component';

describe('BusquedaTecnicoComponent', () => {
  let component: BusquedaTecnicoComponent;
  let fixture: ComponentFixture<BusquedaTecnicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusquedaTecnicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
