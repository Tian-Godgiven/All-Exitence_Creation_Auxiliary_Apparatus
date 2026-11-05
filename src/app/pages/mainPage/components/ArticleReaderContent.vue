<template>
    <template v-if="paragraphs">
        <template v-for="(block,index) in blocks" :key="index">
            <ArticleReaderNode v-if="isParagraphEffect(block)" :node="block" />
            <div v-else class="articleParagraph"><ArticleReaderContent :content="block" /></div>
        </template>
    </template>
    <template v-else>
        <template v-for="(item,index) in content" :key="index">
            <br v-if="item === '\n'" />
            <ArticleReaderNode v-else-if="isTextStyleData(item)" :node="item" />
            <span v-else>{{ text(item) }}</span>
        </template>
    </template>
</template>

<script setup lang="ts">
import { computed } from "vue"
import type { TextAreaContent, TextStyleData } from "@/hooks/expression/textAreaContent"
import { isTextStyleData } from "@/hooks/expression/textAreaContent"
import { toString } from "lodash"
import ArticleReaderNode from "./ArticleReaderNode.vue"

const { content, paragraphs = false } = defineProps<{ content: TextAreaContent[], paragraphs?: boolean }>()
const blocks = computed(() => {
    const result:(TextAreaContent[] | TextStyleData)[] = []
    let paragraph:TextAreaContent[] = []
    const push = () => { result.push(paragraph); paragraph = [] }
    content.forEach(item => {
        if(item === "\n"){ push(); return }
        if(isParagraphEffect(item)){
            if(paragraph.length)push()
            result.push(item)
            return
        }
        paragraph.push(item)
    })
    if(paragraph.length || !result.length)push()
    return result
})
function isParagraphEffect(value:unknown): value is TextStyleData { return isTextStyleData(value) && value.scope === "paragraph" }
function text(value:Exclude<TextAreaContent,TextStyleData>){ return typeof value === "string" ? value : toString((value as any).text ?? "") }
</script>
