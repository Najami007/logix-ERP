import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarbleSaleReturnComponent } from './marble-sale-return.component';

describe('MarbleSaleReturnComponent', () => {
  let component: MarbleSaleReturnComponent;
  let fixture: ComponentFixture<MarbleSaleReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarbleSaleReturnComponent]
    });
    fixture = TestBed.createComponent(MarbleSaleReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
