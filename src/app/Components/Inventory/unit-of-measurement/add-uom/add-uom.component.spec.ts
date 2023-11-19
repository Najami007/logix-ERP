import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUOMComponent } from './add-uom.component';

describe('AddUOMComponent', () => {
  let component: AddUOMComponent;
  let fixture: ComponentFixture<AddUOMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUOMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUOMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
