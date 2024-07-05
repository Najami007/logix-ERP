import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidSaleReturnComponent } from './void-sale-return.component';

describe('VoidSaleReturnComponent', () => {
  let component: VoidSaleReturnComponent;
  let fixture: ComponentFixture<VoidSaleReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoidSaleReturnComponent]
    });
    fixture = TestBed.createComponent(VoidSaleReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
