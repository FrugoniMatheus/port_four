import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrarTreinoPage } from './registrar-treino.page';

describe('RegistrarTreinoPage', () => {
  let component: RegistrarTreinoPage;
  let fixture: ComponentFixture<RegistrarTreinoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarTreinoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
