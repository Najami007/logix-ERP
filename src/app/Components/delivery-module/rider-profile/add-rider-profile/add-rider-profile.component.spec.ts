import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRiderProfileComponent } from './add-rider-profile.component';

describe('AddRiderProfileComponent', () => {
  let component: AddRiderProfileComponent;
  let fixture: ComponentFixture<AddRiderProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddRiderProfileComponent]
    });
    fixture = TestBed.createComponent(AddRiderProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
