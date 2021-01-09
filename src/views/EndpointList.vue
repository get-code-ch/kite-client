<template>
  <h1>Endpoints</h1>
  <div class="endpoints">
    <Endpoint
      v-for="endpoint in endpoints"
      :key="endpoint.name"
      :endpoint="endpoint"
    />
  </div>
  <div class="footer" v-bind:class="[connected ? 'enabled' : 'disabled']">
    {{ message }}
  </div>
</template>

<script>
import { onMounted } from "vue";
import Endpoint from "@/components/Endpoint.vue";
import endpointService from "@/services/EndpointService";

export default {
  name: "EndpointList",
  components: {
    Endpoint
  },
  setup() {
    onMounted(() => {
      newConnection();
    });

    const { newConnection, endpoints, connected, message } = endpointService();
    return { endpoints, connected, message };
  }
};
</script>

<style scoped>
.endpoints {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
