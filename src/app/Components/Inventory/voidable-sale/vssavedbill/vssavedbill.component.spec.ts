import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VssavedbillComponent } from './vssavedbill.component';

describe('VssavedbillComponent', () => {
  let component: VssavedbillComponent;
  let fixture: ComponentFixture<VssavedbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VssavedbillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VssavedbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
