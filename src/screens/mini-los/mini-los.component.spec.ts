import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiniLosComponent } from './mini-los.component';

describe('MiniLosComponent', () => {
  let component: MiniLosComponent;
  let fixture: ComponentFixture<MiniLosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiniLosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MiniLosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
