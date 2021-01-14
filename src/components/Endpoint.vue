<template>
  <div
    class="endpoint"
    :class="value ? 'on' : 'off'"
    @click="endpointClicked(endpoint)"
  >
    <!-- Display endpoint data -->
    <p>
      <span v-if="address">{{ address?.id }} - </span>{{ endpoint.description }}
    </p>
    <!--
    <p>{{ endpoint.ic.description }}</p>
    <p>{{ endpoint.attributes.mode }}</p>
     -->
    <p>{{ value }}</p>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import endpointService from "@/services/EndpointService";
import { onMounted } from "vue";
import ConfigurationService from "@/services/ConfigurationService";
export default {
  name: "Endpoint",
  props: {
    endpoint: Object,
    idx: null
  },
  setup(props) {
    let conf = ConfigurationService.getConfiguration();

    let address = {
      domain: conf.address.domain,
      type: conf.address.type,
      host: conf.address.host,
      address: conf.address.address,
      id: props.idx + ""
    };

    onMounted(() => {
      newConnection(address, props.endpoint.address);
    });

    function endpointClicked(endpoint) {
      readValue(address, endpoint);
    }

    const {
      newConnection,
      readValue,
      endpoints,
      connected,
      message,
      value
    } = endpointService(conf);

    return {
      endpoints,
      connected,
      message,
      value,
      address,
      endpointClicked
    };
  }
};
</script>

<style scoped>
p {
  font-size: 0.8em;
  line-height: 1em;
}
.endpoint {
  border: 1px solid #2c3e50;
  width: 250px;
  height: 100px;
  box-sizing: border-box;
  margin: 0.25em;
}

.on {
  background-color: seagreen;
  color: lightgray;
}

.off {
  background-color: lightcoral;
  color: lightgray;
}

@media (max-width: 550px) {
  .endpoint {
    width: 90%;
    height: 100px;
    box-sizing: border-box;
    margin: 0.25em;
  }
}

.endpoint:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
</style>
