<template>
  <h1>Endpoints</h1>
  <div class="endpoints">
    <Endpoint
      v-for="endpoint in endpoints"
      :key="endpoint.name"
      :endpoint="endpoint"
      :id="id++"
    />
  </div>
  <div class="footer" v-bind:class="[connected ? 'enabled' : 'disabled']">
    {{ message }}
  </div>
</template>

<script>
import { onMounted } from "vue";
import Endpoint from "@/components/Endpoint.vue";
import ConfigurationService from "@/services/ConfigurationService";
import endpointService from "@/services/EndpointService";

export default {
  name: "EndpointList",
  components: {
    Endpoint
  },
  setup() {
    let conf = ConfigurationService.getConfiguration();
    let id = 1;

    onMounted(() => {
      newConnection(conf.address);
    });

    const { newConnection, endpoints, connected, message } = endpointService(
      conf
    );
    return { endpoints, connected, message, id };
  }
};
</script>

<style scoped>
.endpoints {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
@media (max-width: 550px) {
  .endpoints {
    flex-direction: column;
    align-items: center;
  }
}
</style>
