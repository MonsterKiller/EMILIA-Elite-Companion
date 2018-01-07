import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteMissionsComponent } from './elite-missions.component';

describe('EliteMissionsComponent', () => {
  let component: EliteMissionsComponent;
  let fixture: ComponentFixture<EliteMissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteMissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteMissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
