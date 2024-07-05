import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailerSaleReturnComponent } from './retailer-sale-return.component';

describe('RetailerSaleReturnComponent', () => {
  let component: RetailerSaleReturnComponent;
  let fixture: ComponentFixture<RetailerSaleReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RetailerSaleReturnComponent]
    });
    fixture = TestBed.createComponent(RetailerSaleReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
