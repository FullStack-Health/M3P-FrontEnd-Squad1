import { TestBed } from "@angular/core/testing";

import { old_AuthService } from "./old_auth.service";

describe("AuthService", () => {
  let service: old_AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(old_AuthService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });
});
