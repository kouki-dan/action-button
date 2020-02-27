import { canRunActionAutomatically } from "./ActionButton";

test("canRunActionAutomatically", () => {
  expect(
    canRunActionAutomatically(
      "https://github.com/kouki-dan/action-button",
      "kouki-dan",
      "action-button"
    )
  ).toBe(true);

  expect(
    canRunActionAutomatically(
      "https://example.com",
      "kouki-dan",
      "action-button"
    )
  ).toBe(false);

  expect(canRunActionAutomatically("", "kouki-dan", "action-button")).toBe(
    false
  );

  expect(
    canRunActionAutomatically(
      "https://github.com/kouki-dan/action-button/issues/1",
      "kouki-dan",
      "action-button"
    )
  ).toBe(false);

  expect(
    canRunActionAutomatically(
      "https://github.com/kouki-dan/action-button/pulls/2",
      "kouki-dan",
      "action-button"
    )
  ).toBe(false);
});
