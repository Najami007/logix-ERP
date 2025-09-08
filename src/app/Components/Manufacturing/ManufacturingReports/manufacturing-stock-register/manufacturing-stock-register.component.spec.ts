import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingStockRegisterComponent } from './manufacturing-stock-register.component';

describe('ManufacturingStockRegisterComponent', () => {
  let component: ManufacturingStockRegisterComponent;
  let fixture: ComponentFixture<ManufacturingStockRegisterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturingStockRegisterComponent]
    });
    fixture = TestBed.createComponent(ManufacturingStockRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
