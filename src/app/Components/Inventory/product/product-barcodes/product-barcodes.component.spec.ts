import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBarcodesComponent } from './product-barcodes.component';

describe('ProductBarcodesComponent', () => {
  let component: ProductBarcodesComponent;
  let fixture: ComponentFixture<ProductBarcodesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductBarcodesComponent]
    });
    fixture = TestBed.createComponent(ProductBarcodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
