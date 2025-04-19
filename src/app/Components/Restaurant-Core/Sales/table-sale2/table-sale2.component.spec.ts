import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableSale2Component } from './table-sale2.component';

describe('TableSale2Component', () => {
  let component: TableSale2Component;
  let fixture: ComponentFixture<TableSale2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableSale2Component]
    });
    fixture = TestBed.createComponent(TableSale2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
