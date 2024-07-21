import { TestBed } from '@angular/core/testing';

import { ProductsDataTrasnferService } from './products-data-trasnfer.service';

describe('ProductsDataTrasnferService', () => {
  let service: ProductsDataTrasnferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductsDataTrasnferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
