<template>
<div class="chooseList">
    <SwitchExpand class="type" v-for="type in list">
        <template #title>
            <ChooseInNode :item="type">
                <slot name="typeNode" :type="type">
                    {{ type.name }}
                </slot>
            </ChooseInNode>
        </template>
        <template #inner>
            <div v-for="child in type.child">
                <!-- 是分组：若启用分组功能 -->
                <SwitchExpand v-if="ifGroup && 'child' in child" class="group">
                    <template #title>
                        <ChooseInNode :item="child" :parent="type">
                            <slot name="groupNode" :group="child" :type>
                                {{ child.name }}
                            </slot>
                        </ChooseInNode>
                    </template>
                    <template #inner>
                        <ChooseInNode v-for="exitence in child.child" :item="exitence" :parent="child">
                            <slot name="exitenceNode" :exitence :type>
                                {{ exitence.name }}
                            </slot>
                        </ChooseInNode>
                    </template>
                </SwitchExpand>
                <!-- 是分组：但不启用分组功能,直接显示其中的事物 -->
                <template v-if="!ifGroup && 'child' in child">
                    <ChooseInNode v-for="exitence in child.child" :item="exitence" :parent="child">
                        <slot name="exitenceNode" :exitence :type>
                            {{ exitence.name }}
                        </slot>
                    </ChooseInNode>
                </template>
                <!-- 没有在分组中的部分 -->
                <ChooseInNode v-else-if="!('child' in child)"
                    :parent="type"
                    :item="child">
                    <slot name="exitenceNode" :exitence="child" :type>
                        {{ child.name }}
                    </slot>
                </ChooseInNode>
            </div>
        </template>
    </SwitchExpand>
</div>
</template>

<script setup lang='ts' generic="ExitenceData,GroupData,TypeData">
    import SwitchExpand from '../SwitchExpand.vue';
    import ChooseInNode from '../chooseInTree/ChooseInNode.vue';
    import {TypeDataInTree } from './chooseExitenceInTree';

    const {list,ifGroup} = defineProps<{
        list:TypeDataInTree<ExitenceData,GroupData,TypeData>[],
        exitenceData?:ExitenceData,
        groupData?:GroupData,
        typeData?:TypeData,
        ifGroup:boolean,//是否启用分组，若为否则返回结果中不包含分组内容
    }>()
</script>

<style scoped lang='scss'>
.chooseList{
    width: 100%;
    height: 100%;
}
</style>