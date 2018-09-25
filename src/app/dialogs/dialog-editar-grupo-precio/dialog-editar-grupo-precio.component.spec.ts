import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditarGrupoPrecioComponent } from './dialog-editar-grupo-precio.component';

describe('DialogEditarGrupoPrecioComponent', () => {
  let component: DialogEditarGrupoPrecioComponent;
  let fixture: ComponentFixture<DialogEditarGrupoPrecioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditarGrupoPrecioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarGrupoPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
