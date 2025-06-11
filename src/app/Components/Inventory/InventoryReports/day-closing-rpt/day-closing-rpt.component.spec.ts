import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayClosingRptComponent } from './day-closing-rpt.component';

describe('DayClosingRptComponent', () => {
  let component: DayClosingRptComponent;
  let fixture: ComponentFixture<DayClosingRptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DayClosingRptComponent]
    });
    fixture = TestBed.createComponent(DayClosingRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
