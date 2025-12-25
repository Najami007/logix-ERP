import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindBillDetailComponent } from './find-bill-detail.component';

describe('FindBillDetailComponent', () => {
  let component: FindBillDetailComponent;
  let fixture: ComponentFixture<FindBillDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindBillDetailComponent]
    });
    fixture = TestBed.createComponent(FindBillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
