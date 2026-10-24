# Component Library Notes

Use the existing shared form components before adding native inputs or new wrappers.

## Form Controls

- `src/components/other/input/downLineInput.vue` (`DownLineInput`): single-line text and numeric input. Use `v-model`; set `type="number"` for numeric values. It emits `input`, `focus`, and `blur`. Native attributes such as `min` and `max` are not declared as props, so validate or clamp numeric values in the owning form.
- `src/components/global/Selector.vue` (`Selector`): single selection backed by Element Plus. Pass `:list` as `{ label, value }[]`, bind with `v-model`, and optionally pass `placeholder`. Its `change` event is emitted without a value; read the bound model in the handler.
- `src/components/other/input/BoxInput.vue` (`BoxInput`): click-to-edit display field backed by the multiline editor. Use for compact inline editing, not ordinary form fields.
- `src/components/other/textArea/MultiLineInput.vue` (`MultiLineInput`): plain multiline contenteditable input with `v-model` and placeholder support.
- `src/components/other/textArea/textArea.vue` (`TextArea`): article-oriented editor supporting structured content, input suggestions, and writing assistance. Do not use as a generic form textarea.

## Related Controls

- `src/components/global/button.vue` (`Button`): shared command control; prefer it over hand-built text buttons when a project button is appropriate.
- `src/components/global/time.vue` (`Time`): formatted time display, not a time input.
- `src/components/global/ListMenu.vue` (`ListMenu`): shared menu content for a list of actions. Pass `list` as `{ label, icon?, click, clickClose? }[]`; use `controlShow` when the parent menu needs to close after an action.
- `src/hooks/controlPanel.ts` (`showControlPanel`): pointer-positioned control/context menu popup. Pass a `Control` with `option` entries shaped as `{ text, click }` and an optional `{ x, y }` screen position. It uses the shared `controlPanel` popup and closes a previously opened control panel before showing another.

## Visual Conventions

- Use the shared palette in `src/static/style/variables/color.scss`. Destructive actions such as delete should use the semantic `$dangerColor`; for `showControlPanel`, set `danger: true` on the corresponding option so the shared menu renders its label in that color.
- An auxiliary ability that owns a feature-specific trash area can provide `recycleBinEntry` on its `SupportAbilitySignUpItem`. The public recycle bin renders the entry; the ability owns its trash data, recovery, and permanent deletion behavior.

## Component Discovery Rule

- Before building a component or interaction for a new requirement, search the existing component library and feature code for an implementation that already fits. Prefer reusing it over creating a parallel component.
- When an existing component or shared interaction is discovered and used for a requirement, add its location, purpose, and key usage details here so future work can find and reuse it. Keep this guide updated as the project conventions evolve.

## Usage Rule

For new forms, prefer `DownLineInput` for text/numbers and `Selector` for option lists. Keep validation and data normalization in the feature form when the shared component does not expose the needed native attributes. Avoid raw `<input>` and `<select>` unless a specialized interaction requires native behavior and the reason is clear.
