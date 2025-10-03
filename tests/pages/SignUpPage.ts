import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object Model for Sign Up Page
 *
 * Following 4.1-Beast methodology with:
 * - Thai language verification
 * - Logo integration testing
 * - Form validation testing
 * - Comprehensive error handling
 */
export class SignUpPage {
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
  readonly displayNameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly repeatPasswordInput: Locator;
  readonly signUpButton: Locator;
  readonly loginLink: Locator;

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
    this.cardTitle = page.getByTestId("signup-title");
    this.cardDescription = page.getByTestId("signup-description");
    this.displayNameInput = page.getByTestId("signup-displayname-input");
    this.phoneInput = page.getByTestId("signup-phone-input");
    this.emailInput = page.getByTestId("signup-email-input");
    this.passwordInput = page.getByTestId("signup-password-input");
    this.repeatPasswordInput = page.getByTestId("signup-repeat-password-input");
    this.signUpButton = page.getByTestId("signup-submit-button");
    this.loginLink = page.getByTestId("login-link");

    // Messages - Using test IDs for reliability
    this.errorMessage = page.getByTestId("signup-error-message");
    this.successToast = page.locator('[role="status"]');
  }

  /**
   * Navigate to sign up page
   */
  async goto() {
    await this.page.goto("/auth/sign-up", { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
    // Wait for logo to be visible as indicator page is ready
    await this.logo.waitFor({ state: "visible", timeout: 10000 });
  }

  /**
   * Verify page is loaded correctly
   */
  async verifyPageLoaded() {
    await expect(this.cardTitle).toBeVisible();
    await expect(this.displayNameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
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
    await expect(this.cardTitle).toHaveText("ลงทะเบียน");
    await expect(this.cardDescription).toHaveText(
      "สร้างบัญชีใหม่เพื่อเข้าใช้งานระบบ"
    );

    // Verify all labels are in Thai
    await expect(this.page.getByText("ชื่อที่แสดง")).toBeVisible();
    await expect(this.page.getByText("เบอร์โทรศัพท์")).toBeVisible();
    await expect(this.page.getByText("อีเมล")).toBeVisible();
    await expect(
      this.page.getByText("รหัสผ่าน", { exact: true })
    ).toBeVisible();
    await expect(this.page.getByText("ยืนยันรหัสผ่าน")).toBeVisible();

    // Verify link text
    await expect(this.page.getByText("มีบัญชีอยู่แล้ว?")).toBeVisible();
  }

  /**
   * Verify form elements
   */
  async verifyFormElements() {
    await expect(this.displayNameInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.repeatPasswordInput).toBeVisible();
    await expect(this.signUpButton).toBeVisible();
    await expect(this.loginLink).toBeVisible();
  }

  /**
   * Verify input placeholders are in Thai
   */
  async verifyThaiPlaceholders() {
    await expect(this.displayNameInput).toHaveAttribute(
      "placeholder",
      "ชื่อของคุณ"
    );
    await expect(this.phoneInput).toHaveAttribute(
      "placeholder",
      "0xx-xxx-xxxx"
    );
    await expect(this.emailInput).toHaveAttribute(
      "placeholder",
      "example@email.com"
    );
    await expect(this.passwordInput).toHaveAttribute(
      "placeholder",
      "รหัสผ่านของคุณ"
    );
    await expect(this.repeatPasswordInput).toHaveAttribute(
      "placeholder",
      "ยืนยันรหัสผ่านอีกครั้ง"
    );
  }

  /**
   * Fill sign up form
   */
  async fillSignUpForm(
    displayName: string,
    phone: string,
    email: string,
    password: string,
    repeatPassword: string
  ) {
    await this.displayNameInput.fill(displayName);
    await this.phoneInput.fill(phone);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.repeatPasswordInput.fill(repeatPassword);
  }

  /**
   * Click sign up button
   */
  async clickSignUp() {
    await this.signUpButton.click();
  }

  /**
   * Sign up with credentials
   */
  async signUp(
    displayName: string,
    phone: string,
    email: string,
    password: string,
    repeatPassword: string
  ) {
    await this.fillSignUpForm(
      displayName,
      phone,
      email,
      password,
      repeatPassword
    );
    await this.clickSignUp();
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
   * Verify password mismatch error (Thai)
   */
  async verifyPasswordMismatchError() {
    await expect(this.errorMessage).toHaveText("รหัสผ่านไม่ตรงกัน");
  }

  /**
   * Verify successful sign up (redirects to login)
   */
  async verifySuccessfulSignUp() {
    await this.page.waitForURL("**/auth/login", { timeout: 10000 });
    expect(this.page.url()).toContain("/auth/login");
  }

  /**
   * Click login link
   */
  async clickLogin() {
    await this.loginLink.click();
    await this.page.waitForURL("**/auth/login");
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
    await this.clickSignUp();

    // Browser validation should prevent submission
    const displayNameValidity = await this.displayNameInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    expect(displayNameValidity).toBe(false);
  }

  /**
   * Test password mismatch validation
   */
  async testPasswordMismatch() {
    await this.fillSignUpForm(
      "Test User",
      "0812345678",
      "test@example.com",
      "password123",
      "password456"
    );
    await this.clickSignUp();

    // Should show Thai error message
    await this.verifyPasswordMismatchError();
  }

  /**
   * Verify accessibility
   */
  async verifyAccessibility() {
    // Check form labels
    await expect(this.page.getByText("ชื่อที่แสดง")).toBeVisible();
    await expect(this.page.getByText("เบอร์โทรศัพท์")).toBeVisible();

    // Verify inputs are keyboard accessible
    await this.displayNameInput.focus();
    await expect(this.displayNameInput).toBeFocused();

    await this.page.keyboard.press("Tab");
    await expect(this.phoneInput).toBeFocused();
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
      await expect(this.displayNameInput).toBeVisible();
    }
  }
}
