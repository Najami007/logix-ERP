import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddtableComponent } from './addtable.component';

describe('AddtableComponent', () => {
  let component: AddtableComponent;
  let fixture: ComponentFixture<AddtableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddtableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddtableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
