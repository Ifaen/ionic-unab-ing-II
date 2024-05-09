import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuloAccidenteVehicularPage } from './modulo-accidente-vehicular.page';

describe('ModuloAccidenteVehicularPage', () => {
  let component: ModuloAccidenteVehicularPage;
  let fixture: ComponentFixture<ModuloAccidenteVehicularPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModuloAccidenteVehicularPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
