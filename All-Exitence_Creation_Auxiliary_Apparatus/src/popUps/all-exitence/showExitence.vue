<template>
    <div class="container">
        <div class="top">
            <div class="targetTitle">
                <div>{{ exitence.name }}</div>
            </div>
            <div class="buttons">
                <div class="button" @click="clickJumpToExitence">跳转至事物</div>
            </div>
        </div>
        <div class="targetInner" ref="inner">
            <exitenceStatusVue 
                :disabled="true"
				v-for="(,index) in exitence.status" 
				v-model:status="exitence.status[index]">
			</exitenceStatusVue>

			<div class="scrollSpace"></div>
        </div>
    </div>
</template>

<script setup lang='ts'>
import { provide} from 'vue';
import exitenceStatusVue from '@/components/popUps/all-exitence/exitence/exitenceStatus.vue';
import { showExitenceOnMain } from '@/hooks/pages/mainPage/showOnMain';
import { closePopUp } from '@/hooks/pages/popUp';
    const {props,popUp} = defineProps(["props","popUp","returnValue"])
    const {type,exitence} = props
    provide("type",type)//提供该事物所在的分类
	provide("allStatus",exitence.status)//提供所有属性
	provide("allTypeStatus",type.typeStatus)//提供所在的分类的所有属性

    function clickJumpToExitence(){
        closePopUp(popUp)
        showExitenceOnMain(exitence)
    }
</script>

<style scoped lang='scss'>
	@use "@/static/style/mainPage.scss";
    .container{
        position: relative;
        @extend .targetContainer;
        .top{
            padding-top: 0;
        }
		.targetTitle{
            > div{
                width: 100%;
			    text-align: left;
            }
            
		}
		.targetInner{
			.scrollSpace{
				width: 100%;
				height: 30%;
			}
		}
    }
</style>