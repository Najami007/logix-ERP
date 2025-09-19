import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReportDatewieseComponent } from './order-report-datewiese.component';

describe('OrderReportDatewieseComponent', () => {
  let component: OrderReportDatewieseComponent;
  let fixture: ComponentFixture<OrderReportDatewieseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderReportDatewieseComponent]
    });
    fixture = TestBed.createComponent(OrderReportDatewieseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
