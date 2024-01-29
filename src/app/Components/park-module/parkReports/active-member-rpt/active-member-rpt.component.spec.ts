import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveMemberRptComponent } from './active-member-rpt.component';

describe('ActiveMemberRptComponent', () => {
  let component: ActiveMemberRptComponent;
  let fixture: ComponentFixture<ActiveMemberRptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveMemberRptComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveMemberRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
