import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolucionInventarioComponent } from './devolucion-inventario.component';

describe('DevolucionInventarioComponent', () => {
  let component: DevolucionInventarioComponent;
  let fixture: ComponentFixture<DevolucionInventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevolucionInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolucionInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
