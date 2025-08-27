import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionAuditComponent } from './production-audit.component';

describe('ProductionAuditComponent', () => {
  let component: ProductionAuditComponent;
  let fixture: ComponentFixture<ProductionAuditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionAuditComponent]
    });
    fixture = TestBed.createComponent(ProductionAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
