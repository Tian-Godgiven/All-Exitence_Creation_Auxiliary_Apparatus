<template>
    <div class="container">

        <div class="top">
            <div class="targetTitle" >
                <textAreaVue
                    mode="string"
                    placeholder="输入标题"
                    v-model="article.title"
                    :inputSupport="true">
                </textAreaVue>
            </div>
        </div>
        
        <div class="targetInner">
            <textAreaVue 
                class="articleText"
                inputSuggestionList="all"
                v-model="article.inner"
                :inputSupport="true"> 
            </textAreaVue>
        </div>

        <div class="targetInfo">字数: {{textNum}}</div>
    </div>
</template>

<script setup lang='ts'>
    import { computed } from 'vue';
    import textAreaVue from '@/components/other/textArea/textArea.vue';
    import { translateToTextContent } from '@/hooks/expression/textAreaContent';
    const {article} = defineProps(["article"])
    // 内容栏字符数量
	let textNum = computed(()=>{
        const inner = translateToTextContent(article.inner)
		return inner.length
	})
</script>

<style scoped lang='scss'>
    @use "@/static/style/mainPage.scss";
    .container{
        @extend .targetContainer;
        .targetTitle{
            text-align: center;
        }
        .targetInner{
            .articleText{
                :deep(.textArea){
                    min-height: 40%;
                    padding-bottom: 100%;
                    height: auto;
                }
            }
        }
    }
</style>