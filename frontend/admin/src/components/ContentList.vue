<template>
  <div>
  <h1>All {{type}}s</h1>
    <form @submit="search">
    <div class="row">
      <div class="col-12 col-md-4 col-xl-3 pb-3">
        <label class="float-start">Title</label>
        <InputText class="p-inputtext-sm w-100" type="text" v-model="filter.title"  placeholder="Title" />
      </div>
      <div class="col-12 col-md-4 col-xl-3 pb-3">
        <label class="float-start">Slug</label>
        <InputText class="p-inputtext-sm w-100" type="text" v-model="filter.name"  placeholder="Slug (exact match)" />
      </div>
      <div class="col-12 col-md-4 col-xl-3 pb-3">
        <label class="float-start">Status</label>
        <Dropdown class="p-inputtext-sm w-100" type="text" v-model="filter.status" :options="['', 'published', 'not published']"  placeholder="Select status" />
      </div>
      <div class="col-12 col-md-4 col-xl-3 d-inline-flex justify-content-start pb-3">
        <Button type="submit" class="align-self-end w-100 justify-content-center">Search</Button>
      </div>
    </div>
    </form>
    <div class="row">
      <div class="col-12">
        <DataTable :value="list" :lazy="true" :paginator="true" :rows="lazyParams.rows" showGridlines :first="lazyParams.first" :sortField="lazyParams.sortField" :sortOrder="lazyParams.sortOrder"
                   @page="onPage($event)" @sort="onSort($event)" :totalRecords="count" class="p-datatable-sm"
                   :rowsPerPageOptions="[10,20,30]">
          <Column>
            <template #body="item">
              <Button icon="pi pi-pencil" v-tp.bottom="'Edit post'" class="p-button-rounded p-button-success me-2" @click="editPage(item.data)" />
              <Button icon="pi pi-trash" v-tp.bottom="'Delete post'" class="p-button-rounded p-button-warning" @click="confirmDelete(item.data)" />
            </template>
          </Column>
          <Column field="title" header="Title" :sortable="true"></Column>
          <Column field="name" header="Slug"></Column>
          <Column field="userId" header="User"></Column>
          <Column field="status" header="Status"></Column>
          <Column field="date" header="Created" :sortable="true"></Column>
        </DataTable>
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
import DataTable from 'primevue/datatable'
import Column from "primevue/column";
import {contentService} from  "../services/Services"

import convertFilters from "../helpers/convertFilters";
import Dialog from "primevue/dialog"
import Tooltip from "primevue/tooltip";
import InputText from "primevue/inputtext";
import Dropdown from "primevue/dropdown";
import Button from 'primevue/button'

export default {
  name: "ContentList",
  components: {
    DataTable,
    Column,
    Button,
    Dialog,
    InputText,
    Dropdown,
  },
  directives:{
    tp: Tooltip
  },
  data(){
    return {
      list: [],
      filter: {
        page: "0",
        limit: "10",
        sort: "date",
        order: "desc"
      },
      lazyParams: {
      },
      count: 0,
      deleteDialog: false,
      deleteItem: null,
      type: ''
    }
  },
  methods:{
    onPage(event) {
      this.lazyParams = event;

      let oldLimit = this.filter.limit;
      convertFilters.lazyToFilterAndReplace(this.filter, this.lazyParams);
      if (this.filter.limit != oldLimit){
        this.filter.page=0;
        this.lazyParams.first = 0;
      }

      this.loadLazyData();
    },
    onSort(event) {
      this.lazyParams = event;

      convertFilters.lazyToFilterAndReplace(this.filter, this.lazyParams);

      this.loadLazyData();
    },
    loadLazyData(){
      this.filter.type=this.type;
      sessionStorage.setItem(this.type, JSON.stringify(this.filter));
      this.filter.partial = true;
      contentService.getPagedContent(this.filter)
          .then(response =>{
            this.list = response.data.list;
            this.list.forEach((x) => {
              x.date = new Date(x.date).toLocaleString('ja-JP',{timeStyle: 'short', dateStyle: 'short'});
            });
            this.count= response.data.count;
          })
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }));
    },
    search(e){
      e.preventDefault();
      this.lazyParams.first=0;
      convertFilters.lazyToFilterAndReplace(this.filter, this.lazyParams)
      this.loadLazyData();
    },
    editPage(page) {
      this.$router.push({path: `/content/${this.type}/${page._key}`});
    },
    confirmDelete(page){
      this.deleteDialog = true;
      this.deleteItem = page;
    },
    deleteReally() {
      contentService.deleteContent(this.deleteItem._key)
          .then(() => {
            this.$toast.add({
              severity: 'success', summary: 'Post deleted',
              detail: `The post "${this.deleteItem.title}" has been deleted`, life: 3000
            });
            this.deleteItem = null;
            this.deleteDialog = false;
            this.loadLazyData();
          })
          .catch(er => {
            this.$toast.add({
              severity: 'error', summary: 'Error',
              detail: er.toString(), life: 3000
            });
            this.deleteItem = null;
            this.deleteDialog = false;
          })
    }
  },
  created() {
    this.$watch(
        () => this.$route.params,
        (/*toParams, previousParams*/) =>{
          this.type = this.$route.params.type;

          let sFilter = JSON.parse(sessionStorage.getItem(this.type));
          if(sFilter)
            this.filter=sFilter;

          this.lazyParams = convertFilters.filterToLazy(this.filter)

          this.loadLazyData();
        }
    )
  },
  mounted() {
    this.type = this.$route.params.type;


    let sFilter = JSON.parse(sessionStorage.getItem(this.type));
    if(sFilter)
      this.filter=sFilter;

      this.lazyParams = convertFilters.filterToLazy(this.filter)
    this.loadLazyData();
  }
}
</script>

<style scoped>

</style>
