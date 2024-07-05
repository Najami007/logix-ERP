import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VsenterqtyComponent } from './vsenterqty.component';

describe('VsenterqtyComponent', () => {
  let component: VsenterqtyComponent;
  let fixture: ComponentFixture<VsenterqtyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VsenterqtyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VsenterqtyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
