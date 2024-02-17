import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoidableSalertnComponent } from './voidable-salertn.component';

describe('VoidableSalertnComponent', () => {
  let component: VoidableSalertnComponent;
  let fixture: ComponentFixture<VoidableSalertnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoidableSalertnComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VoidableSalertnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
