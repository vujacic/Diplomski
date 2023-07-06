import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Content from '../views/Content'
import ContentList from "../components/ContentList";
import Menu from "../views/Menu";
import MenuCreate from "../views/MenuCreate";
import Login from "../views/Login";
import Categories from "../views/Categories";
import Options from "../views/Options";

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
    path: '/content/:type/:slug',
    name: 'Content',
    component: Content
  },
  {
    path: '/content/:type',
    name: 'ContentCreate',
    component: Content
  },
  {
    path: '/list/:type',
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
    component: MenuCreate,
    title: 'Menus'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/site-settings',
    name: 'Options',
    component: Options
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach( (to) => {
  if(!sessionStorage.getItem('token') && to.name != 'Login'){
    return '/login';
  }

})

export default router
