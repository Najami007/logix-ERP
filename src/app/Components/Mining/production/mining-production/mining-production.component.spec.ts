import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningProductionComponent } from './mining-production.component';

describe('MiningProductionComponent', () => {
  let component: MiningProductionComponent;
  let fixture: ComponentFixture<MiningProductionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiningProductionComponent]
    });
    fixture = TestBed.createComponent(MiningProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
