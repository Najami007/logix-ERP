import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastFoodSaleComponent } from './fast-food-sale.component';

describe('FastFoodSaleComponent', () => {
  let component: FastFoodSaleComponent;
  let fixture: ComponentFixture<FastFoodSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FastFoodSaleComponent]
    });
    fixture = TestBed.createComponent(FastFoodSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
