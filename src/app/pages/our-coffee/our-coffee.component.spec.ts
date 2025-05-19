import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurCoffeeComponent } from './our-coffee.component';

describe('OurCoffeeComponent', () => {
  let component: OurCoffeeComponent;
  let fixture: ComponentFixture<OurCoffeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OurCoffeeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OurCoffeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
