import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRptRecipeCatwiseComponent } from './sale-rpt-recipe-catwise.component';

describe('SaleRptRecipeCatwiseComponent', () => {
  let component: SaleRptRecipeCatwiseComponent;
  let fixture: ComponentFixture<SaleRptRecipeCatwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleRptRecipeCatwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleRptRecipeCatwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
