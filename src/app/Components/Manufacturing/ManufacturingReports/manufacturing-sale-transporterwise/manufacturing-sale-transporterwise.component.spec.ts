import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturingSaleTransporterwiseComponent } from './manufacturing-sale-transporterwise.component';

describe('ManufacturingSaleTransporterwiseComponent', () => {
  let component: ManufacturingSaleTransporterwiseComponent;
  let fixture: ComponentFixture<ManufacturingSaleTransporterwiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManufacturingSaleTransporterwiseComponent]
    });
    fixture = TestBed.createComponent(ManufacturingSaleTransporterwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
