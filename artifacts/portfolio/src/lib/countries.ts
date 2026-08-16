/**
 * Country names come from the browser (Intl.DisplayNames) — no name table to translate or maintain.
 * A testimonial stores an ISO 3166-1 alpha-2 code, or, for anything not on the list, whatever was typed.
 */
const CODES =
  "AD AE AF AG AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PS PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TZ UA UG US UY UZ VA VC VE VN VU WS YE ZA ZM ZW".split(
    " ",
  );

const formatters = new Map<string, Intl.DisplayNames>();
const formatter = (lang: string) => {
  let f = formatters.get(lang);
  if (!f) {
    f = new Intl.DisplayNames([lang], { type: "region", fallback: "none" });
    formatters.set(lang, f);
  }
  return f;
};

/** Display name for a stored value: a known code becomes a localized name, anything else is shown as typed. */
export const countryName = (value: string, lang: string) =>
  (/^[A-Z]{2}$/.test(value) ? formatter(lang).of(value) : undefined) ?? value;

const lists = new Map<string, string[]>();
/** All countries, localized and sorted — feeds the dashboard's <datalist>. */
export const countryNames = (lang: string) => {
  let list = lists.get(lang);
  if (!list) {
    list = CODES.map((code) => countryName(code, lang)).sort((a, b) => a.localeCompare(b, lang));
    lists.set(lang, list);
  }
  return list;
};

const codes = new Map<string, Map<string, string>>();
/** Reverse lookup: a name the user picked becomes its code, a name we don't know is stored verbatim. */
export const countryValue = (name: string, lang: string) => {
  let byName = codes.get(lang);
  if (!byName) {
    byName = new Map(CODES.map((code) => [countryName(code, lang).toLowerCase(), code]));
    codes.set(lang, byName);
  }
  return byName.get(name.trim().toLowerCase()) ?? name;
};
