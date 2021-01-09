import { createRouter, createWebHistory } from "vue-router";
import EndpointList from "../views/EndpointList.vue";
import ClientSetup from "@/components/ClientSetup.vue";
import About from "../views/About.vue";

const routes = [
  {
    path: "/",
    name: "EndpointList",
    component: EndpointList
  },
  {
    path: "/about",
    name: "About",
    component: About
  },
  {
    path: "/setup",
    name: "Setup",
    component: ClientSetup
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
