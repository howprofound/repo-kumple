import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarAppComponent } from './calendar.component';

describe('CalendarComponent', () => {
  let component: CalendarAppComponent;
  let fixture: ComponentFixture<CalendarAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
