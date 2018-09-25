import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNuevoGrupoPrecioComponent } from './dialog-nuevo-grupo-precio.component';

describe('DialogNuevoGrupoPrecioComponent', () => {
  let component: DialogNuevoGrupoPrecioComponent;
  let fixture: ComponentFixture<DialogNuevoGrupoPrecioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogNuevoGrupoPrecioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNuevoGrupoPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
