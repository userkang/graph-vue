<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ message }}</p>
  </div>
</template>

<script>
// import { defineComponent } from 'vue-demi'

export default{
  data() {
    return {
      title: 'Hello World!',
      message: 'Welcome to my app'
    }
  }
}
</script>
