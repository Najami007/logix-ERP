import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestDashboardComponent } from './rest-dashboard.component';

describe('RestDashboardComponent', () => {
  let component: RestDashboardComponent;
  let fixture: ComponentFixture<RestDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RestDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
