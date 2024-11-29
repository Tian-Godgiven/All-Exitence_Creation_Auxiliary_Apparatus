declare function __VLS_template(): {
    default?(_: {}): any;
    content?(_: {}): any;
};
declare const __VLS_component: import("vue").DefineComponent<{
    showArrow: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, boolean, boolean>;
    arrowOffset: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 5, boolean>;
    disabled: BooleanConstructor;
    trigger: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => "click" | "contextmenu" | "focus" | "hover" | import("element-plus/es/element-plus").TooltipTriggerType[]) | (() => import("element-plus/es/utils").Arrayable<import("element-plus/es/element-plus").TooltipTriggerType>) | ((new (...args: any[]) => "click" | "contextmenu" | "focus" | "hover" | import("element-plus/es/element-plus").TooltipTriggerType[]) | (() => import("element-plus/es/utils").Arrayable<import("element-plus/es/element-plus").TooltipTriggerType>))[], unknown, unknown, "hover", boolean>;
    triggerKeys: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string[]) | (() => string[]) | ((new (...args: any[]) => string[]) | (() => string[]))[], unknown, unknown, () => string[], boolean>;
    virtualRef: {
        readonly type: import("vue").PropType<import("element-plus/es/components/popper").Measurable>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    virtualTriggering: BooleanConstructor;
    onMouseenter: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onMouseleave: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onClick: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onKeydown: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onFocus: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onBlur: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onContextmenu: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    id: StringConstructor;
    open: BooleanConstructor;
    ariaLabel: StringConstructor;
    appendTo: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | HTMLElement) | (() => string | HTMLElement) | ((new (...args: any[]) => string | HTMLElement) | (() => string | HTMLElement))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    content: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "", boolean>;
    rawContent: BooleanConstructor;
    persistent: BooleanConstructor;
    visible: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => boolean) | (() => boolean | null) | ((new (...args: any[]) => boolean) | (() => boolean | null))[], unknown, unknown, null, boolean>;
    transition: StringConstructor;
    teleported: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
    style: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue) | ((new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    className: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | (() => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | ((new (...args: any[]) => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | (() => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    effect: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string) | (() => string) | ((new (...args: any[]) => string) | (() => string))[], unknown, unknown, "dark", boolean>;
    enterable: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
    pure: BooleanConstructor;
    focusOnShow: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, false, boolean>;
    trapping: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, false, boolean>;
    popperClass: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | (() => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | ((new (...args: any[]) => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | (() => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    popperStyle: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue) | ((new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    referenceEl: {
        readonly type: import("vue").PropType<HTMLElement>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    triggerTargetEl: {
        readonly type: import("vue").PropType<HTMLElement>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    stopPopperMouseEvent: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
    zIndex: NumberConstructor;
    boundariesPadding: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 0, boolean>;
    fallbackPlacements: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => import("element-plus/es/components/popper").Placement[]) | (() => import("element-plus/es/components/popper").Placement[]) | ((new (...args: any[]) => import("element-plus/es/components/popper").Placement[]) | (() => import("element-plus/es/components/popper").Placement[]))[], unknown, unknown, undefined, boolean>;
    gpuAcceleration: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
    offset: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 12, boolean>;
    placement: import("element-plus/es/utils").EpPropFinalized<StringConstructor, import("element-plus/es/components/popper").Placement, unknown, "bottom", boolean>;
    popperOptions: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => Partial<import("element-plus/es/components/popper").Options>) | (() => Partial<import("element-plus/es/components/popper").Options>) | ((new (...args: any[]) => Partial<import("element-plus/es/components/popper").Options>) | (() => Partial<import("element-plus/es/components/popper").Options>))[], unknown, unknown, () => {}, boolean>;
    strategy: import("element-plus/es/utils").EpPropFinalized<StringConstructor, "fixed" | "absolute", unknown, "absolute", boolean>;
    showAfter: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 0, boolean>;
    hideAfter: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 200, boolean>;
    autoClose: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 0, boolean>;
    "onUpdate:visible": {
        readonly type: import("vue").PropType<(val: boolean) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    role: import("element-plus/es/utils").EpPropFinalized<StringConstructor, "dialog" | "menu" | "grid" | "listbox" | "tooltip" | "tree" | "group" | "navigation", unknown, "tooltip", boolean>;
}, {
    /**
     * @description el-popper component instance
     */
    popperRef: import("vue").Ref<({
        $: import("vue").ComponentInternalInstance;
        $data: {};
        $props: Partial<{
            readonly role: import("element-plus/es/utils").EpPropMergeType<StringConstructor, "dialog" | "menu" | "grid" | "listbox" | "tooltip" | "tree" | "group" | "navigation", unknown>;
        }> & Omit<Readonly<import("vue").ExtractPropTypes<{
            readonly role: import("element-plus/es/utils").EpPropFinalized<StringConstructor, "dialog" | "menu" | "grid" | "listbox" | "tooltip" | "tree" | "group" | "navigation", unknown, "tooltip", boolean>;
        }>> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, "role">;
        $attrs: {
            [x: string]: unknown;
        };
        $refs: {
            [x: string]: unknown;
        };
        $slots: import("vue").Slots;
        $root: import("vue").ComponentPublicInstance | null;
        $parent: import("vue").ComponentPublicInstance | null;
        $emit: (event: string, ...args: any[]) => void;
        $el: any;
        $options: import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
            readonly role: import("element-plus/es/utils").EpPropFinalized<StringConstructor, "dialog" | "menu" | "grid" | "listbox" | "tooltip" | "tree" | "group" | "navigation", unknown, "tooltip", boolean>;
        }>>, {
            triggerRef: import("vue").Ref<import("element-plus/es/components/popper").Measurable | undefined>;
            contentRef: import("vue").Ref<HTMLElement | undefined>;
            popperInstanceRef: import("vue").Ref<import("@popperjs/core").Instance | undefined>;
            referenceRef: import("vue").Ref<import("element-plus/es/components/popper").Measurable | undefined>;
            role: import("vue").ComputedRef<string>;
        }, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, Record<string, any>, string, {
            readonly role: import("element-plus/es/utils").EpPropMergeType<StringConstructor, "dialog" | "menu" | "grid" | "listbox" | "tooltip" | "tree" | "group" | "navigation", unknown>;
        }> & {
            beforeCreate?: (() => void) | (() => void)[];
            created?: (() => void) | (() => void)[];
            beforeMount?: (() => void) | (() => void)[];
            mounted?: (() => void) | (() => void)[];
            beforeUpdate?: (() => void) | (() => void)[];
            updated?: (() => void) | (() => void)[];
            activated?: (() => void) | (() => void)[];
            deactivated?: (() => void) | (() => void)[];
            beforeDestroy?: (() => void) | (() => void)[];
            beforeUnmount?: (() => void) | (() => void)[];
            destroyed?: (() => void) | (() => void)[];
            unmounted?: (() => void) | (() => void)[];
            renderTracked?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
            renderTriggered?: ((e: import("vue").DebuggerEvent) => void) | ((e: import("vue").DebuggerEvent) => void)[];
            errorCaptured?: ((err: unknown, instance: import("vue").ComponentPublicInstance | null, info: string) => boolean | void) | ((err: unknown, instance: import("vue").ComponentPublicInstance | null, info: string) => boolean | void)[];
        };
        $forceUpdate: () => void;
        $nextTick: typeof import("vue").nextTick;
        $watch(source: string | Function, cb: Function, options?: import("vue").WatchOptions): import("vue").WatchStopHandle;
    } & Readonly<import("vue").ExtractPropTypes<{
        readonly role: import("element-plus/es/utils").EpPropFinalized<StringConstructor, "dialog" | "menu" | "grid" | "listbox" | "tooltip" | "tree" | "group" | "navigation", unknown, "tooltip", boolean>;
    }>> & import("vue").ShallowUnwrapRef<{
        triggerRef: import("vue").Ref<import("element-plus/es/components/popper").Measurable | undefined>;
        contentRef: import("vue").Ref<HTMLElement | undefined>;
        popperInstanceRef: import("vue").Ref<import("@popperjs/core").Instance | undefined>;
        referenceRef: import("vue").Ref<import("element-plus/es/components/popper").Measurable | undefined>;
        role: import("vue").ComputedRef<string>;
    }> & {} & import("vue").ComponentCustomProperties & {
        $slots: {
            default?(_: {}): any;
        };
    }) | undefined>;
    /**
     * @description el-tooltip-content component instance
     */
    contentRef: import("vue").Ref<any>;
    /**
     * @description validate current focus event is trigger inside el-tooltip-content
     */
    isFocusInsideContent: (event?: FocusEvent) => boolean | undefined;
    /**
     * @description update el-popper component instance
     */
    updatePopper: () => void;
    /**
     * @description expose onOpen function to mange el-tooltip open state
     */
    onOpen: (event?: Event) => void;
    /**
     * @description expose onOpen function to mange el-tooltip open state
     */
    onClose: (event?: Event) => void;
    /**
     * @description expose hide function
     */
    hide: (event?: Event) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    [x: string]: (...args: any[]) => void;
}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    showArrow: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, boolean, boolean>;
    arrowOffset: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 5, boolean>;
    disabled: BooleanConstructor;
    trigger: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => "click" | "contextmenu" | "focus" | "hover" | import("element-plus/es/element-plus").TooltipTriggerType[]) | (() => import("element-plus/es/utils").Arrayable<import("element-plus/es/element-plus").TooltipTriggerType>) | ((new (...args: any[]) => "click" | "contextmenu" | "focus" | "hover" | import("element-plus/es/element-plus").TooltipTriggerType[]) | (() => import("element-plus/es/utils").Arrayable<import("element-plus/es/element-plus").TooltipTriggerType>))[], unknown, unknown, "hover", boolean>;
    triggerKeys: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string[]) | (() => string[]) | ((new (...args: any[]) => string[]) | (() => string[]))[], unknown, unknown, () => string[], boolean>;
    virtualRef: {
        readonly type: import("vue").PropType<import("element-plus/es/components/popper").Measurable>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    virtualTriggering: BooleanConstructor;
    onMouseenter: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onMouseleave: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onClick: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onKeydown: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onFocus: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onBlur: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    onContextmenu: {
        readonly type: import("vue").PropType<(e: Event) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    id: StringConstructor;
    open: BooleanConstructor;
    ariaLabel: StringConstructor;
    appendTo: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | HTMLElement) | (() => string | HTMLElement) | ((new (...args: any[]) => string | HTMLElement) | (() => string | HTMLElement))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    content: import("element-plus/es/utils").EpPropFinalized<StringConstructor, unknown, unknown, "", boolean>;
    rawContent: BooleanConstructor;
    persistent: BooleanConstructor;
    visible: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => boolean) | (() => boolean | null) | ((new (...args: any[]) => boolean) | (() => boolean | null))[], unknown, unknown, null, boolean>;
    transition: StringConstructor;
    teleported: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
    style: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue) | ((new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    className: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | (() => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | ((new (...args: any[]) => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | (() => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    effect: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => string) | (() => string) | ((new (...args: any[]) => string) | (() => string))[], unknown, unknown, "dark", boolean>;
    enterable: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
    pure: BooleanConstructor;
    focusOnShow: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, false, boolean>;
    trapping: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, false, boolean>;
    popperClass: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | (() => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | ((new (...args: any[]) => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]) | (() => string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | (string | {
            [x: string]: boolean;
        } | any)[])[])[])[])[])[])[])[])[])[])[]))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    popperStyle: {
        readonly type: import("vue").PropType<import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue) | ((new (...args: any[]) => string | import("vue").CSSProperties | import("vue").StyleValue[]) | (() => import("vue").StyleValue))[], unknown, unknown>>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    referenceEl: {
        readonly type: import("vue").PropType<HTMLElement>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    triggerTargetEl: {
        readonly type: import("vue").PropType<HTMLElement>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    stopPopperMouseEvent: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
    zIndex: NumberConstructor;
    boundariesPadding: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 0, boolean>;
    fallbackPlacements: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => import("element-plus/es/components/popper").Placement[]) | (() => import("element-plus/es/components/popper").Placement[]) | ((new (...args: any[]) => import("element-plus/es/components/popper").Placement[]) | (() => import("element-plus/es/components/popper").Placement[]))[], unknown, unknown, undefined, boolean>;
    gpuAcceleration: import("element-plus/es/utils").EpPropFinalized<BooleanConstructor, unknown, unknown, true, boolean>;
    offset: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 12, boolean>;
    placement: import("element-plus/es/utils").EpPropFinalized<StringConstructor, import("element-plus/es/components/popper").Placement, unknown, "bottom", boolean>;
    popperOptions: import("element-plus/es/utils").EpPropFinalized<(new (...args: any[]) => Partial<import("element-plus/es/components/popper").Options>) | (() => Partial<import("element-plus/es/components/popper").Options>) | ((new (...args: any[]) => Partial<import("element-plus/es/components/popper").Options>) | (() => Partial<import("element-plus/es/components/popper").Options>))[], unknown, unknown, () => {}, boolean>;
    strategy: import("element-plus/es/utils").EpPropFinalized<StringConstructor, "fixed" | "absolute", unknown, "absolute", boolean>;
    showAfter: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 0, boolean>;
    hideAfter: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 200, boolean>;
    autoClose: import("element-plus/es/utils").EpPropFinalized<NumberConstructor, unknown, unknown, 0, boolean>;
    "onUpdate:visible": {
        readonly type: import("vue").PropType<(val: boolean) => void>;
        readonly required: false;
        readonly validator: ((val: unknown) => boolean) | undefined;
        __epPropKey: true;
    };
    role: import("element-plus/es/utils").EpPropFinalized<StringConstructor, "dialog" | "menu" | "grid" | "listbox" | "tooltip" | "tree" | "group" | "navigation", unknown, "tooltip", boolean>;
}>>, {
    disabled: boolean;
    content: string;
    offset: number;
    visible: import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => boolean) | (() => boolean | null) | ((new (...args: any[]) => boolean) | (() => boolean | null))[], unknown, unknown>;
    open: boolean;
    placement: import("element-plus/es/utils").EpPropMergeType<StringConstructor, import("element-plus/es/components/popper").Placement, unknown>;
    strategy: import("element-plus/es/utils").EpPropMergeType<StringConstructor, "fixed" | "absolute", unknown>;
    effect: string;
    showAfter: number;
    hideAfter: number;
    autoClose: number;
    role: import("element-plus/es/utils").EpPropMergeType<StringConstructor, "dialog" | "menu" | "grid" | "listbox" | "tooltip" | "tree" | "group" | "navigation", unknown>;
    trigger: import("element-plus/es/utils").EpPropMergeType<(new (...args: any[]) => "click" | "contextmenu" | "focus" | "hover" | import("element-plus/es/element-plus").TooltipTriggerType[]) | (() => import("element-plus/es/utils").Arrayable<import("element-plus/es/element-plus").TooltipTriggerType>) | ((new (...args: any[]) => "click" | "contextmenu" | "focus" | "hover" | import("element-plus/es/element-plus").TooltipTriggerType[]) | (() => import("element-plus/es/utils").Arrayable<import("element-plus/es/element-plus").TooltipTriggerType>))[], unknown, unknown>;
    arrowOffset: number;
    virtualTriggering: boolean;
    boundariesPadding: number;
    fallbackPlacements: import("element-plus/es/components/popper").Placement[];
    gpuAcceleration: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
    popperOptions: Partial<import("element-plus/es/components/popper").Options>;
    enterable: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
    focusOnShow: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
    trapping: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
    stopPopperMouseEvent: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
    pure: boolean;
    triggerKeys: string[];
    teleported: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
    rawContent: boolean;
    persistent: boolean;
    showArrow: import("element-plus/es/utils").EpPropMergeType<BooleanConstructor, unknown, unknown>;
}>;
declare const _default: __VLS_WithTemplateSlots<typeof __VLS_component, ReturnType<typeof __VLS_template>>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
