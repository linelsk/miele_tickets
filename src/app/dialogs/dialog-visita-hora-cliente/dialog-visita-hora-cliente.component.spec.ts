import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogVisitaHoraClienteComponent } from './dialog-visita-hora-cliente.component';

describe('DialogVisitaHoraClienteComponent', () => {
  let component: DialogVisitaHoraClienteComponent;
  let fixture: ComponentFixture<DialogVisitaHoraClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogVisitaHoraClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogVisitaHoraClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
