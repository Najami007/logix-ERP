import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductEditBulkComponent } from './product-edit-bulk.component';

describe('ProductEditBulkComponent', () => {
  let component: ProductEditBulkComponent;
  let fixture: ComponentFixture<ProductEditBulkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductEditBulkComponent]
    });
    fixture = TestBed.createComponent(ProductEditBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
