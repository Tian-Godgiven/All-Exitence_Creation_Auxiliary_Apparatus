<template>
    <div class="createExitence">
        <div class="top">
            <downLineInputVue 
				v-model="name"
				class="exitenceName"
				placeholder="输入事物名称"/>
        </div>

        <div class="inner">
            <div class="tags">
                <div class="text">标签：</div>
                <tagsValueVue v-model="tags"/>
            </div>

            <div class="setting">
                <div class="text">设置：</div>
                <div></div>
            </div>
        </div>
        
        <div class="buttons">
            <div class="button" @click="confirm">确认</div>
            <div class="button" @click="closePopUp(popUp)">取消</div>
        </div>
    </div>
</template>

<script setup lang='ts'>
    import { reactive, ref, toRaw } from 'vue';
    import downLineInputVue from '@/components/other/input/downLineInput.vue';
    import { closePopUp } from '@/hooks/pages/popUp';
    import { addExitence } from '@/hooks/all-exitence/allExitence';
    import tagsValueVue from '@/components/all-exitence/status/statusValue/tagsValue.vue';
    const {props, popUp, returnValue} = defineProps(["props","popUp","returnValue"])
    const name = ref("")
    const tags = reactive([])
    const type = props.type

    //确认创建
    function confirm(){
        const exitence = addExitence(type,name.value,toRaw(tags))
        returnValue(exitence)
        closePopUp(popUp)
    }
</script>

<style scoped lang='scss'>
    @use "@/static/style/components/popUpButtons.scss";
    .createExitence{
        .top{
            display: flex;
		    height: 100px;
		    position: relative;
            .exitenceName{
                position: relative;
                top:-20px;
                margin-top:auto;
                font-size: 1.4rem;
                width: 550px;
                height: 60px;
            }
        }
        .inner{
            width: 100%;
            height: calc(100% - 200px);
            overflow: auto;
            >div{
                display: flex;
                >.text{
                    flex-shrink: 0;
                }
            }
        }
        
    }
    .buttons{
        @extend .buttons
    }
</style>