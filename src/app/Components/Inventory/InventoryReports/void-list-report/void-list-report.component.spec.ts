import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidListReportComponent } from './void-list-report.component';

describe('VoidListReportComponent', () => {
  let component: VoidListReportComponent;
  let fixture: ComponentFixture<VoidListReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidListReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoidListReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
