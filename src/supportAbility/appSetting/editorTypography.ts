export const editorFontOptions = [
    { label: "微软雅黑", value: "microsoft-yahei" },
    { label: "宋体", value: "simsun" },
    { label: "楷体", value: "kaiti" },
    { label: "等线", value: "dengxian" },
]

const fontFamilies:Record<string, string> = {
    "microsoft-yahei": "'Microsoft YaHei', sans-serif",
    simsun: "SimSun, serif",
    kaiti: "KaiTi, serif",
    dengxian: "DengXian, sans-serif",
}

export function getEditorFontFamily(value: unknown):string {
    return fontFamilies[typeof value === "string" ? value : ""] ?? fontFamilies["microsoft-yahei"]
}

export function normalizeEditorFontSize(value: unknown):number {
    const size = Number(value)
    return Number.isFinite(size) ? Math.min(72, Math.max(10, Math.round(size))) : 16
}
