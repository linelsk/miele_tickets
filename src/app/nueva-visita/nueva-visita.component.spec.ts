import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaVisitaComponent } from './nueva-visita.component';

describe('NuevaVisitaComponent', () => {
  let component: NuevaVisitaComponent;
  let fixture: ComponentFixture<NuevaVisitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaVisitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
