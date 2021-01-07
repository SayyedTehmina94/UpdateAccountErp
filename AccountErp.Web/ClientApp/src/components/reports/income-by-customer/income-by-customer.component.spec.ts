import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeByCustomerComponent } from './income-by-customer.component';

describe('IncomeByCustomerComponent', () => {
  let component: IncomeByCustomerComponent;
  let fixture: ComponentFixture<IncomeByCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncomeByCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomeByCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
