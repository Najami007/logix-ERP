import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapWHProductComponent } from './map-whproduct.component';

describe('MapWHProductComponent', () => {
  let component: MapWHProductComponent;
  let fixture: ComponentFixture<MapWHProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapWHProductComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapWHProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
