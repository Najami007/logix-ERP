import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterQtyComponent } from './enter-qty.component';

describe('EnterQtyComponent', () => {
  let component: EnterQtyComponent;
  let fixture: ComponentFixture<EnterQtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterQtyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnterQtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
