import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientIntakeForm } from './client-intake-form';

describe('ClientIntakeForm', () => {
  let component: ClientIntakeForm;
  let fixture: ComponentFixture<ClientIntakeForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientIntakeForm],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientIntakeForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
