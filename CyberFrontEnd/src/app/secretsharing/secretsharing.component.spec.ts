import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretsharingComponent } from './secretsharing.component';

describe('SecretsharingComponent', () => {
  let component: SecretsharingComponent;
  let fixture: ComponentFixture<SecretsharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretsharingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretsharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
