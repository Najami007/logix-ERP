import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionReceivingComponent } from './production-receiving.component';

describe('ProductionReceivingComponent', () => {
  let component: ProductionReceivingComponent;
  let fixture: ComponentFixture<ProductionReceivingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionReceivingComponent]
    });
    fixture = TestBed.createComponent(ProductionReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
