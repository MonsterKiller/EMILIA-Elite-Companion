import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmiliaInfoComponent } from './emilia-info.component';

describe('EmiliaInfoComponent', () => {
  let component: EmiliaInfoComponent;
  let fixture: ComponentFixture<EmiliaInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmiliaInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmiliaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
