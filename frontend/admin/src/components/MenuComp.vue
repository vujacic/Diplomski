<template v-if="!loading">
  <div class="row">
    <div class="col-3">
      <h3>Menu Items</h3>
      <panel header="Pages" :toggleable="true">
        <div class="row">
          <div class="col">
            <label class="float-start">Page title</label>
            <AutoComplete forceSelection v-model="newPage" :dropdown="true" :suggestions="filteredPages" field="title"
                          @complete="searchPages($event)" placeholder="Search Pages" class="w-100 mb-2 p-inputtext-sm" />
            <Button class="p-button-primary float-end" @click="addPageToMenu()">Add to menu</Button>
          </div>
        </div>
      </panel>
      <br>

      <panel header="Links" :toggleable="true">
        <div class="row">
          <div class="col">
            <label class="float-start">Link label</label>
            <InputText class="p-inputtext-sm w-100 mb-2" type="text" v-model="newLink.title" placeholder="Title" />
            <label class="float-start">Url</label>
            <InputText class="p-inputtext-sm w-100 mb-2" type="text" v-model="newLink.name" placeholder="https://google.com..." />
            <Button class="p-button-primary float-end" @click="addLinkToMenu()">Add to menu</Button>
          </div>
        </div>
      </panel>



    </div>

    <div class="col-9">
      <h3>Menu</h3>
      <panel>
        <template #header>
          <span><b>{{menu.title}}</b> menu</span>
        </template>
        <div class="row back">
          <div class="col">
            <nested-draggable :modelValue="menu.body"/>
          </div>
        </div>
      </panel>
      <br>
<!--      <div class="row" style="background-color: white">-->
<!--        <div class="offset-9 col-3" >-->
      <div class="w-100 clearfix p-2 sticky" >
<!--        <Button class="p-button-text p-button-danger float-start" @click="deleteMenu()">Delete</Button>-->
        <Button class="p-button-primary float-end" @click="saveMenu()">Save menu</Button>
      </div>

<!--        </div>-->
<!--      </div>-->
    </div>


  </div>
</template>

<script>
import NestedDraggable from './NestedDraggable'
import Panel from 'primevue/panel'
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import AutoComplete from 'primevue/autocomplete'
import { v4 as uuidv4 } from 'uuid';
import {contentService} from "../services/Services";


export default {
  name: "MenuComp",
  components: {
    NestedDraggable,
    Panel,
    InputText,
    Button,
    AutoComplete
  },
  data() {
    return{
      newLink: {
        title: "",
        name: ""
      },
      newPage: null,
      filteredPages: null
    }
  },
  computed: {
    menu:{
      get(){
        return this.$store.state.menu;
      },
      set(value){
        this.$store.commit('setList', value);
      }
    },
    loading: {
      get(){
        return this.$store.state.loading;
      }
    }
  },
  methods: {
    searchPages(event){
      const params = {
        page: "0",
        limit: "10",
        order: "desc",
        sort: "date",
        title: event.query,
        status: "published",
        type: "post"
      }
      contentService.getPagedContent(params)
          .then(response =>{
            this.filteredPages = response.data.list;
          })
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }));
    },
    addLinkToMenu(){
      if(this.newLink){
        if(this.newLink.title && this.newLink.name){
          this.newLink._key = 0;
          this.newLink.type= 'link';
          this.newLink.uuid = uuidv4();
          this.newLink.menu = [];
          this.$store.commit('updateList', this.newLink);
          this.newLink = {
            name: "",
            title: ""
          }
          return;
        }
      }
      this.$toast.add({
        severity: 'warn', summary: 'No link',
        detail: "Link input not specified", life: 3000});
    },
    addPageToMenu(){
      if(this.newPage){
        this.$store.commit('updateList',{
          _key: this.newPage._key,
          title: this.newPage.title,
          name: this.newPage.name,
          type: this.newPage.type,
          uuid: uuidv4(),
          menu: []
        });
      }else {
        this.$toast.add({
          severity: 'warn', summary: 'No page',
          detail: "No page selected", life: 3000});
      }
    },
    saveMenu(){
      const cont = {
        _key: this.menu._key,
        body: this.menu.body,
        modified: new Date().toISOString()
      };
      contentService.putContent(cont._key, cont)
        .then(() => {
          this.$toast.add({
            severity: 'success', summary: 'Update',
            detail: 'Menu items updated', life: 3000
          });
        })
        .catch(er => this.$toast.add({
          severity: 'error', summary: 'Error',
          detail: er.toString(), life: 3000
        }))
    }

  },
  mounted(){
    if(this.$route.params.slug) {
      this.menu = {body: []} ;
      contentService.getContent(this.$route.params.slug)
          .then(response => {this.menu = response.data})
          .catch(error => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: error.toString(), life: 3000
          }));
    }
  }
}
</script>

<style scoped>
.back{
  background: #e0f0f1;
}
.sticky{
  background-color: white;
  position:sticky;
  bottom:0;
  outline: solid 1px #a2a5ab;
}
</style>
