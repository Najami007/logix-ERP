import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReportRiderwiseComponent } from './order-report-riderwise.component';

describe('OrderReportRiderwiseComponent', () => {
  let component: OrderReportRiderwiseComponent;
  let fixture: ComponentFixture<OrderReportRiderwiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderReportRiderwiseComponent]
    });
    fixture = TestBed.createComponent(OrderReportRiderwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
