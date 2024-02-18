import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvDashboardComponent } from './inv-dashboard.component';

describe('InvDashboardComponent', () => {
  let component: InvDashboardComponent;
  let fixture: ComponentFixture<InvDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
