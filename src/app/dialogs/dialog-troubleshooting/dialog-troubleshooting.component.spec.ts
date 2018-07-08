import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogTroubleshootingComponent } from './dialog-troubleshooting.component';

describe('DialogTroubleshootingComponent', () => {
  let component: DialogTroubleshootingComponent;
  let fixture: ComponentFixture<DialogTroubleshootingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogTroubleshootingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogTroubleshootingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
