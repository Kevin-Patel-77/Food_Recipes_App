import { describe, it, expect, vi, beforeEach } from "vitest"
import { configureStore } from "@reduxjs/toolkit"
import { AxiosError, AxiosHeaders, AxiosResponse } from "axios"

import authReducer, {
  AuthState,
  LoginWithCaptcha,
  LoginLogoutSignupResponse,
} from "../Redux/Auth/AuthSlice"
import { loginUser } from "../Redux/Auth/AuthThunk"
import api from "../Utils/axiosInstance/axiosInstance"


vi.mock("../Utils/axiosInstance/axiosInstance", () => ({
  default: {
    post: vi.fn(),
  },
}))

const mockedPost = vi.mocked(api.post)

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
})


const createTestStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
  })

describe("loginUser thunk", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should login successfully and store tokens", async () => {
    const loginPayload: LoginWithCaptcha = {
      email: "test@test.com",
      password: "123456",
      hcaptchaToken: "captcha-token",
    }

    const responseData: LoginLogoutSignupResponse & {
      access_token: string
      refresh_token: string
    } = {
      success: true,
      message: "Login successful",
      access_token: "access-token",
      refresh_token: "refresh-token",
    }

    const axiosResponse: AxiosResponse<typeof responseData> = {
      data: responseData, 
      status: 200,
      statusText: "OK",
      headers: new AxiosHeaders(),
      config: {
        headers: new AxiosHeaders(),
      },
    }

    mockedPost.mockResolvedValueOnce(axiosResponse)

    const store = createTestStore()

    const result = await store.dispatch(loginUser(loginPayload))
    const state: AuthState = store.getState().auth

    expect(api.post).toHaveBeenCalledWith("/auth/login", loginPayload)
    expect(result.type).toBe("auth/loginUser/fulfilled")

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "accessToken",
      "access-token"
    )
    expect(localStorage.setItem).toHaveBeenCalledWith(
      "refreshToken",
      "refresh-token"
    )

    expect(state.loading).toBe(false)
    expect(state.user?.success).toBe(true)
    expect(state.isAuthenticated).toBe(true)
    expect(state.error).toBeNull()
  })

  it("should handle axios error and not store tokens", async () => {
    const loginPayload: LoginWithCaptcha = {
      email: "test@test.com",
      password: "123456",
      hcaptchaToken: "captcha-token",
    }

    const axiosError: AxiosError<{ message: string }> = {
      name: "AxiosError",
      message: "Request failed",
      isAxiosError: true,
      config: {
        headers: new AxiosHeaders(),
      },
      toJSON: () => ({}),
      response: {
        data: { message: "Invalid credentials" },
        status: 401,
        statusText: "Unauthorized",
        headers: new AxiosHeaders(),
        config: {
          headers: new AxiosHeaders(),
        },
      },
    }

    mockedPost.mockRejectedValueOnce(axiosError)

    const store = createTestStore()

    const result = await store.dispatch(loginUser(loginPayload))
    const state: AuthState = store.getState().auth

    expect(result.type).toBe("auth/loginUser/rejected")
    expect(result.payload).toBe("Invalid credentials")

    expect(localStorage.setItem).not.toHaveBeenCalled()

    expect(state.loading).toBe(false)
    expect(state.error).toBe("Invalid credentials")
    expect(state.isAuthenticated).toBe(false)
  })

  it("should handle non-axios error", async () => {
    const loginPayload: LoginWithCaptcha = {
      email: "test@test.com",
      password: "123456",
      hcaptchaToken: "captcha-token",
    }

    mockedPost.mockRejectedValueOnce(new Error("Random crash"))

    const store = createTestStore()

    const result = await store.dispatch(loginUser(loginPayload))
    const state: AuthState = store.getState().auth

    expect(result.type).toBe("auth/loginUser/rejected")
    expect(result.payload).toBe("Something went wrong")

    expect(localStorage.setItem).not.toHaveBeenCalled()
    expect(state.loading).toBe(false)
    expect(state.error).toBe("Something went wrong")
    expect(state.isAuthenticated).toBe(false)
  })
})
