<template>
  <!-- 点击切换点亮或熄灭的按钮 -->
  <label class="radioControl" @click="switchRadio()">
    <span class="ring">
    <svg class="radio" viewBox="0 0 40 40">
      <!-- 圆形外环 -->
      <circle cx="20" cy="20" r="18" stroke="black" stroke-width="3" fill="transparent"/>
      <!-- 圆形内部 -->
      <circle cx="20" cy="20" r="12" :fill="value? 'black':'transparent'"/>
    </svg>
    </span>
    <span v-if="text" class="text">{{ text }}</span>
  </label>
</template>

<script setup lang="ts">

    let value:any = defineModel()
	  // 默认为false
	  if(!value.value){
		    value.value = false
	  }
	  const emits = defineEmits(["change"])
	  defineProps<{text?:string}>()
	  function switchRadio() {
		  value.value = !value.value
		  emits('change', value.value)
	  }
</script>

<style lang="scss" scoped>
  .radioControl {
	display: inline-flex;
	align-items: center;
	width: fit-content;
	max-width: 100%;
	cursor: pointer;
  }
  .ring {
	flex: 0 0 auto;
    padding: 4px;
    width: calc(1.2em + 8px);
    height: calc(1.2em + 8px);
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  }
  .text { flex: 0 0 auto; }
</style>
