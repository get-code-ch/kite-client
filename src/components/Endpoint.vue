<template>
  <div class="endpoint">
    <!-- Display endpoint data -->
    <span>{{ endpoint.name }}</span>
    <p>{{ endpoint.description }}</p>
  </div>
</template>

<script>
export default {
  name: "Endpoint",
  props: {
    endpoint: Object
  }
};
</script>

<style scoped>
.endpoint {
  padding: 20px;
  width: 250px;
  cursor: pointer;
  border: 1px solid #2c3e50;
  margin-bottom: 18px;
}

.endpoint:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
</style>
