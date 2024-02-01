import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvcredComponent } from './invcred.component';

describe('InvcredComponent', () => {
  let component: InvcredComponent;
  let fixture: ComponentFixture<InvcredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvcredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvcredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
