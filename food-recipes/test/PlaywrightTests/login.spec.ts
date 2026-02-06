// import { test, expect } from "@playwright/test";

// test("User can login successfully (captcha ignored)", async ({ page }) => {
//   await page.route("**/auth/login", async (route) => {
//     await route.fulfill({
//       status: 200,
//       contentType: "application/json",
//       body: JSON.stringify({
//         success: true,
//         message: "Login successful",
//       }),
//     });
//   });

//   await page.goto("http://localhost:5173/login");

//   await page.getByLabel("Email").fill("test@gmail.com");
//   await page.getByLabel("Password").fill("password123");

//   await page.getByRole("button", { name: "Log In" }).click();

//   await expect(page.getByText("Home")).toBeVisible();
//   await expect(page).toHaveURL(/home/);
// });
