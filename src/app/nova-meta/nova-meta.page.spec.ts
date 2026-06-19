import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NovaMetaPage } from './nova-meta.page';

describe('NovaMetaPage', () => {
  let component: NovaMetaPage;
  let fixture: ComponentFixture<NovaMetaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NovaMetaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
