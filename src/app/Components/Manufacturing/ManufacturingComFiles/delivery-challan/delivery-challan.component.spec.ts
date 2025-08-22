import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryChallanComponent } from './delivery-challan.component';

describe('DeliveryChallanComponent', () => {
  let component: DeliveryChallanComponent;
  let fixture: ComponentFixture<DeliveryChallanComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryChallanComponent]
    });
    fixture = TestBed.createComponent(DeliveryChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
