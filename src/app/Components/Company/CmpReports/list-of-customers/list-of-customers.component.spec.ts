import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfCustomersComponent } from './list-of-customers.component';

describe('ListOfCustomersComponent', () => {
  let component: ListOfCustomersComponent;
  let fixture: ComponentFixture<ListOfCustomersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListOfCustomersComponent]
    });
    fixture = TestBed.createComponent(ListOfCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
