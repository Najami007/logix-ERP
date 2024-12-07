import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReturnMobComponent } from './purchase-return-mob.component';

describe('PurchaseReturnMobComponent', () => {
  let component: PurchaseReturnMobComponent;
  let fixture: ComponentFixture<PurchaseReturnMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseReturnMobComponent]
    });
    fixture = TestBed.createComponent(PurchaseReturnMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
