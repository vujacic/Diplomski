<template>
  <h1>Categories</h1>
  <div class="row">
    <div class="col-6">
      <h3>Categories</h3>
      <DataTable :value="list" :paginator="true" :rows="10" showGridlines class="p-datatable-sm">
        <Column>
          <template #body="item">
            <Button icon="pi pi-pencil" v-tp.bottom="'Edit'" class="p-button-rounded p-button-success me-2" @click="categoryToEdit(item.data)" />
            <Button icon="pi pi-trash" v-tp.bottom="'Delete'" class="p-button-rounded p-button-warning" @click="confirmDelete(item.data)" />
          </template>
        </Column>
        <Column field="name" header="Name"></Column>
        <Column field="description" header="Description"></Column>
      </DataTable>
    </div>

    <div class="offset-1 col-3">
      <h3>Category</h3>
      <Panel header="Create New">
        <template #header>
          <div class="w-100 align-content-center">
            {{edit ? "Edit \"" + categoryItem.name + "\" category" : "New category"}}
          </div>
        </template>
        <div class="row">
          <div class="col-12">
            <label class="float-start mb-1">Name</label>
            <InputText class="p-inputtext-sm w-100 mb-2" type="text" v-model="categoryItem.name" placeholder="Name" minlength="3" />
            <label class="float-start mb-1">Description</label>
            <InputText class="p-inputtext-sm w-100 mb-2" type="text" v-model="categoryItem.description" placeholder="Desc" minlength="3" />
            <label class="float-start mb-1">Parent</label>
            <Dropdown v-model="categoryItem.parentId" :options="ddList" optionLabel="name" optionValue="value" placeholder="Select a Category" class="w-100 mb-4 p-inputtext-sm" />
            <Button class="p-button-text p-button-danger float-start" v-if="edit" @click="cancelEdit()">Cancel edit</Button>
            <Button class="p-button-primary float-end" v-if="edit" @click="editCategory()">Save</Button>
            <Button class="p-button-primary float-end" v-if="!edit" @click="createCategory()">Create</Button>
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
</template>

<script>
import {termService} from "../services/Services";
import sortSet from "../helpers/sortSetIndentation";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Tooltip from "primevue/tooltip";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import Dropdown from "primevue/dropdown"
export default {
  name: "Categories",
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    InputText,
    Panel,
    Dropdown
  },
  directives: {
    tp: Tooltip
  },
  data() {
    return {
      list: [],
      ddList: [],
      filter: {
        type: 'category'
      },
      categoryItem: {
        name: '',
        description: '',
        parentId: ''
      },
      deleteDialog: false,
      edit: false,
      deleteItem: null
    }
  },
  methods: {
    loadCategories(){
      termService.getTermByType(this.filter)
          .then(response =>{
            this.list = [...response.data];
            this.list = sortSet.sortSetIndentation(this.list);
            sortSet.setIndent(this.list, "- ");
            this.setDdList();
          })
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }));
    },
    loadCategory(id){
      termService.getTerm(id)
          .then(response =>{
            this.categoryItem = response.data;
          })
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }));
    },
    setDdList(toRemove){
      this.ddList = [{value: '', name: 'None', indent: 0}]
          .concat(this.list.map(x => {
            if(x._id != toRemove)
              return {value: x._id, name: x.name, indent: x.indent }
          }));
    },
    createCategory(){
      if(!this.validate()){
        return;
      }
      const category = {
        type: "category",
        name: this.categoryItem.name,
        description: this.categoryItem.description,
        parentId: this.categoryItem.parentId
      };
      termService.postTerm(category)
          .then(() =>{
            this.cancelEdit();
            this.loadCategories();
            this.$toast.add({
              severity: 'success', summary: 'New Category',
              detail: 'Category created', life: 3000
            });
          })
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }))
    },
    editCategory(){
      if(!this.validate()){
        return;
      }
      const category = {
        _key: this.categoryItem._key,
        name: this.categoryItem.name,
        description: this.categoryItem.description,
        parentId: this.categoryItem.parentId
      };
      termService.putTerm(category._key, category)
          .then(()=>{
            this.cancelEdit();
            this.loadCategories();
            this.$toast.add({
              severity: 'success', summary: 'Update',
              detail: 'Category updated', life: 3000
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
      this.categoryItem = {
        name: '',
        description: '',
        parentId: ''
      }
    },
    categoryToEdit(data){
      this.loadCategory(data._key);
      this.edit = true;
    },
    confirmDelete(category){
      this.deleteDialog = true;
      this.deleteItem = category;
    },
    deleteReally() {
      termService.deleteTerm(this.deleteItem._key)
          .then(() => {
            this.$toast.add({
              severity: 'success', summary: 'Category deleted',
              detail: `Category "${this.deleteItem.name}" has been deleted`, life: 3000
            });
            this.cancelEdit();
            this.deleteItem = null;
            this.deleteDialog = false;
            this.loadCategories();
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
      if(this.categoryItem.name.length < 3){
        this.$toast.add({
          severity: 'error', summary: 'Error',
          detail: "Category name too short", life: 3000
        });
        return false;
      }
      if(this.categoryItem.parentId == this.categoryItem._id){
        this.$toast.add({
          severity: 'error', summary: 'Error',
          detail: "A category can't be its own parent", life: 3000
        });
        return false;
      }
      return true;
    }
  },
  mounted() {
    this.loadCategories();
  }
}
</script>

<style scoped>
</style>