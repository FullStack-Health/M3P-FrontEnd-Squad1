import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinginSignupPageComponent } from './singin-signup-page.component';

describe('SinginSignupPageComponent', () => {
  let component: SinginSignupPageComponent;
  let fixture: ComponentFixture<SinginSignupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SinginSignupPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SinginSignupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
