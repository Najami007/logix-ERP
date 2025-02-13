import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestDashboardComponent } from './rest-dashboard.component';

describe('RestDashboardComponent', () => {
  let component: RestDashboardComponent;
  let fixture: ComponentFixture<RestDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestDashboardComponent]
    });
    fixture = TestBed.createComponent(RestDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
