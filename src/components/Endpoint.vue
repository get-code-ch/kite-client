<template>
  <!-- :class="value ? 'on' : 'off'" -->
  <div
    class="endpoint"
    :class="endpointClass(endpoint, value)"
    @click="endpointClicked(endpoint)"
  >
    <!-- Display endpoint data -->
    <p>
      {{ endpoint.description }}
    </p>
    <p :hidden="typeof value === 'boolean'">{{ value }}</p>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import endpointService from "@/services/EndpointService";
import { onMounted, onBeforeMount, onUpdated } from "vue";
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

    onBeforeMount(() => {
      newConnection("item", address, props.endpoint.address);
    });

    onMounted(() => {
      console.log("Mounted for -> ", address);
    });

    onUpdated(() => {
      console.log(props.endpoint?.description + " updated");
    });

    function endpointClicked(endpoint) {
      if (
        endpoint.attributes.clickable !== undefined &&
        !endpoint.attributes.clickable
      ) {
        return;
      }
      switch (endpoint.attributes?.mode) {
        case "output":
          sendEvent(address, endpoint.name, "cmd", "reverse");
          break;
        case "input":
        case "value":
          readValue(address, endpoint);
          break;
        case "event":
          sendEvent(
            address,
            endpoint.attributes?.to,
            endpoint.attributes?.action,
            endpoint.attributes?.data
          );
          break;
        default:
          console.log(
            "no action configured fro this mode -->" + endpoint.attributes?.mode
          );
      }
    }

    function endpointClass(endpoint, value) {
      //console.log(endpoint + " " + value);

      let notClickable = "";
      if (
        endpoint.attributes.clickable !== undefined &&
        !endpoint.attributes.clickable
      ) {
        notClickable = "not-clickable";
      }

      switch (endpoint.attributes?.mode) {
        case "output":
        case "input":
          return (value ? "on" : "off") + " " + notClickable;
        default:
          return endpoint.attributes?.mode + " " + notClickable;
      }
    }

    const {
      newConnection,
      readValue,
      sendEvent,
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
      endpointClicked,
      endpointClass,
      sendEvent
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
  border: none;
  width: 200px;
  height: 90px;
  box-sizing: border-box;
  margin: 0.25em;
}

@media (max-width: 550px) {
  .endpoint {
    width: 90%;
    height: 70px;
    box-sizing: border-box;
    margin: 0.25em;
  }
  p {
    font-size: 0.8em;
    line-height: 1em;
  }
}

/*
.endpoint:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
*/

.on {
  background-color: seagreen;
  color: lightgray;
}

.off {
  background-color: lightcoral;
  color: lightgray;
}

.value {
  background-color: lightgray;
  color: seagreen;
}

.event {
  background-color: dodgerblue;
  color: honeydew;
}

.not-clickable {
  border-radius: 5px;
}

.undefined {
  visibility: hidden;
}
</style>
