import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditarPrecioRefaccionComponent } from './dialog-editar-precio-refaccion.component';

describe('DialogEditarPrecioRefaccionComponent', () => {
  let component: DialogEditarPrecioRefaccionComponent;
  let fixture: ComponentFixture<DialogEditarPrecioRefaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogEditarPrecioRefaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditarPrecioRefaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
