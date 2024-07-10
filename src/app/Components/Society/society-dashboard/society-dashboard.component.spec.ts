import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocietyDashboardComponent } from './society-dashboard.component';

describe('SocietyDashboardComponent', () => {
  let component: SocietyDashboardComponent;
  let fixture: ComponentFixture<SocietyDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocietyDashboardComponent]
    });
    fixture = TestBed.createComponent(SocietyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
