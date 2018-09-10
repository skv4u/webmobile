import { TestBed, inject } from '@angular/core/testing';

import { ConfigurationMicroService } from './configuration-micro.service';

describe('ConfigurationMicroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfigurationMicroService]
    });
  });

  it('should ...', inject([ConfigurationMicroService], (service: ConfigurationMicroService) => {
    expect(service).toBeTruthy();
  }));
});
