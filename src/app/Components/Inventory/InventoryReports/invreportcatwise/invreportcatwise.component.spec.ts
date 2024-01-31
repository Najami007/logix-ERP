import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvreportcatwiseComponent } from './invreportcatwise.component';

describe('InvreportcatwiseComponent', () => {
  let component: InvreportcatwiseComponent;
  let fixture: ComponentFixture<InvreportcatwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvreportcatwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvreportcatwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
