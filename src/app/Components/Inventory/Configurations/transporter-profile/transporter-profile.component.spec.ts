import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterProfileComponent } from './transporter-profile.component';

describe('TransporterProfileComponent', () => {
  let component: TransporterProfileComponent;
  let fixture: ComponentFixture<TransporterProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TransporterProfileComponent]
    });
    fixture = TestBed.createComponent(TransporterProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
