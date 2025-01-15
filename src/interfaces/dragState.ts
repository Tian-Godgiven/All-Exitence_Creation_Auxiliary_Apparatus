import { type Edge } from "@atlaskit/pragmatic-drag-and-drop-hitbox/dist/types/types";

export type DragState = | {
    type:"idle"
}|{
    type:"dragging",
}|{
    type: "preview"; //预览状态，也就是当正在拖动时的状态
    container: HTMLElement;
}|{
    type: "be-dragging-over"; //其他元素正在经过该元素
    enter: boolean | null;
    edge: Edge | null
}|{
    type: "be-dragging-edge";
    edge: Edge | null
}