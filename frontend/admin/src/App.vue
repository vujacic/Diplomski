<template>
  <div id="app">
<!--    <div id="nav">-->
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link> |-->
<!--      <router-link to="/content">Content</router-link> |-->
<!--      <router-link to="/content-list">List</router-link>-->
<!--    </div>-->


    <div class="container-fluid">
      <div class="row">
        <div class="col col-md-2">
<!--          <PanelMenu :model="items"></PanelMenu>-->
          <PanelMenu :model="items" @click="highlight($event)">
<!--            <template #default="{item}">-->
<!--              <router-link :to="item.to">{{item.label}}</router-link>-->
<!--            </template>-->
          </PanelMenu>
        </div>
        <div class="col-10">
          <router-view :key="$route.path"/>
        </div>
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
export default {
  name: 'App',
  components: {
    ProgressSpinner,
    Toast,
    PanelMenu
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
          label: 'Pages',
          // to: '/content-list',
          items: [
            {
              label: 'List',
              to: '/content-list'
            },
            {
              label: 'Post New',
              to: '/content'
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
        // {
        //   label: 'Settings',
        //   to: '/settings'
        // },
        {
          label: 'About',
          to: '/about'
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
</style>
