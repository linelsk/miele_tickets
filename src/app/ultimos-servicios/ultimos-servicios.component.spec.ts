import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimosServiciosComponent } from './ultimos-servicios.component';

describe('UltimosServiciosComponent', () => {
  let component: UltimosServiciosComponent;
  let fixture: ComponentFixture<UltimosServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UltimosServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UltimosServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
