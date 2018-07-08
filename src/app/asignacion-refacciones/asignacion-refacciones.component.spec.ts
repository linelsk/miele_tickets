import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionRefaccionesComponent } from './asignacion-refacciones.component';

describe('AsignacionRefaccionesComponent', () => {
  let component: AsignacionRefaccionesComponent;
  let fixture: ComponentFixture<AsignacionRefaccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionRefaccionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionRefaccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
