import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteShipNameComponent } from './elite-ship-name.component';

describe('EliteShipNameComponent', () => {
  let component: EliteShipNameComponent;
  let fixture: ComponentFixture<EliteShipNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteShipNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteShipNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
