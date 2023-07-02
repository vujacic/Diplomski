<template>
  <div id="app">
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link> |-->
<!--      <router-link to="/content">Content</router-link> |-->
<!--      <router-link to="/content-list">List</router-link>-->
<!--    </div>-->


    <div class="container-fluid">
      <div class="row" v-if="$route.path != '/login'">
        <div class="col col-md-2">
<!--          <PanelMenu :model="items"></PanelMenu>-->
          <PanelMenu :model="items" @click="highlight($event)">
<!--            <template #default="{item}">-->
<!--              <router-link :to="item.to">{{item.label}}</router-link>-->
<!--            </template>-->
          </PanelMenu>
        </div>
        <div class="col-10">
          <Card class="p-x-1">
            <template #content>
              <router-view :key="$route.path"/>
            </template>
          </Card>
        </div>
      </div>

      <div v-else class="row vh-100 align-items-center" >
        <Card class="offset-sm-4 col-sm-4 offset-xxl-5 col-xxl-2 ">
          <template #header>
            <h1>Login</h1>
          </template>
          <template #content>
            <router-view :key="$route.path"/>
          </template>
        </Card>
      </div>


    </div>
    <ProgressSpinner strokeWidth='5' v-if="loading" class="position-fixed top-50 start-50 translate-middle" animationDuration='5s'></ProgressSpinner>
    <Toast position="top-right" />
  </div>
</template>
<script>
import ProgressSpinner from "primevue/progressspinner";
import Toast from "primevue/toast";
import PanelMenu from "primevue/panelmenu"
import Card from "primevue/card";
export default {
  name: 'App',
  components: {
    ProgressSpinner,
    Toast,
    PanelMenu,
    Card
  },
  data() {
    return {
      items:[
        {
          label: 'Home',
          icon: 'pi pi-fw pi-home',
          to: '/'
        },
        {
          label: 'Posts',
          // to: '/content-list',
          items: [
            {
              label: 'View Posts',
              to: '/list/post'
            },
            {
              label: 'New Post',
              to: '/content/post'
            },
            {
              label: 'Categories',
              to: '/categories'
            }
          ]
        },
        {
          label: 'Pages',
          // to: '/content-list',
          items: [
            {
              label: 'View Pages',
              to: '/list/page'
            },
            {
              label: 'New Page',
              to: '/content/page'
            }
          ]
        },
        // {
        //   label: 'Media',
        //   to: '/media'
        // },
        {
          label: 'Menu',
          to: '/menu'
        },
        // {
        //   label: 'Users',
        //   to: '/users'
        // },
        {
          label: 'Site settings',
          to: '/site-settings'
        },
        {
          label: 'About',
          to: '/about',
        },
        {
          label: 'Users',
          class: 'customLogout',
          items: [
            {
              label: 'Manage users',
              // to: '/users'
            },
            {
              label: 'Logout',
              command: () => {
                sessionStorage.removeItem('token');
                location.reload();
              }
            }
          ]
        }
      ],
      lastMenuItem: null
    }
  },
  computed: {
    loading(){
      return this.$store.state.loading;
    }
  },
  methods:{
    highlight(event){
      if(this.lastMenuItem){
        this.lastMenuItem.forEach(x => {
          if(x.classList){
            x.classList.toggle('router-link-exact-active');
          }
        });
      }
      if(event.target.localName == 'a')
        this.lastMenuItem = event.target.childNodes;
      else
        this.lastMenuItem = event.target.parentElement.childNodes;

      this.lastMenuItem.forEach(x =>{
        if(x.classList){
          x.classList.toggle('router-link-exact-active');
        }

      });

    }
  }
}
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
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

body{
  background: #f0f0f1;
}

.p-paginator.p-component {
  justify-content: center;
}
.router-link-exact-active {
  color: #42b983!important;
}
.customLogout ul li:last-child a span{
  color: red !important;
}
</style>
