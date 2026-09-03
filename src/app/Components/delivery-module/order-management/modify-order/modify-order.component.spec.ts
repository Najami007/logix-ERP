import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyOrderComponent } from './modify-order.component';

describe('ModifyOrderComponent', () => {
  let component: ModifyOrderComponent;
  let fixture: ComponentFixture<ModifyOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyOrderComponent]
    });
    fixture = TestBed.createComponent(ModifyOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
