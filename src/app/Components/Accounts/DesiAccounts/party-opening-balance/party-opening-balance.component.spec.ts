import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyOpeningBalanceComponent } from './party-opening-balance.component';

describe('PartyOpeningBalanceComponent', () => {
  let component: PartyOpeningBalanceComponent;
  let fixture: ComponentFixture<PartyOpeningBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyOpeningBalanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyOpeningBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
