import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSwingComponent } from './add-swing.component';

describe('AddSwingComponent', () => {
  let component: AddSwingComponent;
  let fixture: ComponentFixture<AddSwingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddSwingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSwingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
