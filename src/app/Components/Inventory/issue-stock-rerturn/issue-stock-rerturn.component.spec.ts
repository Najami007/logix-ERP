import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssueStockRerturnComponent } from './issue-stock-rerturn.component';

describe('IssueStockRerturnComponent', () => {
  let component: IssueStockRerturnComponent;
  let fixture: ComponentFixture<IssueStockRerturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssueStockRerturnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IssueStockRerturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
