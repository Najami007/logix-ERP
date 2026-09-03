import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReturnComponent } from './production-return.component';

describe('ProductionReturnComponent', () => {
  let component: ProductionReturnComponent;
  let fixture: ComponentFixture<ProductionReturnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionReturnComponent]
    });
    fixture = TestBed.createComponent(ProductionReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
