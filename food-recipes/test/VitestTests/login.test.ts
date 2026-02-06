import { describe, it, expect, vi, beforeEach } from "vitest";
import { unwrapResult } from "@reduxjs/toolkit";

import api from "../../src/Utils/axiosInstance/axiosInstance";
import { loginUser } from "../../src/Redux/Auth/AuthThunk";


vi.mock("../../src/Utils/axiosInstance/axiosInstance", () => ({
  default: {
    post: vi.fn(),
  },
}));


const mockedApi = vi.mocked(api, true);

describe("loginUser thunk", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("dispatches fulfilled action and stores tokens on success", async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    mockedApi.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: "Login successful",
        data: {
          access_token: "access-token-123",
          refresh_token: "refresh-token-456",
        },
      },
    });

    const action = await loginUser({
      email: "Kevin@Test.com",
      password: "Password@123",
      hcaptchaToken: "captcha-token",
    })(mockDispatch, mockGetState, undefined);

    // API call assertion
    expect(mockedApi.post).toHaveBeenCalledWith("/auth/login", {
      email: "kevin@test.com",
      password: "Password@123",
      hcaptchaToken: "captcha-token",
    });

    // localStorage side effects
    expect(setItemSpy).toHaveBeenCalledWith(
      "accessToken",
      "access-token-123"
    );
    expect(setItemSpy).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-token-456"
    );

    // ✅ SAFE payload access
    const payload = unwrapResult(action);

    expect(payload.success).toBe(true);
    expect(payload.message).toBe("Login successful");
  });

  it("returns rejected action with API error message", async () => {
    mockedApi.post.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: {
          message: "Invalid credentials",
        },
      },
    });

    const action = await loginUser({
      email: "kevin@test.com",
      password: "wrongpassword",
      hcaptchaToken: "captcha-token",
    })(mockDispatch, mockGetState, undefined);

    expect(action.type).toBe("auth/loginUser/rejected");
    expect(action.payload).toBe("Invalid credentials");
  });

  it("returns generic error for non-axios error", async () => {
    mockedApi.post.mockRejectedValueOnce(new Error("Boom"));

    const action = await loginUser({
      email: "kevin@test.com",
      password: "Password@123",
      hcaptchaToken: "captcha-token",
    })(mockDispatch, mockGetState, undefined);

    expect(action.type).toBe("auth/loginUser/rejected");
    expect(action.payload).toBe("Something went wrong");
  });
});
