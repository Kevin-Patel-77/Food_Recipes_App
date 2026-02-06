import { describe, it, expect, vi, beforeEach } from "vitest";
import { unwrapResult } from "@reduxjs/toolkit";

import api from "../../src/Utils/axiosInstance/axiosInstance";
import { logoutUser } from "../../src/Redux/Auth/AuthThunk";

/* ---------------- module mock ---------------- */

vi.mock("../../src/Utils/axiosInstance/axiosInstance", () => ({
  default: {
    post: vi.fn(),
  },
}));

/* ---------------- typed mock ---------------- */

const mockedApi = vi.mocked(api, true);

describe("logoutUser thunk", () => {
  const mockDispatch = vi.fn();
  const mockGetState = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("dispatches fulfilled action when logout succeeds", async () => {
    mockedApi.post.mockResolvedValueOnce({
      data: {
        success: true,
        message: "Logout successful",
      },
    });

    const action = await logoutUser()(
      mockDispatch,
      mockGetState,
      undefined
    );

    expect(mockedApi.post).toHaveBeenCalledWith("/auth/logout");

    const payload = unwrapResult(action);

    expect(payload.success).toBe(true);
    expect(payload.message).toBe("Logout successful");
  });

  it("returns rejected action with API error message", async () => {
    mockedApi.post.mockRejectedValueOnce({
      isAxiosError: true,
      response: {
        data: {
          message: "Session expired",
        },
      },
    });

    const action = await logoutUser()(
      mockDispatch,
      mockGetState,
      undefined
    );

    expect(action.type).toBe("auth/logoutUser/rejected");
    expect(action.payload).toBe("Session expired");
  });

  it("returns generic error for non-axios error", async () => {
    mockedApi.post.mockRejectedValueOnce(new Error("Boom"));

    const action = await logoutUser()(
      mockDispatch,
      mockGetState,
      undefined
    );

    expect(action.type).toBe("auth/logoutUser/rejected");
    expect(action.payload).toBe("Something went wrong");
  });
});
