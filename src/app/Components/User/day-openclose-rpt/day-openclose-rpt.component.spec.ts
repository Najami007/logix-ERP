import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayOpencloseRptComponent } from './day-openclose-rpt.component';

describe('DayOpencloseRptComponent', () => {
  let component: DayOpencloseRptComponent;
  let fixture: ComponentFixture<DayOpencloseRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayOpencloseRptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayOpencloseRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
