import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgettingComponent } from './budgetting.component';

describe('BudgettingComponent', () => {
  let component: BudgettingComponent;
  let fixture: ComponentFixture<BudgettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
