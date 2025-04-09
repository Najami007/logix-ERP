import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionKeyGeneratorComponent } from './subscription-key-generator.component';

describe('SubscriptionKeyGeneratorComponent', () => {
  let component: SubscriptionKeyGeneratorComponent;
  let fixture: ComponentFixture<SubscriptionKeyGeneratorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionKeyGeneratorComponent]
    });
    fixture = TestBed.createComponent(SubscriptionKeyGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
