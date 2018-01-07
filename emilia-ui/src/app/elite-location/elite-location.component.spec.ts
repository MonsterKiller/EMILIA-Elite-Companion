import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteLocationComponent } from './elite-location.component';

describe('EliteLocationComponent', () => {
  let component: EliteLocationComponent;
  let fixture: ComponentFixture<EliteLocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteLocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
