import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MineIssuanceComponent } from './mine-issuance.component';

describe('MineIssuanceComponent', () => {
  let component: MineIssuanceComponent;
  let fixture: ComponentFixture<MineIssuanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MineIssuanceComponent]
    });
    fixture = TestBed.createComponent(MineIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
