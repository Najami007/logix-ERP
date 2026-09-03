import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdQtyModalComponent } from './prod-qty-modal.component';

describe('ProdQtyModalComponent', () => {
  let component: ProdQtyModalComponent;
  let fixture: ComponentFixture<ProdQtyModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProdQtyModalComponent]
    });
    fixture = TestBed.createComponent(ProdQtyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
