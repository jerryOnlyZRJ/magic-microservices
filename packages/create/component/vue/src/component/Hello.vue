<script>
export default {
  props: ['name', 'count'],
};
</script>

<template>
  <p>Hello {{ name }}! {{ count }}</p>
</template>

<style scoped>
p {
  background: #4fc08d;
  font-size: 16px;
  text-align: center;
}
</style>
