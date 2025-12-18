import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAudit2Component } from './inventory-audit2.component';

describe('InventoryAudit2Component', () => {
  let component: InventoryAudit2Component;
  let fixture: ComponentFixture<InventoryAudit2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InventoryAudit2Component]
    });
    fixture = TestBed.createComponent(InventoryAudit2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
