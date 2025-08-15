import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemProductionComponent } from './item-production.component';

describe('ItemProductionComponent', () => {
  let component: ItemProductionComponent;
  let fixture: ComponentFixture<ItemProductionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ItemProductionComponent]
    });
    fixture = TestBed.createComponent(ItemProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
