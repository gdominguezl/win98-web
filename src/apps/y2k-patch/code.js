const DEFAULT_CODE = "Y2KPATCH99";

function normalizeCode(value) {
  return String(value ?? "").toUpperCase().replace(/[\s-]/g, "");
}

// Only reader of the patch code. A later office id can select a code here.
export function getExpectedCode() {
  const configured = import.meta.env.VITE_Y2K_PATCH_CODE;
  const raw =
    configured == null || String(configured).trim() === ""
      ? DEFAULT_CODE
      : configured;
  return normalizeCode(raw);
}

export function codesMatch(input) {
  const expected = getExpectedCode();
  return expected.length > 0 && normalizeCode(input) === expected;
}
