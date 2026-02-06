import { test, expect } from "@playwright/test";

test("User can sign up successfully", async ({ page }) => {
  
  await page.route("http://localhost:3000/auth/signup", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        success: true,
        message: "Account created successfully",
      }),
    });
  });

  await page.goto("http://localhost:5173/signup");

  
  await page.getByLabel("UserName:").fill("Kevin Patel");
  await page.getByLabel("Email:").fill("kevin@test.com");
  await page.getByLabel("Password:").fill("Strong@123");


  await page.getByRole("button", { name: "Sign Up" }).click();


  await expect(page).toHaveURL(/login/);
});


test("Shows error message when signup fails", async ({ page }) => {
  await page.route("**/auth/signup", async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        message: "Email already exists",
      }),
    });
  });

  await page.goto("http://localhost:5173/signup");

  await page.getByLabel("UserName:").fill("Kevin Patel");
  await page.getByLabel("Email:").fill("kevin@test.com");
  await page.getByLabel("Password:").fill("Strong@123");

  await page.getByRole("button", { name: "Sign Up" }).click();

  await expect(page.getByText("Email already exists")).toBeVisible();

  await expect(page).toHaveURL(/signup/);
});

test("Shows validation errors on empty submit", async ({ page }) => {
  await page.goto("http://localhost:5173/signup");

  await page.getByRole("button", { name: "Sign Up" }).click();

  await expect(page.getByText("Name is required")).toBeVisible();
  await expect(page.getByText("Email is required")).toBeVisible();
  await expect(page.getByText("Password is required")).toBeVisible();
});


