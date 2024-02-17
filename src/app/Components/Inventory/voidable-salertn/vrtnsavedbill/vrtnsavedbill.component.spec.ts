import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrtnsavedbillComponent } from './vrtnsavedbill.component';

describe('VrtnsavedbillComponent', () => {
  let component: VrtnsavedbillComponent;
  let fixture: ComponentFixture<VrtnsavedbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VrtnsavedbillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VrtnsavedbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
