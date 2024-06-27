import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfSuppliersComponent } from './list-of-suppliers.component';

describe('ListOfSuppliersComponent', () => {
  let component: ListOfSuppliersComponent;
  let fixture: ComponentFixture<ListOfSuppliersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListOfSuppliersComponent]
    });
    fixture = TestBed.createComponent(ListOfSuppliersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
