import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCoaComponent } from './update-coa.component';

describe('UpdateCoaComponent', () => {
  let component: UpdateCoaComponent;
  let fixture: ComponentFixture<UpdateCoaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCoaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
