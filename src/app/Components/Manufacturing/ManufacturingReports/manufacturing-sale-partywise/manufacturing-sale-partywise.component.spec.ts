import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingSalePartywiseComponent } from './manufacturing-sale-partywise.component';

describe('ManufacturingSalePartywiseComponent', () => {
  let component: ManufacturingSalePartywiseComponent;
  let fixture: ComponentFixture<ManufacturingSalePartywiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturingSalePartywiseComponent]
    });
    fixture = TestBed.createComponent(ManufacturingSalePartywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
