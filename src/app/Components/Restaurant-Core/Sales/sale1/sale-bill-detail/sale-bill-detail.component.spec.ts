import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleBillDetailComponent } from './sale-bill-detail.component';

describe('SaleBillDetailComponent', () => {
  let component: SaleBillDetailComponent;
  let fixture: ComponentFixture<SaleBillDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleBillDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleBillDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
