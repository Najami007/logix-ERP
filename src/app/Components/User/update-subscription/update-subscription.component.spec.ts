import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSubscriptionComponent } from './update-subscription.component';

describe('UpdateSubscriptionComponent', () => {
  let component: UpdateSubscriptionComponent;
  let fixture: ComponentFixture<UpdateSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateSubscriptionComponent]
    });
    fixture = TestBed.createComponent(UpdateSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
