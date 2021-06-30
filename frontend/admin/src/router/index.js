import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Content from '../views/Content'
import ContentList from "../components/ContentList";
import Menu from "../views/Menu";
import MenuCreate from "../views/MenuCreate";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/content/:slug',
    name: 'Content',
    component: Content
  },
  {
    path: '/content',
    name: 'ContentCreate',
    component: Content
  },
  {
    path: '/content-list',
    name: 'ContentList',
    component: ContentList
  },
  {
    path: '/menu/:slug',
    name: 'Menu',
    component: Menu
  },
  {
    path: '/menu',
    name: 'MenuList',
    component: MenuCreate
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
