import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidSaleComponent } from './void-sale.component';

describe('VoidSaleComponent', () => {
  let component: VoidSaleComponent;
  let fixture: ComponentFixture<VoidSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoidSaleComponent]
    });
    fixture = TestBed.createComponent(VoidSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
