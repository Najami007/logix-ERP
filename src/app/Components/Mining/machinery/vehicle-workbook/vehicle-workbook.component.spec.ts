import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleWorkbookComponent } from './vehicle-workbook.component';

describe('VehicleWorkbookComponent', () => {
  let component: VehicleWorkbookComponent;
  let fixture: ComponentFixture<VehicleWorkbookComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleWorkbookComponent]
    });
    fixture = TestBed.createComponent(VehicleWorkbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
