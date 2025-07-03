import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderReportComponent } from './reorder-report.component';

describe('ReorderReportComponent', () => {
  let component: ReorderReportComponent;
  let fixture: ComponentFixture<ReorderReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReorderReportComponent]
    });
    fixture = TestBed.createComponent(ReorderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
