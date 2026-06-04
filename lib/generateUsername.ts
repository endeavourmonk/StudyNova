/**
 * Generates a unique username from a user's first name.
 * Format: <sanitized_name><adjective><noun><4-digit_number>
 * Example: "alex_swift_river_4821"
 */

const ADJECTIVES = [
  "swift",
  "bright",
  "cool",
  "bold",
  "calm",
  "dark",
  "epic",
  "fast",
  "glad",
  "hazy",
  "icy",
  "jolly",
  "keen",
  "lazy",
  "mild",
  "neat",
  "odd",
  "pure",
  "quick",
  "rare",
  "sharp",
  "tidy",
  "vast",
  "warm",
  "zany",
  "azure",
  "brave",
  "crisp",
  "dusty",
  "early",
];

const NOUNS = [
  "river",
  "storm",
  "blade",
  "cloud",
  "frost",
  "grove",
  "haven",
  "isle",
  "jade",
  "kite",
  "lark",
  "mesa",
  "nova",
  "oak",
  "pine",
  "quest",
  "reef",
  "sage",
  "tide",
  "vale",
  "wave",
  "apex",
  "byte",
  "comet",
  "dune",
  "echo",
  "fern",
  "gale",
  "hawk",
  "iris",
];

/**
 * Sanitizes a first name for use in a username:
 * - Lowercases
 * - Strips accents/diacritics
 * - Removes non-alphanumeric characters
 * - Truncates to 12 chars
 */
function sanitizeName(firstName: string): string {
  return firstName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9]/g, "") // keep only alphanumeric
    .slice(0, 12);
}

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomSuffix(digits = 4): string {
  const max = Math.pow(10, digits);
  return String(Math.floor(Math.random() * max)).padStart(digits, "0");
}

/**
 * Generates a unique username from the user's first name.
 *
 * @param firstName - The user's first name (raw input, any casing/accents OK)
 * @param separator - Character used between parts (default: "_")
 * @returns A unique username string, e.g. "alex_swift_river_4821"
 */
export function generateUsername(firstName: string, separator = "_"): string {
  const base = sanitizeName(firstName);
  const adj = randomItem(ADJECTIVES);
  const noun = randomItem(NOUNS);
  const suffix = randomSuffix(4);

  // If name reduces to empty (e.g. all non-latin chars), fall back to "user"
  const namePart = base.length > 0 ? base : "user";

  return [namePart, adj, noun, suffix].join(separator);
}
