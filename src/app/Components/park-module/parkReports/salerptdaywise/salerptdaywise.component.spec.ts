import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalerptdaywiseComponent } from './salerptdaywise.component';

describe('SalerptdaywiseComponent', () => {
  let component: SalerptdaywiseComponent;
  let fixture: ComponentFixture<SalerptdaywiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalerptdaywiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalerptdaywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
