
import { createRouter, createWebHistory } from "vue-router"
import { useAccountStore } from "@/store/account"

const routes = [
  {
    path: "/explore",
    redirect: "/",
  },
  {
    path: "/error",
    name: "error",
    component: () =>
      import(/* webpackChunkName: "error" */ "@/views/ErrorPage"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/error",
  },

  {
    path: "/landing",
    name: "Landing",
    component: () =>
      import(/* webpackChunkName: "landing" */ "@/views/LandingPage"),
  },
  {
    path: "/launch",
    name: "Launch",
    component: () =>
      import(/* webpackChunkName: "launch" */ "@/views/LaunchPage"),
  },

  {
    path: "/",
    name: "Explore",
    component: () =>
      import(/* webpackChunkName: "explore" */ "@/views/ExplorePage"),
  },

  {
    path: "/events",
    name: "Events",
    component: () =>
      import(/* webpackChunkName: "events" */ "@/views/EventsPage"),
  },
  {
    path: "/events/top",
    name: "TopEvents",
    component: () =>
      import(/* webpackChunkName: "topevents" */ "@/views/TopEventsPage"),
  },
  {
    path: "/events/:id",
    name: "Event",
    component: () =>
      import(/* webpackChunkName: "event" */ "@/views/EventPage"),
  },
