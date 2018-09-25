import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarPreciosComponent } from './modificar-precios.component';

describe('ModificarPreciosComponent', () => {
  let component: ModificarPreciosComponent;
  let fixture: ComponentFixture<ModificarPreciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarPreciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarPreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
