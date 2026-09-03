import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AIStockAnalysisReportComponent } from './aistock-analysis-report.component';

describe('AIStockAnalysisReportComponent', () => {
  let component: AIStockAnalysisReportComponent;
  let fixture: ComponentFixture<AIStockAnalysisReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AIStockAnalysisReportComponent]
    });
    fixture = TestBed.createComponent(AIStockAnalysisReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
