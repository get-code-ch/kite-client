<template>
  <div class="clientsetup">
    <h1>Kite - Client setup</h1>
    <div class="form">
      <!-- Display endpoint data -->

      <label>Server</label>
      <input
        v-bind="$attrs"
        v-model="server"
        placeholder="Server IP or DNS name"
        class="field"
      />
      <label>Port</label>
      <input
        v-bind="$attrs"
        v-model="port"
        class="field"
        placeholder="Server port"
      />
      <label>Ssl</label>
      <input type="checkbox" v-model="ssl" class="field" />

      <label>Domain</label>
      <input
        v-bind="$attrs"
        v-model="address.domain"
        @input="addressToName()"
        class="field"
        placeholder="Domain"
      />

      <label>Host</label>
      <input
        v-bind="$attrs"
        v-model="address.host"
        @input="addressToName()"
        class="field"
        placeholder="This device hostname"
      />

      <label>Description</label>
      <input
        v-bind="$attrs"
        v-model="description"
        class="field"
        placeholder="Description of this device"
      />
      <div>
        <button @click="saveBtnClick()">save</button>
        <button v-if="enabled" @click="cancelBtnClick()">cancel</button>
      </div>
    </div>
  </div>
  <div class="footer">{{ name }} - {{ api_key }}</div>
</template>

<script>
import { reactive, toRefs } from "vue";
import ConfigurationService from "@/services/ConfigurationService";

export default {
  name: "ClientSetup",
  setup() {
    const configuration = reactive({
      name: "",
      description: "",
      api_key: ConfigurationService.apiKeyGenerator(30),
      server: "",
      port: 443,
      ssl: true,
      enabled: true,
      address: {
        id: "*",
        address: ConfigurationService.uUIDGenerator(),
        host: "",
        type: "browser",
        domain: ""
      }
    });

    function addressToName() {
      configuration.name =
        configuration.address.domain +
        "." +
        configuration.address.type +
        "." +
        configuration.address.host +
        "." +
        configuration.address.address +
        "." +
        configuration.address.id;
    }

    function saveBtnClick() {
      configuration.enabled = true;
      ConfigurationService.saveConfiguration(configuration);
      location.href = "/";
    }

    function cancelBtnClick() {
      location.href = "/";
    }

    const loadConf = ConfigurationService.getConfiguration();
    if (loadConf !== null) {
      configuration.name = loadConf.name;
      configuration.api_key = loadConf.api_key;
      configuration.port = loadConf.port;
      configuration.server = loadConf.server;
      configuration.description = loadConf.description;
      configuration.address = loadConf.address;
      configuration.enabled = loadConf.enabled;
      configuration.ssl = loadConf.ssl;
    }

    return {
      ...toRefs(configuration),
      addressToName,
      saveBtnClick,
      cancelBtnClick
    };
  }
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 300px;
  cursor: pointer;
  background-color: darkgray;
  border-radius: 20px;
  margin-bottom: 18px;
}

label,
input {
  display: inline-flex;
  font-family: "Open sans", sans-serif;
  font-size: 90%;
  line-height: 1.15;
  margin: 0;
  color: #303030;
}

label {
  color: lightgray;
  font-weight: 500;
}

::placeholder {
  color: lightcoral;
}

input {
  overflow: visible;
}

.field {
  margin-bottom: 4px;
}
</style>
