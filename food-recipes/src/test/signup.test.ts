import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { AxiosError, AxiosHeaders, AxiosResponse } from "axios";

import authReducer, { SignupPayload, LoginLogoutSignupResponse, AuthState } from "../Redux/Auth/AuthSlice";
import { signUpUser } from "../Redux/Auth/AuthThunk";
import api from "../Utils/axiosInstance/axiosInstance";

vi.mock("../Utils/axiosInstance/axiosInstance", () => ({
  default: {
    post: vi.fn(),
  },
}));

const mockedPost = vi.mocked(api.post);

describe("signUpUser thunk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createTestStore = () =>
    configureStore({
      reducer: {
        auth: authReducer,
      },
    });

  it("should handle signup success", async () => {
    const signupPayload: SignupPayload = {
      name: "Kevin",
      email: "kevin@test.com",
      password: "123456",
    };

    const apiResponseData: LoginLogoutSignupResponse = {
      success: true,
      message: "Signup successful",
    };

    const axiosResponse: AxiosResponse<LoginLogoutSignupResponse> = {
      data: apiResponseData,
      status: 200,
      statusText: "OK",
      headers: new AxiosHeaders(),
      config: {
        headers: new AxiosHeaders(),
      },
    };

    mockedPost.mockResolvedValueOnce(axiosResponse);

    const store = createTestStore();

    const result = await store.dispatch(signUpUser(signupPayload));

    const state: AuthState = store.getState().auth;

    expect(api.post).toHaveBeenCalledWith("/auth/signup", signupPayload);
    expect(result.type).toBe("auth/signupUser/fulfilled");

    expect(state.loading).toBe(false);
    expect(state.user).toEqual(apiResponseData);
    expect(state.error).toBeNull();
  });

  it("should handle axios error with backend message", async () => {
    const signupPayload: SignupPayload = {
      name: "Kevin",
      email: "kevin@test.com",
      password: "123456",
    };

    const axiosError: AxiosError<{ message: string }> = {
      name: "AxiosError",
      message: "Request failed",
      isAxiosError: true,

      config: {
        headers: new AxiosHeaders(),
      },

      toJSON: () => ({}),

      response: {
        data: { message: "Email already exists" },
        status: 400,
        statusText: "Bad Request",
        headers: new AxiosHeaders(),
        config: {
          headers: new AxiosHeaders(),
        },
      },
    };

    mockedPost.mockRejectedValueOnce(axiosError);

    const store = createTestStore();

    const result = await store.dispatch(signUpUser(signupPayload));
    const state: AuthState = store.getState().auth;

    expect(result.type).toBe("auth/signupUser/rejected");
    expect(result.payload).toBe("Email already exists");

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Email already exists");
    expect(state.user).toBeNull();
  });

  it("should handle non-axios error", async () => {
    const signupPayload: SignupPayload = {
      name: "Kevin",
      email: "kevin@test.com",
      password: "123456",
    };

    mockedPost.mockRejectedValueOnce(new Error("Unexpected crash"));

    const store = createTestStore();

    const result = await store.dispatch(signUpUser(signupPayload));
    const state: AuthState = store.getState().auth;

    expect(result.type).toBe("auth/signupUser/rejected");
    expect(result.payload).toBe("Something went wrong");

    expect(state.loading).toBe(false);
    expect(state.error).toBe("Something went wrong");
    expect(state.user).toBeNull();
  });
});
