import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerSaleComponent } from './retailer-sale.component';

describe('RetailerSaleComponent', () => {
  let component: RetailerSaleComponent;
  let fixture: ComponentFixture<RetailerSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetailerSaleComponent]
    });
    fixture = TestBed.createComponent(RetailerSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
