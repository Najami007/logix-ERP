import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionItemReceivingComponent } from './production-item-receiving.component';

describe('ProductionItemReceivingComponent', () => {
  let component: ProductionItemReceivingComponent;
  let fixture: ComponentFixture<ProductionItemReceivingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionItemReceivingComponent]
    });
    fixture = TestBed.createComponent(ProductionItemReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
