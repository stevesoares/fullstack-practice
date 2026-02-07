import { expect, test } from "@playwright/test";

async function createUser(page: import("@playwright/test").Page) {
  const unique = Date.now().toString();
  const email = `ui-${unique}@amelia.test`;
  const password = "StrongPass1!";

  const response = await page.request.post("/api/auth/signup", {
    data: {
      firstName: "UI",
      lastName: "Tester",
      companyName: "Amelia QA",
      email,
      phone: "5555555555",
      address: "123 Main St, Austin, TX 78701",
      addressStreet: "123 Main St",
      addressCity: "Austin",
      addressState: "TX",
      addressPostalCode: "78701",
      password,
    },
  });

  expect(response.ok()).toBeTruthy();

  return { email, password };
}

test("app shell + lead workflow", async ({ page }) => {
  const { email, password } = await createUser(page);

  await page.goto(`/auth/signin?callbackUrl=${encodeURIComponent("/app")}`);
  await page.getByLabel("Email address").fill(email);
  await page.getByLabel(/^Password$/).fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL(/\/app/);
  await expect(page.getByRole("navigation", { name: "App" })).toContainText("Leads");

  const leadName = `Lead ${Date.now()}`;

  await page.getByRole("button", { name: "Create New" }).click();
  const commandInput = page.getByPlaceholder("Search actions...");
  if (!(await commandInput.isVisible().catch(() => false))) {
    await page.keyboard.press("Control+k");
  }
  await expect(commandInput).toBeVisible();
  await commandInput.fill("new lead");
  await page.getByRole("button", { name: /New Lead/i }).click();

  await page.getByPlaceholder("Client name").fill(leadName);
  await page.getByPlaceholder("Client email").fill("lead@example.com");
  await page.getByRole("button", { name: "Save Lead" }).click();

  await page.goto("/app/leads");
  await expect(page.getByText(leadName)).toBeVisible();

  const leadCard = page.getByRole("link", { name: new RegExp(leadName, "i") }).first();
  const qualifiedColumn = page.locator("section", { hasText: "Qualified" }).first();
  await leadCard.dragTo(qualifiedColumn);

  await expect(qualifiedColumn).toContainText(leadName);

  await page.getByRole("button", { name: "List" }).click();
  await expect(page.getByRole("cell", { name: leadName })).toBeVisible();
});
