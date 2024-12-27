import { module, test } from "qunit";
import migrate from "../../../../migrations/settings/0001-migrate-from-deprecated-icon-names";

const helpers = {
  isValidUrl: (url) => {
    if (url.startsWith("/") || url.match(/^#([^#]*)/)) {
      return true;
    }

    try {
      const uri = new URL(url);
      return ["http:", "https:"].includes(uri.protocol);
    } catch {
      return false;
    }
  },
};

module(
  "Unit | Migrations | Settings | 0001-migrate-from-deprecated-icon-names",
  function () {
    test("migrate", function (assert) {
      const settings = new Map(
        Object.entries({
          banner_links: JSON.stringify([
            {
              icon: "fab-facebook",
              text: "Facebook",
              url: "https://www.facebook.com",
            },
            { icon: "fab fa-cog", text: "Settings", url: "/settings" },
            { icon: "user-friends", text: "Groups", url: "not-a-valid-url" },
          ]),
          svg_icons: "fab-facebook|fab-twitter|fab-cog|user-friends",
        })
      );

      const result = migrate(settings, helpers);

      const expectedResult = new Map(
        Object.entries({
          banner_links: [
            {
              icon: "fab-facebook",
              text: "Facebook",
              url: "https://www.facebook.com",
            },
            { icon: "fab-gear", text: "Settings", url: "/settings" },
            { icon: "user-group", text: "Groups", url: "#" },
          ],
          svg_icons: "fab-facebook|fab-twitter|fab-gear|user-group",
        })
      );
      assert.deepEqual(Array.from(result), Array.from(expectedResult));
    });

    test("migrate empty settings", function (assert) {
      const settings = new Map(Object.entries({}));
      const result = migrate(settings, helpers);
      assert.deepEqual(Array.from(result), Array.from(settings));
    });
  }
);
