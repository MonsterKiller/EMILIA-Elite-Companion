import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteRanksComponent } from './elite-ranks.component';

describe('EliteRanksComponent', () => {
  let component: EliteRanksComponent;
  let fixture: ComponentFixture<EliteRanksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteRanksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteRanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
