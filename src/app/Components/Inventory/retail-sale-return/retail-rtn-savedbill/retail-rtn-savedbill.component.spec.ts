import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailRtnSavedbillComponent } from './retail-rtn-savedbill.component';

describe('RetailRtnSavedbillComponent', () => {
  let component: RetailRtnSavedbillComponent;
  let fixture: ComponentFixture<RetailRtnSavedbillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailRtnSavedbillComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RetailRtnSavedbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
