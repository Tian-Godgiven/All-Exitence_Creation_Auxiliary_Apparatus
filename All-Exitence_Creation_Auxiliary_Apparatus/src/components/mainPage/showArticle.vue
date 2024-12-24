<template>
    <div class="container">

        <div class="top">
            <div class="targetTitle" >
                <textAreaVue
                    placeholder="输入标题"
                    v-model="article.title"
                    :inputSupport="true">
                </textAreaVue>
            </div>
        </div>
        
        <div class="targetInner">
            <textAreaVue 
                class="articleText"
                :inputSuggestionList="inputSuggestionList"
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
    import { inputSuggestionList } from '@/hooks/inputSupport/inputSuggestion/inputSuggestion';
    const article = defineModel<any>()
    // 内容栏字符数量
	let textNum = computed(()=>{
		return article.value.inner.length
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