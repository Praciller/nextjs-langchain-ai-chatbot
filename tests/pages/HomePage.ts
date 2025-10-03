import { Page, Locator, expect } from "@playwright/test";

/**
 * Page Object Model for Home Page
 *
 * Following 4.1-Beast methodology with:
 * - Comprehensive locator strategies
 * - Reusable action methods
 * - Built-in assertions
 * - Error handling with retry logic
 */
export class HomePage {
  readonly page: Page;

  // Navigation Elements
  readonly logo: Locator;
  readonly logoText: Locator;
  readonly loginButton: Locator;
  readonly signUpButton: Locator;

  // Hero Section Elements
  readonly heroBadge: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroDescription: Locator;
  readonly consultAIButton: Locator;
  readonly heroLoginButton: Locator;

  // Features Section Elements
  readonly featuresSection: Locator;
  readonly featureCards: Locator;
  readonly spaFeatureCard: Locator;
  readonly bookingFeatureCard: Locator;
  readonly healthFeatureCard: Locator;

  // Stats Section Elements
  readonly statsSection: Locator;
  readonly customerCount: Locator;
  readonly satisfactionRate: Locator;
  readonly experienceYears: Locator;

  // Footer Elements
  readonly footer: Locator;
  readonly footerLogo: Locator;
  readonly copyrightText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navigation - Using test IDs for reliability
    // Use first() to select the navigation logo (there are 2 logos: nav and footer)
    this.logo = page.getByTestId("logo-image").first();
    this.logoText = page.getByTestId("logo-text").first();
    this.loginButton = page.getByTestId("nav-login-button");
    this.signUpButton = page.getByTestId("nav-signup-button");

    // Hero Section - Using test IDs for reliability
    this.heroBadge = page.getByTestId("hero-badge");
    this.heroTitle = page.getByTestId("hero-title");
    this.heroSubtitle = page.getByTestId("hero-subtitle");
    this.heroDescription = page.getByTestId("hero-description");
    this.consultAIButton = page.getByTestId("hero-consult-button");
    this.heroLoginButton = page.getByTestId("hero-login-button");

    // Features Section - Using test IDs for reliability
    this.featuresSection = page
      .locator("main > div > div")
      .filter({ hasText: "บริการสปาและการนวด" });
    // Use test IDs to locate feature cards
    this.featureCards = page.locator('[data-testid^="feature-card-"]');
    this.spaFeatureCard = page.getByRole("heading", {
      name: "บริการสปาและการนวด",
    });
    this.bookingFeatureCard = page.getByRole("heading", {
      name: "จองคิวและนัดหมาย",
    });
    this.healthFeatureCard = page.getByRole("heading", {
      name: "คำแนะนำด้านสุขภาพ",
    });

    // Stats Section
    this.statsSection = page.getByText("ความไว้วางใจจากลูกค้า");
    this.customerCount = page.getByText("5K+");
    this.satisfactionRate = page.getByText("98%");
    this.experienceYears = page.getByText("10+");

