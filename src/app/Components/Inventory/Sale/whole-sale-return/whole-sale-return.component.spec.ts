import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholeSaleReturnComponent } from './whole-sale-return.component';

describe('WholeSaleReturnComponent', () => {
  let component: WholeSaleReturnComponent;
  let fixture: ComponentFixture<WholeSaleReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WholeSaleReturnComponent]
    });
    fixture = TestBed.createComponent(WholeSaleReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
