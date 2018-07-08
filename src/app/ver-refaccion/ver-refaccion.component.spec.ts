import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRefaccionComponent } from './ver-refaccion.component';

describe('VerRefaccionComponent', () => {
  let component: VerRefaccionComponent;
  let fixture: ComponentFixture<VerRefaccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerRefaccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerRefaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
