import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoTecnicoComponent } from './info-tecnico.component';

describe('InfoTecnicoComponent', () => {
  let component: InfoTecnicoComponent;
  let fixture: ComponentFixture<InfoTecnicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoTecnicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
