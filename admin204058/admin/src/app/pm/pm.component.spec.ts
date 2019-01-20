import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PMComponent } from './pm.component';

describe('PMComponent', () => {
  let component: PMComponent;
  let fixture: ComponentFixture<PMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
