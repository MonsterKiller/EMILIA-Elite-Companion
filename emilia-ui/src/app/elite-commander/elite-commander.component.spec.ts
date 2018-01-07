import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteCommanderComponent } from './elite-commander.component';

describe('EliteCommanderComponent', () => {
  let component: EliteCommanderComponent;
  let fixture: ComponentFixture<EliteCommanderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteCommanderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteCommanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
