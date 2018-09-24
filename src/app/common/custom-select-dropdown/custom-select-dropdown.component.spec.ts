import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomSelectDropdownComponent } from './custom-select-dropdown.component';

describe('CustomSelectDropdownComponent', () => {
  let component: CustomSelectDropdownComponent;
  let fixture: ComponentFixture<CustomSelectDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomSelectDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomSelectDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
