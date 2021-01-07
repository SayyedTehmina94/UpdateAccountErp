import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesByVendorComponent } from './purchases-by-vendor.component';

describe('PurchasesByVendorComponent', () => {
  let component: PurchasesByVendorComponent;
  let fixture: ComponentFixture<PurchasesByVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasesByVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesByVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
