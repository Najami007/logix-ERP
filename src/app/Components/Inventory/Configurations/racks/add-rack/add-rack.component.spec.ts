import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRackComponent } from './add-rack.component';

describe('AddRackComponent', () => {
  let component: AddRackComponent;
  let fixture: ComponentFixture<AddRackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRackComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
