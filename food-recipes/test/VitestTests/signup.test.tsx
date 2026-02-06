import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import type { MockedFunction } from "vitest";

import * as hooks from "../../src/Components/hooks";
import Signup from "../../src/Components/Signup";
import { signUpUser } from "../../src/Redux/Auth/AuthThunk";
import type { RootState } from "../../src/Redux/store/Store";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../../src/Components/hooks", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock("../../src/Redux/Auth/AuthThunk", () => ({
  signUpUser: vi.fn(),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));


const mockedUseAppDispatch =
  hooks.useAppDispatch as MockedFunction<typeof hooks.useAppDispatch>;

const mockedUseAppSelector =
  hooks.useAppSelector as MockedFunction<typeof hooks.useAppSelector>;

it("dispatches signup thunk on submit", async () => {
  const mockDispatch = vi.fn(); // ← NOT AppDispatch

  mockedUseAppDispatch.mockReturnValue(mockDispatch);

  mockedUseAppSelector.mockImplementation((selector) =>
    selector({
      foodAuth: { user: null, error: null },
    } as RootState)
  );

  render(<Signup />);

  fireEvent.change(
    screen.getByRole("textbox", { name: /username/i }),
    { target: { value: "Kevin" } }
  );

  fireEvent.change(
    screen.getByRole("textbox", { name: /email/i }),
    { target: { value: "kevin@test.com" } }
  );

  fireEvent.change(
    screen.getByLabelText(/password/i),
    { target: { value: "Password@123" } }
  );

  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

  await waitFor(() => {
    expect(mockDispatch).toHaveBeenCalledWith(
      signUpUser({
        name: "Kevin",
        email: "kevin@test.com",
        password: "Password@123",
      })
    );
  });
});
