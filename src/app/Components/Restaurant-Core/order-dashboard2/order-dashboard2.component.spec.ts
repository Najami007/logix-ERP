import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDashboard2Component } from './order-dashboard2.component';

describe('OrderDashboard2Component', () => {
  let component: OrderDashboard2Component;
  let fixture: ComponentFixture<OrderDashboard2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderDashboard2Component]
    });
    fixture = TestBed.createComponent(OrderDashboard2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
