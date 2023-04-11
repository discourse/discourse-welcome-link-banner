import { helper } from "@ember/component/helper";

export default helper(function isExternalLink([url], _hash) {
  const currentUser = _hash.currentUser;
  const link = new URL(url, window.location);

  if (!currentUser?.user_option.external_links_in_new_tab) {
    return;
  }

  return link.hostname !== window.location.hostname;
});
