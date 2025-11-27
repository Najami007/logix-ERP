import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleSummaryCategorywiseComponent } from './sale-summary-categorywise.component';

describe('SaleSummaryCategorywiseComponent', () => {
  let component: SaleSummaryCategorywiseComponent;
  let fixture: ComponentFixture<SaleSummaryCategorywiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleSummaryCategorywiseComponent]
    });
    fixture = TestBed.createComponent(SaleSummaryCategorywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
