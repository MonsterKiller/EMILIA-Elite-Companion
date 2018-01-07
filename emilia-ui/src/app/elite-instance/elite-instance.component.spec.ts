import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliteInstanceComponent } from './elite-instance.component';

describe('EliteInstanceComponent', () => {
  let component: EliteInstanceComponent;
  let fixture: ComponentFixture<EliteInstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliteInstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliteInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
