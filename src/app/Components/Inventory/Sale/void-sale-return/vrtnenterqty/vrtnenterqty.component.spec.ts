import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrtnenterqtyComponent } from './vrtnenterqty.component';

describe('VrtnenterqtyComponent', () => {
  let component: VrtnenterqtyComponent;
  let fixture: ComponentFixture<VrtnenterqtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VrtnenterqtyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VrtnenterqtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
