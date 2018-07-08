import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoRefaccionComponent } from './nuevo-refaccion.component';

describe('NuevoRefaccionComponent', () => {
  let component: NuevoRefaccionComponent;
  let fixture: ComponentFixture<NuevoRefaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoRefaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoRefaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
