import { i18n } from "@lingui/core";

import en from "./locales/en/messages.js";
import fr from "./locales/fr/messages.js";
import es from "./locales/es/messages.js";

i18n.load({
  en,
  fr,
  es,
});

i18n.activate("en");

export default i18n;