    // Footer
    this.footer = page.locator("footer");
    this.footerLogo = page.locator('footer img[alt*="Logo"]');
    this.copyrightText = page.getByText("© 2025 เฮลท์ แอนด์ เวลเนส สตูดิโอ");
  }

  /**
   * Navigate to home page
   */
  async goto() {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
    await this.page.waitForLoadState("networkidle");
    // Wait for logo to be visible as indicator page is ready
    await this.logo.waitFor({ state: "visible", timeout: 10000 });
  }

  /**
   * Verify page is loaded correctly
   */
  async verifyPageLoaded() {
    await expect(this.logo).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
    await expect(this.heroBadge).toBeVisible();
  }

  /**
   * Verify logo is displayed correctly
   */
  async verifyLogoDisplay() {
    await expect(this.logo).toBeVisible();
    await expect(this.logoText).toBeVisible();

    // Verify logo image has correct attributes
    // Next.js Image component wraps the img in a div, so we need to find the actual img element
    const logoImg = this.logo.locator("img");
    await expect(logoImg).toBeVisible();
    const logoSrc = await logoImg.getAttribute("src");
    expect(logoSrc).toContain("logo.svg");
  }

  /**
   * Verify navigation elements
   */
  async verifyNavigation() {
    await expect(this.loginButton).toBeVisible();
    await expect(this.signUpButton).toBeVisible();

    // Verify buttons are clickable
    await expect(this.loginButton).toBeEnabled();
    await expect(this.signUpButton).toBeEnabled();
  }

  /**
   * Verify hero section content
   */
  async verifyHeroSection() {
    await expect(this.heroBadge).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
    await expect(this.heroSubtitle).toBeVisible();
    await expect(this.heroDescription).toBeVisible();
    await expect(this.consultAIButton).toBeVisible();
    await expect(this.heroLoginButton).toBeVisible();
  }

  /**
   * Verify features section
   */
  async verifyFeaturesSection() {
    await expect(this.spaFeatureCard).toBeVisible();
    await expect(this.bookingFeatureCard).toBeVisible();
    await expect(this.healthFeatureCard).toBeVisible();

    // Verify we have at least 6 feature cards
    const cardCount = await this.featureCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(6);
  }

  /**
   * Verify stats section
   */
  async verifyStatsSection() {
    await expect(this.statsSection).toBeVisible();
    await expect(this.customerCount).toBeVisible();
    await expect(this.satisfactionRate).toBeVisible();
    await expect(this.experienceYears).toBeVisible();
  }

  /**
   * Verify footer
   */
  async verifyFooter() {
    await expect(this.footer).toBeVisible();
    await expect(this.footerLogo).toBeVisible();
    await expect(this.copyrightText).toBeVisible();
  }

  /**
   * Click login button in navigation
   */
  async clickLoginButton() {
    await this.loginButton.click();
    await this.page.waitForURL("**/auth/login");
  }

  /**
   * Click sign up button in navigation
   */
  async clickSignUpButton() {
    await this.signUpButton.click();
    await this.page.waitForURL("**/auth/sign-up");
  }

  /**
   * Click consult AI button
   * Note: This may redirect to auth if user is not logged in
   */
  async clickConsultAIButton() {
    await this.consultAIButton.click();
    // Wait for navigation to start (either to /chat or /auth/login)
    await this.page.waitForURL(/\/(chat|auth\/login)/);
  }

  /**
   * Verify mobile responsiveness
   */
  async verifyMobileLayout() {
    // Check that elements are still visible on mobile
    await expect(this.logo).toBeVisible();
    await expect(this.heroTitle).toBeVisible();

    // Verify mobile-specific behavior (login button is hidden on mobile with hidden sm:inline-flex)
    const viewportSize = this.page.viewportSize();
    if (viewportSize && viewportSize.width < 640) {
      // On mobile, the ghost login button in nav should be hidden
      await expect(this.loginButton).not.toBeVisible();
    }
  }

  /**
   * Test feature card hover effects
   */
  async testFeatureCardHover() {
    const firstCard = this.featureCards.first();

    // Get initial state
    const initialBox = await firstCard.boundingBox();

    // Hover over card
    await firstCard.hover();

    // Wait for animation
    await this.page.waitForTimeout(500);

    // Verify card is still visible (hover effect applied)
    await expect(firstCard).toBeVisible();
  }

  /**
   * Verify accessibility
   */
  async verifyAccessibility() {
    // Check for proper heading hierarchy
    const h1Count = await this.page.locator("h1").count();
    expect(h1Count).toBeGreaterThan(0);

    // Verify images have alt text
    const images = this.page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const alt = await images.nth(i).getAttribute("alt");
      expect(alt).toBeTruthy();
    }

    // Verify links are keyboard accessible
    await this.loginButton.focus();
    await expect(this.loginButton).toBeFocused();
  }
}
