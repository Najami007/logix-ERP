import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanTargetComponent } from './salesman-target.component';

describe('SalesmanTargetComponent', () => {
  let component: SalesmanTargetComponent;
  let fixture: ComponentFixture<SalesmanTargetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesmanTargetComponent]
    });
    fixture = TestBed.createComponent(SalesmanTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
