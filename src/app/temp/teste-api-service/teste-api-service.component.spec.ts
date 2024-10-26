import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TesteApiServiceComponent } from './teste-api-service.component';

describe('TesteApiServiceComponent', () => {
  let component: TesteApiServiceComponent;
  let fixture: ComponentFixture<TesteApiServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TesteApiServiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TesteApiServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
