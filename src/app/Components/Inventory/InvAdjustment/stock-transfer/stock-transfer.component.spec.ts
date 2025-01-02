import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransferComponent } from './stock-transfer.component';

describe('StockTransferComponent', () => {
  let component: StockTransferComponent;
  let fixture: ComponentFixture<StockTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockTransferComponent]
    });
    fixture = TestBed.createComponent(StockTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
