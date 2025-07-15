import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductInOutHistoryComponent } from './product-in-out-history.component';

describe('ProductInOutHistoryComponent', () => {
  let component: ProductInOutHistoryComponent;
  let fixture: ComponentFixture<ProductInOutHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductInOutHistoryComponent]
    });
    fixture = TestBed.createComponent(ProductInOutHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
