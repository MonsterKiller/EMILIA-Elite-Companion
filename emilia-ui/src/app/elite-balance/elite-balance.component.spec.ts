import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteBalanceComponent } from './elite-balance.component';

describe('EliteBalanceComponent', () => {
  let component: EliteBalanceComponent;
  let fixture: ComponentFixture<EliteBalanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteBalanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
