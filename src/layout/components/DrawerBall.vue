<template>
  <div class="drawer-ball" @click="$emit('update:visible', true)">
<!--    <div class="drawer-ball__number-label">0</div> -->
    <div class="drawer-ball__word">
      <p>任务</p>
      <p>管理</p>
    </div>
    <div class="drawer-ball__icon"></div>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style>
</style>
