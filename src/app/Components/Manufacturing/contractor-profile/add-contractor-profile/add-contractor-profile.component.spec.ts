import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContractorProfileComponent } from './add-contractor-profile.component';

describe('AddContractorProfileComponent', () => {
  let component: AddContractorProfileComponent;
  let fixture: ComponentFixture<AddContractorProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddContractorProfileComponent]
    });
    fixture = TestBed.createComponent(AddContractorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
