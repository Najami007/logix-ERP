import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleMobComponent } from './sale-mob.component';

describe('SaleMobComponent', () => {
  let component: SaleMobComponent;
  let fixture: ComponentFixture<SaleMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleMobComponent]
    });
    fixture = TestBed.createComponent(SaleMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
