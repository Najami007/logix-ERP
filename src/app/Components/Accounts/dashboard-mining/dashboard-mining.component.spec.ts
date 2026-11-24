import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardMiningComponent } from './dashboard-mining.component';

describe('DashboardMiningComponent', () => {
  let component: DashboardMiningComponent;
  let fixture: ComponentFixture<DashboardMiningComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardMiningComponent]
    });
    fixture = TestBed.createComponent(DashboardMiningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
