<template>
<div class="settingBox" :class="show? 'settingBox-show':''">
	<div class="container"> <!--别删！对css样式有用！-->
		<settingOptionVue 
			v-for="(option,index) in options"
			:key="Symbol()"
			:target
			:setOption="option"
			:defaultSetting
			:chooseTarget
			:ref="`option-${index}`"/>
	</div>
</div>
</template>

<script setup lang='ts' generic="T extends SettingTarget,S">
    import { ref,computed } from 'vue';
    import settingOptionVue from './settingOption.vue';
	import { SettingProps, SettingTarget } from './setting';

    const {show=true,target,
		selectTarget=null,
		optionList:setOptionList,
		defaultSetting,
		chooseTarget
	} = defineProps<{
		show?:boolean, //控制显示
	}&SettingProps<T,S>>()

    //暴露一个检测设置项的值的方法
    defineExpose({
		"checkSet":checkSetOption
	})

	//需要显示的设置项
	let options = computed(() => {
		return setOptionList.flatMap((option) => {
			//不需要进行select，或者满足select条件
			if(!option.select){
				return option
			}
			//或者存在select目标，且其满足select条件
			else if(selectTarget && option.select(selectTarget)===true){
				return option
			}
			//或者target满足select条件
			else if(option.select(target)===true){
				return option
			}
			return [];
		});
	});

	// 选项子组件
	const optionRefs:any = computed(()=>{
        return options.value.map((_:any,) => ref(null));
    }) 

	//检查各个设置选项的值是否符合需求
	function checkSetOption(){
		let ifChecked = true
		// 使用 for...of 来循环，检查到第一个不符合的就返回 false
		for (let childRef of optionRefs.value) {
			// 其中任一设置项返回 false 时，立即返回 false
			if (childRef.value && childRef.value.confirmValue() !== true) {
				ifChecked = false;
				break; // 一旦发现不符合要求，停止遍历
			}
		}
		return ifChecked
	}
</script>

<style scoped lang='scss'>
	.settingBox{
		width: 100%;
		overflow: hidden;
		display:grid;
		grid-template-rows:0fr; //初始占用0行
		transition: 500ms ease-in-out;//自行设定动画时间
		.container{
			min-height: 0;
			width: 100%;
		}
	}
	.settingBox-show{
		grid-template-rows:1fr;
	}
</style>