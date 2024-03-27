import { click, visit } from "@ember/test-helpers";
import { test } from "qunit";
import {
  acceptance,
  updateCurrentUser,
} from "discourse/tests/helpers/qunit-helpers";

acceptance("Welcome Link Banner - Logged out", function () {
  test("banner can be hidden from anons", async function (assert) {
    settings.hide_for_anon = true;
    await visit("/latest");

    assert
      .dom(".welcome-link-banner-wrapper")
      .doesNotExist("hides the banner for anons");
  });

  test("banner can be shown to anons", async function (assert) {
    settings.hide_for_anon = false;
    await visit("/latest");

    assert
      .dom(".welcome-link-banner-wrapper")
      .exists("hides the banner for anons");
  });
});

acceptance("Welcome Link Banner - Logged in", function (needs) {
  needs.user();

  needs.hooks.beforeEach(() => {
    settings.hide_for_staff = false;
    settings.max_trust_level = 5;
  });

  test("banner can be hidden from staff", async function (assert) {
    settings.hide_for_staff = true;
    await visit("/latest");

    assert
      .dom(".welcome-link-banner-wrapper")
      .doesNotExist("hides the banner for staff");
  });

  test("banner can be hidden by trust level", async function (assert) {
    settings.max_trust_level = 3;

    updateCurrentUser({
      trust_level: 4,
    });

    await visit("/latest");

    assert
      .dom(".welcome-link-banner-wrapper")
      .doesNotExist("hides the banner by trust level");
  });

  test("banner can be shown by route", async function (assert) {
    settings.show_on = "homepage";

    await visit("/");

    assert
      .dom(".welcome-link-banner-wrapper")
      .exists("shows the banner by route");

    await visit("/top");

    assert
      .dom(".welcome-link-banner-wrapper")
      .doesNotExist("hides the banner by route");
  });

  test("banner can be shown by trust level", async function (assert) {
    settings.max_trust_level = 3;

    updateCurrentUser({
      trust_level: 2,
    });

    await visit("/latest");

    assert
      .dom(".welcome-link-banner-wrapper")
      .exists("shows the banner by trust level");
  });

  test("banner can be hidden on mobile", async function (assert) {
    needs.mobileView();
    settings.hide_on_mobile = true;

    assert
      .dom(".welcome-link-banner-wrapper")
      .doesNotExist("hides the banner on mobile");
  });

  test("banner can be dismissed", async function (assert) {
    settings.can_be_dismissed = true;

    await visit("/latest");

    assert
      .dom(".welcome-link-banner-wrapper .welcome-link-banner-close")
      .exists("shows the close button");

    await click(".welcome-link-banner-wrapper .welcome-link-banner-close");

    assert
      .dom(".welcome-link-banner-wrapper")
      .doesNotExist("clicking the close button hides the banner");
  });
});
