<template>
  <!-- 点击切换点亮或熄灭的按钮 -->
  <div class="ring" @click="switchRadio()">
    <svg class="radio" width="40px" height="40px" viewBox="0 0 40 40">
      <!-- 圆形外环 -->
      <circle cx="20" cy="20" r="18" stroke="black" stroke-width="3" fill="transparent"/>
      <!-- 圆形内部 -->
      <circle cx="20" cy="20" r="12" :fill="value? 'black':'transparent'"/>
    </svg>
  </div>
</template>

<script setup lang="ts">

    let value:any = defineModel()
	  // 默认为false
	  if(!value.value){
		    value.value = false
	  }
	  const emits = defineEmits(["change"])
	  function switchRadio() {
		  value.value = !value.value
		  emits('change', value.value)
	  }
</script>

<style lang="scss" scoped>
  .ring {
	flex-shrink: 0;
	padding: 5px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  }

  .radio {
    cursor: pointer;
  }
</style>
