import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiscProfileComponent } from './add-disc-profile.component';

describe('AddDiscProfileComponent', () => {
  let component: AddDiscProfileComponent;
  let fixture: ComponentFixture<AddDiscProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddDiscProfileComponent]
    });
    fixture = TestBed.createComponent(AddDiscProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
