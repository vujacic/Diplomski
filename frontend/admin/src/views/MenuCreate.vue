<template>
  <h1>Manage menus</h1>
  <div>

    <div class="row">
      <div class="col-12 col-xl-6 pb-3">
        <h3>Menus</h3>
        <DataTable :value="list" :paginator="true" :rows="10" showGridlines class="p-datatable-sm">
          <Column>
            <template #body="item">
              <Button icon="pi pi-external-link" v-tp.bottom="'Edit menu items'" class="p-button-rounded p-button-info me-2" @click="menuItemEdit(item.data)" />
              <Button icon="pi pi-pencil" v-tp.bottom="'Edit menu'" class="p-button-rounded p-button-success me-2" @click="menuToEdit(item.data)" />
              <Button icon="pi pi-trash" v-tp.bottom="'Delete menu'" class="p-button-rounded p-button-warning" @click="confirmDelete(item.data)" />

            </template>
          </Column>
          <Column field="title" header="Title"></Column>
        </DataTable>
      </div>
      <div class="col-12 offset-xl-1 col-xl-3">
        <h3>Add new menu</h3>
        <Panel header="Create New">
          <template #header>
            <div class="w-100 align-content-center">
            {{edit ? "Edit \"" + menuItem.title + "\" menu" : "New menu"}}
            </div>
          </template>
        <div class="row">
          <div class="col-12">
            <label class="float-start mb-1">Menu name</label>
            <InputText class="p-inputtext-sm w-100 mb-2" type="text" v-model="menuItem.title" placeholder="Menu name" minlength="3" />
            <Button class="p-button-text p-button-danger float-start" v-if="edit" @click="cancelEdit()">Cancel edit</Button>
            <Button class="p-button-primary float-end" v-if="edit" @click="editMenu()">Edit menu</Button>
            <Button class="p-button-primary float-end" v-if="!edit" @click="createMenu()">Create menu</Button>
          </div>

        </div>

        </Panel>
      </div>
    </div>


    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle me-3" style="font-size: 2rem" />
        <span>Are you sure you want to delete this item?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false"/>
        <Button label="Yes" icon="pi pi-check" class="p-button-text" @click="deleteReally()" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import {contentService} from "../services/Services";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import Tooltip from 'primevue/tooltip'

export default {
  name: "MenuCreate",
  components:{
    DataTable,
    Column,
    Button,
    Dialog,
    InputText,
    Panel
  },
  directives:{
    tp: Tooltip
  },
  data() {
    return{
      list: [],
      filter: {
        page: "0",
        limit: "100",
        sort: "date",
        order: "desc",
        type: "menu"
      },
      deleteDialog: false,
      menuItem: {title: ""},
      edit: false,
      deleteItem: null
    }
  },
  methods:{
    loadMenu(){
      contentService.getPagedContent(this.filter)
          .then(response =>{
            this.list = [...response.data.list];
          })
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }));
    },
    createMenu(){
      if(!this.validate()){
        return;
      }
      const menu = {
        title: this.menuItem.title,
        body: [],
        userId: "kad imam korisnika",
        type: "menu",
        date: new Date(Date.now()).toISOString(),
        modified: new Date(Date.now()).toISOString(),
      };
      contentService.postContent(menu)
      .then(() =>{
        this.cancelEdit();
        this.loadMenu();
        this.$toast.add({
          severity: 'success', summary: 'New Menu',
          detail: 'Menu created', life: 3000
        });
      })
      .catch(er => this.$toast.add({
        severity: 'error', summary: 'Error',
        detail: er.toString(), life: 3000
      }))
    },
    editMenu(){
      if(!this.validate()){
        return;
      }
      const menu = {
        _key: this.menuItem._key,
        modified: new Date(Date.now()).toISOString(),
        title: this.menuItem.title
      };
      contentService.putContent(menu._key, menu)
      .then(()=>{
        this.cancelEdit();
        this.loadMenu();
        this.$toast.add({
          severity: 'success', summary: 'Update',
          detail: 'Menu updated', life: 3000
        });
        this.edit = false;
      })
      .catch(er => this.$toast.add({
        severity: 'error', summary: 'Error',
        detail: er.toString(), life: 3000
      }))
    },
    cancelEdit(){
      this.edit = false;
      this.menuItem = {title: ""}
    },
    menuToEdit(data){
      this.menuItem = data;
      this.edit = true;
    },
    confirmDelete(page){
      this.deleteDialog = true;
      this.deleteItem = page;
    },
    deleteReally() {
      contentService.deleteContent(this.deleteItem._key)
          .then(() => {
            this.$toast.add({
              severity: 'success', summary: 'Menu deleted',
              detail: `Menu "${this.deleteItem.title}" has been deleted`, life: 3000
            });
            if(this.menuItem?._key == this.deleteItem._key){
              this.cancelEdit();
            }
            this.deleteItem = null;
            this.deleteDialog = false;
            this.loadMenu();
          })
          .catch(er => {
            this.$toast.add({
              severity: 'error', summary: 'Error',
              detail: er.toString(), life: 3000
            });
            this.deleteItem = null;
            this.deleteDialog = false;
          })
    },
    validate(){
      if(this.menuItem.title.length < 3){
        this.$toast.add({
          severity: 'error', summary: 'Error',
          detail: "Menu name too short", life: 3000
        });
        return false;
      }
      return true;
    },
    menuItemEdit(menu){
      this.$router.push({path: `/menu/${menu._key}`});
    }
  },
  mounted() {
    this.loadMenu();
  }
}
</script>

<style scoped>

</style>
