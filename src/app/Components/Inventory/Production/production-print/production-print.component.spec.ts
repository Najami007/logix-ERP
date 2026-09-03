import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionPrintComponent } from './production-print.component';

describe('ProductionPrintComponent', () => {
  let component: ProductionPrintComponent;
  let fixture: ComponentFixture<ProductionPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionPrintComponent]
    });
    fixture = TestBed.createComponent(ProductionPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
