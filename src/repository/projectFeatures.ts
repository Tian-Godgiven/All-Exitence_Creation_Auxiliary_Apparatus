import type { ProjectFeature } from "./projectFeature";

// Feature modules also register UI abilities, so they must load after application modules finish initializing.
export async function loadProjectFeatures(): Promise<ProjectFeature<unknown>[]> {
  const [inputSuggestion, quickDraft, tagLibrary, timeLine] = await Promise.all([
    import("@/supportAbility/inputSuggestion/main"),
    import("@/supportAbility/quickDraft/quickDraft"),
    import("@/supportAbility/tagLibrary/tagLibrary"),
    import("@/supportAbility/timeLine/timeLine"),
  ]);

  return [
    inputSuggestion.inputSuggestionProjectFeature,
    quickDraft.quickDraftProjectFeature,
    tagLibrary.tagLibraryProjectFeature,
    timeLine.timeLineProjectFeature,
    timeLine.timeLineTrashProjectFeature,
  ];
}
