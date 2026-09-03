import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTransporterProfileComponent } from './add-transporter-profile.component';

describe('AddTransporterProfileComponent', () => {
  let component: AddTransporterProfileComponent;
  let fixture: ComponentFixture<AddTransporterProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTransporterProfileComponent]
    });
    fixture = TestBed.createComponent(AddTransporterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
