import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object Model for Login Page
 *
 * Following 4.1-Beast methodology with:
 * - Thai language verification
 * - Logo integration testing
 * - Form validation testing
 * - Comprehensive error handling
 */
export class LoginPage {
  readonly page: Page;

  // Logo Elements
  readonly logo: Locator;

  // Auth Layout Elements
  readonly authLayoutLogo: Locator;
  readonly authLayoutTitle: Locator;
  readonly backToHomeButton: Locator;

  // Form Elements
  readonly cardTitle: Locator;
  readonly cardDescription: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly signUpLink: Locator;

  // Demo Credentials
  readonly demoEmailText: Locator;
  readonly demoPasswordText: Locator;
  readonly autoFillButton: Locator;

  // Error/Success Messages
  readonly errorMessage: Locator;
  readonly successToast: Locator;

  constructor(page: Page) {
    this.page = page;

    // Logo - Using test IDs for reliability
    this.logo = page.getByTestId("logo-image");

    // Auth Layout - Using test IDs where available
    this.authLayoutLogo = page.getByTestId("logo-image");
    this.authLayoutTitle = page.getByText("เข้าสู่โลกแห่ง");
    this.backToHomeButton = page.getByRole("link", { name: "กลับหน้าหลัก" });

    // Form - Using test IDs for reliability
    this.cardTitle = page.getByTestId("login-title");
    this.cardDescription = page.getByTestId("login-description");
    this.emailInput = page.getByTestId("login-email-input");
    this.passwordInput = page.getByTestId("login-password-input");
    this.loginButton = page.getByTestId("login-submit-button");
    this.forgotPasswordLink = page.getByTestId("forgot-password-link");
    this.signUpLink = page.getByTestId("signup-link");

    // Demo Credentials - Using test IDs for reliability
    this.demoEmailText = page.getByTestId("demo-email-text");
    this.demoPasswordText = page.getByTestId("demo-password-text");
    this.autoFillButton = page.getByTestId("auto-fill-button");

    // Messages - Using test IDs for reliability
    this.errorMessage = page.getByTestId("login-error-message");
    this.successToast = page.locator('[role="status"]');
  }

  /**
   * Navigate to login page
   */
  async goto() {
    await this.page.goto("/auth/login", { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
    // Wait for logo to be visible as indicator page is ready
    await this.logo.waitFor({ state: "visible", timeout: 10000 });
  }

  /**
   * Verify page is loaded correctly
   */
  async verifyPageLoaded() {
    await expect(this.cardTitle).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  /**
   * Verify logo is displayed
   */
  async verifyLogoDisplay() {
    await expect(this.logo).toBeVisible();

    // Verify logo image has correct attributes
    const logoSrc = await this.logo.getAttribute("src");
    expect(logoSrc).toContain("logo.svg");
  }

  /**
   * Verify auth layout logo
   */
  async verifyAuthLayoutLogo() {
    // Auth layout logo is only visible on desktop
    const viewportSize = this.page.viewportSize();
    if (viewportSize && viewportSize.width >= 1024) {
      await expect(this.authLayoutLogo).toBeVisible();
    }
  }

  /**
   * Verify Thai language consistency
   */
  async verifyThaiLanguage() {
    await expect(this.cardTitle).toHaveText("เข้าสู่ระบบ");
    await expect(this.cardDescription).toBeVisible();
    await expect(this.forgotPasswordLink).toHaveText("ลืมรหัสผ่าน?");
    await expect(this.backToHomeButton).toBeVisible();
  }

  /**
   * Verify form elements
   */
  async verifyFormElements() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
    await expect(this.forgotPasswordLink).toBeVisible();
    await expect(this.signUpLink).toBeVisible();
  }

  /**
   * Verify demo credentials section
   */
  async verifyDemoCredentials() {
    await expect(this.demoEmailText).toBeVisible();
    await expect(this.demoPasswordText).toBeVisible();
    await expect(this.autoFillButton).toBeVisible();
  }

  /**
   * Fill login form
   */
  async fillLoginForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.loginButton.click();
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string) {
    await this.fillLoginForm(email, password);
    await this.clickLogin();
  }

  /**
   * Use auto-fill for demo credentials
   */
  async useAutoFill() {
    await this.autoFillButton.click();

    // Verify fields are filled
    await expect(this.emailInput).toHaveValue("user@demo.com");
    await expect(this.passwordInput).toHaveValue("demo123");
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage(expectedMessage?: string) {
    await expect(this.errorMessage).toBeVisible();

    if (expectedMessage) {
      await expect(this.errorMessage).toContainText(expectedMessage);
    }
  }

  /**
   * Verify successful login (redirects to chat)
   */
  async verifySuccessfulLogin() {
    await this.page.waitForURL("**/chat", { timeout: 10000 });
    expect(this.page.url()).toContain("/chat");
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword() {
    await this.forgotPasswordLink.click();
    await this.page.waitForURL("**/auth/forgot-password");
  }

  /**
   * Click sign up link
   */
  async clickSignUp() {
    await this.signUpLink.click();
    await this.page.waitForURL("**/auth/sign-up");
  }

  /**
   * Click back to home button
   */
  async clickBackToHome() {
    await this.backToHomeButton.click();
    await this.page.waitForURL("/");
  }

  /**
   * Verify form validation
   */
  async verifyFormValidation() {
    // Try to submit empty form
    await this.clickLogin();

    // Browser validation should prevent submission
    const emailValidity = await this.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(emailValidity).toBe(false);
  }

  /**
   * Verify accessibility
   */
  async verifyAccessibility() {
    // Check form labels
    await expect(this.page.getByText("Email")).toBeVisible();
    await expect(this.page.getByText("Password")).toBeVisible();

    // Verify inputs are keyboard accessible
    await this.emailInput.focus();
    await expect(this.emailInput).toBeFocused();

    await this.page.keyboard.press("Tab");
    await expect(this.passwordInput).toBeFocused();
  }

  /**
   * Verify mobile responsiveness
   */
  async verifyMobileLayout() {
    const viewportSize = this.page.viewportSize();

    if (viewportSize && viewportSize.width < 1024) {
      // Auth layout sidebar should be hidden on mobile
      await expect(this.authLayoutTitle).toBeHidden();

      // Form should still be visible
      await expect(this.cardTitle).toBeVisible();
      await expect(this.emailInput).toBeVisible();
    }
  }
}
