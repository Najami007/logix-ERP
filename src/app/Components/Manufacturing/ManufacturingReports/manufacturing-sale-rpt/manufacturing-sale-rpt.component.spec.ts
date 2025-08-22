import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingSaleRptComponent } from './manufacturing-sale-rpt.component';

describe('ManufacturingSaleRptComponent', () => {
  let component: ManufacturingSaleRptComponent;
  let fixture: ComponentFixture<ManufacturingSaleRptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturingSaleRptComponent]
    });
    fixture = TestBed.createComponent(ManufacturingSaleRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
