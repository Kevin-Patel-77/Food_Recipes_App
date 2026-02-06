import { describe, it, expect, vi } from "vitest";
import api from "../../src/Utils/axiosInstance/axiosInstance";
import { signUpUser } from "../../src/Redux/Auth/AuthThunk";


vi.mock("../../src/Utils/axiosInstance/axiosInstance", () => ({
  default: {
    post: vi.fn(),
  },
}));


const mockedApi = vi.mocked(api, true);

describe("signUpUser thunk", () => {
  it("dispatches fulfilled action when signup succeeds", async () => {
    const mockDispatch = vi.fn();
    const mockGetState = vi.fn();

    const payload = {
      name: "Kevin",
      email: "Kevin@Test.com",
      password: "Password@123",
    };

    mockedApi.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: "Signup successful",
      },
    });

    const action = await signUpUser(payload)(
      mockDispatch,
      mockGetState,
      undefined
    );

    expect(mockedApi.post).toHaveBeenCalledWith("/auth/signup", {
      name: "Kevin",
      email: "kevin@test.com",
      password: "Password@123",
    });

    expect(action.type).toBe("auth/signupUser/fulfilled");
    expect(action.payload).toEqual({
      success: true,
      message: "Signup successful",
    });
  });

  it("returns rejected action with API error message", async () => {
    const mockDispatch = vi.fn();
    const mockGetState = vi.fn();

    mockedApi.post.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: {
          message: "Email already exists",
        },
      },
    });

    const action = await signUpUser({
      name: "Kevin",
      email: "kevin@test.com",
      password: "Password@123",
    })(mockDispatch, mockGetState, undefined);

    expect(action.type).toBe("auth/signupUser/rejected");
    expect(action.payload).toBe("Email already exists");
  });

  it("returns generic error for non-axios error", async () => {
    const mockDispatch = vi.fn();
    const mockGetState = vi.fn();

    mockedApi.post.mockRejectedValueOnce(new Error("Boom"));

    const action = await signUpUser({
      name: "Kevin",
      email: "kevin@test.com",
      password: "Password@123",
    })(mockDispatch, mockGetState, undefined);

    expect(action.type).toBe("auth/signupUser/rejected");
    expect(action.payload).toBe("Something went wrong");
  });
});
