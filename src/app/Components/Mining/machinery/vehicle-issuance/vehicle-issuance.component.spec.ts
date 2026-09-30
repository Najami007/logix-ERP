import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleIssuanceComponent } from './vehicle-issuance.component';

describe('VehicleIssuanceComponent', () => {
  let component: VehicleIssuanceComponent;
  let fixture: ComponentFixture<VehicleIssuanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleIssuanceComponent]
    });
    fixture = TestBed.createComponent(VehicleIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
