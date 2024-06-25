import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvAuditComponent } from './inv-audit.component';

describe('InvAuditComponent', () => {
  let component: InvAuditComponent;
  let fixture: ComponentFixture<InvAuditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InvAuditComponent]
    });
    fixture = TestBed.createComponent(InvAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
