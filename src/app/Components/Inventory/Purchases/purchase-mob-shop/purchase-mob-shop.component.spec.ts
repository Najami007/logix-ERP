import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseMobShopComponent } from './purchase-mob-shop.component';

describe('PurchaseMobShopComponent', () => {
  let component: PurchaseMobShopComponent;
  let fixture: ComponentFixture<PurchaseMobShopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseMobShopComponent]
    });
    fixture = TestBed.createComponent(PurchaseMobShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
