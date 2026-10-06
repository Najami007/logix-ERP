import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkBookReportComponent } from './work-book-report.component';

describe('WorkBookReportComponent', () => {
  let component: WorkBookReportComponent;
  let fixture: ComponentFixture<WorkBookReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkBookReportComponent]
    });
    fixture = TestBed.createComponent(WorkBookReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
