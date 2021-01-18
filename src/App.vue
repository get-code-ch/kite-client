<template>
  <div v-if="!conf.enabled">
    <div class="clientsetup">
      <ClientSetup />
    </div>
  </div>
  <div v-else>
    <div id="nav">
      <router-link to="/">Endpoints</router-link>
      |
      <router-link to="/about">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
import ConfigurationService from "@/services/ConfigurationService";
import ClientSetup from "@/components/ClientSetup";
import { ref } from "vue";

export default {
  components: {
    ClientSetup
  },
  setup() {
    let conf = ref(null);
    conf = ConfigurationService.getConfiguration();
    return { conf };
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  text-decoration: none;
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
.clientsetup {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 20px;
  background-color: lightgray;
  color: #303030;
  font-size: 80%;
  text-align: center;
  padding: 3px;
}

.enabled {
  background-color: seagreen;
  color: lightgray;
}

.disabled {
  background-color: lightcoral;
  color: lightgray;
}
</style>
