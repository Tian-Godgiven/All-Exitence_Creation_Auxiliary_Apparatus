<template>
<div class="search">
    <div class="input">
        <DownLineInput :clear="true" v-model="input" placeholder="输入搜索内容"></DownLineInput>
        <Button name="搜索" @click="clickSearch"></Button>
    </div>
    <div class="setting">
        <div class="option">
            <Button @click="chooseRange('nowProject')">
                <div class="choice"><Icon v-show="range=='nowProject'" icon="check"></Icon>当前项目</div>
            </Button>
            <Button @click="chooseRange('allProject')">
                <div class="choice"><Icon v-show="range=='allProject'" icon="check"></Icon>所有项目</div>
            </Button>
        </div>
        <div class="option">搜索对象：
            <div>事物<input v-model="target" value="exitence" type="checkbox"></div>
            <div>文本<input v-model="target" value="article" type="checkbox"></div>
        </div>
    </div> 
    <ScrollBar class="result">
        <div class="noResult" v-if="result.length==0">无结果</div>
        <div v-else>
            <div v-for="item in result">
                <Button @click="clickItem(item)" class="item"  :key="Symbol()">
                    <div class="projectTitle" v-if="item.projectTitle">
                        《{{ item.projectTitle }}》
                    </div>
                    <div class="title">
                        <Icon :icon="item.type"></Icon>
                        {{ item.title }}
                    </div>
                    <div class="preview">{{ item.preview }}</div>
                </Button>
                <Separator></Separator>
            </div>
        </div>
    </ScrollBar>
</div>
</template>

<script setup lang='ts'>
    import DownLineInput from '@/components/other/input/downLineInput.vue';
    import Button from '@/components/global/Button.vue';
    import Icon from '@/components/global/Icon.vue';
    import { hideSearchPopUp, input, range, result, searchAt, SearchResult, target } from '../search';
    import { focusOnExitence } from '@/hooks/all-exitence/allExitence';
    import { focusOnArticle } from '@/hooks/all-articles/allArticles';
import Separator from '@/app/pages/leftPage/components/Separator.vue';
import ScrollBar from '@/components/global/ScrollBar.vue';
    //选择搜索范围
    function chooseRange(input:"nowProject"|"allProject"){
        range.value = input
    }
    //点击搜索,获取搜索结果,显示在搜索结果中
    async function clickSearch(){
        result.value  = await searchAt(input.value,target.value,range.value)
    }
    //点击搜索结果
    function clickItem(item:SearchResult){
        //聚焦到对应类型的元素上
        if(item.type=="exitence"){
            focusOnExitence(item.target,false)
        }
        else{
            focusOnArticle(item.target,false)
        }
        //隐藏搜索页面
        hideSearchPopUp()
    }
</script>

<style scoped lang='scss'>
.search{
    display: flex;
    flex-direction: column;
}
.input{
    display: flex;
    padding-bottom: 10px;
    .downLineInput{
        font-size: $fontSize20;
        flex-grow: 1;
        margin-right: 15px;
    }
    .button{
        flex-shrink: 0;
        width: 20%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        border-radius: $buttonRadio;
        border: $buttonBorder;
        padding: 5px 20px;
    }
}
.setting{
    .option{
        display: flex;
        .button{
            margin:0 10px;
            border-radius: 30px;
            background-color: $bgColor85;
            padding: 5px 20px;
            .choice{
                display: flex;
                align-items: center;
                justify-content: center;
            }
        }
        .icon{
            width: 40px;
            height: 40px;
        }
    }
}
.result{
    margin-top: 9px;
    width: 100%;
    flex-grow: 1;
    .noResult{
        font-style: italic;
        color: $bgColor40;
        height: 100px;
        width: 100%;
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: center;
    }
    .item{
        padding: 10px 0;
        .projectTitle{
            font-weight: bold;
        }
        .title{
            display: flex;
            align-items: center;
            color: $antiBgColor;
            font-size: $fontSize1;
            .icon{
                height: 1rem;
                width: 1rem;
            }
        }
        .preview{
            font-size: 0.8rem;
            color: $previewText;
        }
    }
}
</style>