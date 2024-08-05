import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentDetailEditComponent } from './payment-detail-edit.component';

describe('PaymentDetailEditComponent', () => {
  let component: PaymentDetailEditComponent;
  let fixture: ComponentFixture<PaymentDetailEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentDetailEditComponent]
    });
    fixture = TestBed.createComponent(PaymentDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
