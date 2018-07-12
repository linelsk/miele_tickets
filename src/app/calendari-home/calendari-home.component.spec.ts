import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendariHomeComponent } from './calendari-home.component';

describe('CalendariHomeComponent', () => {
  let component: CalendariHomeComponent;
  let fixture: ComponentFixture<CalendariHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendariHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendariHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
