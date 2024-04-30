import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioAlumPage } from './formulario-alum.page';

describe('FormularioAlumPage', () => {
  let component: FormularioAlumPage;
  let fixture: ComponentFixture<FormularioAlumPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FormularioAlumPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
