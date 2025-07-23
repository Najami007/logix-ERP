import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQtyModalComponent } from './edit-qty-modal.component';

describe('EditQtyModalComponent', () => {
  let component: EditQtyModalComponent;
  let fixture: ComponentFixture<EditQtyModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditQtyModalComponent]
    });
    fixture = TestBed.createComponent(EditQtyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
