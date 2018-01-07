import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteInventoryComponent } from './elite-inventory.component';

describe('EliteInventoryComponent', () => {
  let component: EliteInventoryComponent;
  let fixture: ComponentFixture<EliteInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
