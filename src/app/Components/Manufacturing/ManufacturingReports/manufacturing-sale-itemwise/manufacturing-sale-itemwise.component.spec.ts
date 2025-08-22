import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingSaleItemwiseComponent } from './manufacturing-sale-itemwise.component';

describe('ManufacturingSaleItemwiseComponent', () => {
  let component: ManufacturingSaleItemwiseComponent;
  let fixture: ComponentFixture<ManufacturingSaleItemwiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturingSaleItemwiseComponent]
    });
    fixture = TestBed.createComponent(ManufacturingSaleItemwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
