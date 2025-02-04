const vClickOutside = {
  beforeMount (el:any, binding:any) {
    el.clickOutsideEvent = (event:Event) => {
      // 检查点击是否在el之外
      if (!(el).contains(event.target)) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted (el:any) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

export default vClickOutside;
