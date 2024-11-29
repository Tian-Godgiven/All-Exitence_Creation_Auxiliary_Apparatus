import type { ExtractPropTypes, VNode } from 'vue';
import type Notification from './notification.vue';
export declare const notificationTypes: readonly ["success", "info", "warning", "error"];
export declare const notificationProps: {
    readonly customClass: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "", boolean>;
    readonly dangerouslyUseHTMLString: BooleanConstructor;
    readonly duration: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 4500, boolean>;
    readonly icon: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component) | ((new (...args: any[]) => (string | import("vue").Component) & {}) | (() => string | import("vue").Component))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly id: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "", boolean>;
    readonly message: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string | VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>) | (() => string | VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>) | ((new (...args: any[]) => string | VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>) | (() => string | VNode<import("vue").RendererNode, import("vue").RendererElement, {
        [key: string]: any;
    }>))[], unknown, unknown, "", boolean>;
    readonly offset: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 0, boolean>;
    readonly onClick: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => () => void) | (() => () => void) | {
        (): () => void;
        new (): any;
        readonly prototype: any;
    } | ((new (...args: any[]) => () => void) | (() => () => void) | {
        (): () => void;
        new (): any;
        readonly prototype: any;
    })[], unknown, unknown, () => undefined, boolean>;
    readonly onClose: {
        readonly type: import("vue").PropType<() => void>;
        readonly required: true;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    readonly position: import("element-plus/es/utils").EpPropFinalized<StringConstructor, "top-right" | "top-left" | "bottom-right" | "bottom-left", unknown, "top-right", boolean>;
    readonly showClose: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
    readonly title: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "", boolean>;
    readonly type: import("element-plus/es/utils").EpPropFinalized<StringConstructor, "" | "error" | "success" | "warning" | "info", unknown, "", boolean>;
    readonly zIndex: NumberConstructor;
};
export type NotificationProps = ExtractPropTypes<typeof notificationProps>;
export declare const notificationEmits: {
    destroy: () => boolean;
};
export type NotificationEmits = typeof notificationEmits;
export type NotificationInstance = InstanceType<typeof Notification>;
export type NotificationOptions = Omit<NotificationProps, 'id'> & {
    /**
     * @description set the root element for the notification, default to `document.body`
     */
    appendTo?: HTMLElement | string;
};
export type NotificationOptionsTyped = Omit<NotificationOptions, 'type'>;
export interface NotificationHandle {
    close: () => void;
}
export type NotificationParams = Partial<NotificationOptions> | string | VNode;
export type NotificationParamsTyped = Partial<NotificationOptionsTyped> | string | VNode;
export type NotifyFn = ((options?: NotificationParams) => NotificationHandle) & {
    closeAll: () => void;
};
export type NotifyTypedFn = (options?: NotificationParamsTyped) => NotificationHandle;
export interface Notify extends NotifyFn {
    success: NotifyTypedFn;
    warning: NotifyTypedFn;
    error: NotifyTypedFn;
    info: NotifyTypedFn;
}
export interface NotificationQueueItem {
    vm: VNode;
}
export type NotificationQueue = NotificationQueueItem[];
