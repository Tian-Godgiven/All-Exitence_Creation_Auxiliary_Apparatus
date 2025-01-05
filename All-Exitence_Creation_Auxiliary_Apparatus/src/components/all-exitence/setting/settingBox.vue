<template>
    <!-- 设置箱，显示时会自动展开 -->
    <div class="settingBox" :class="show? 'settingBox-show':''">
		<div class="container"> <!--别删！对css样式有用！-->
			<settingOptionVue 
				v-for="(option,index) in options" 
				:setOption="option"
				:ref="`option-${index}`"/>
		</div>
    </div>
</template>

<script setup lang='ts'>
    import { ref,computed, inject } from 'vue';
    import settingOptionVue from './settingOption.vue';
    import { SettingOption } from '@/interfaces/SettingOption';
    //控制显示,
    const {show=true} = defineProps(["show"])
    //设置目标,筛选目标,设置项表
	const settingProps = inject<any>("settingProps",null)
	if(!settingProps){
		console.error(`传递的设置变量不可用:${settingProps}`)
	}

    let {target,selectTarget=null,optionList} = settingProps
    //请确保筛选目标是一个computed或ref对象
    if(!selectTarget){
        selectTarget = computed(()=>target)
    }

    //暴露一个检测设置项的值的方法
    defineExpose({
		"checkSet":checkSetOption
	})

	//需要显示的设置项
	let options = computed(()=>{
		const tmp = optionList.reduce((acc:any,option:SettingOption)=>{
			//满足该设置项的select需求或者该设置项不具备select
			if(!option.select || option.select(selectTarget.value) == true){
				acc.push(option)
			}
			return acc
		},<any[]>[])
		return tmp
	})

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