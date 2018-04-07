import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioDetalleComponent } from './servicio-detalle.component';

describe('ServicioDetalleComponent', () => {
  let component: ServicioDetalleComponent;
  let fixture: ComponentFixture<ServicioDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServicioDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicioDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
