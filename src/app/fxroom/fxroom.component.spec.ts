import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FxroomComponent } from './fxroom.component';

describe('FxroomComponent', () => {
  let component: FxroomComponent;
  let fixture: ComponentFixture<FxroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FxroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FxroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
