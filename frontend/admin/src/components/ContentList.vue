<template>
  <div>
  <h1>List of posts</h1>
    <div class="row">
      <div class="col-12">
        <DataTable :value="list" :lazy="true" :paginator="true" :rows="lazyParams.rows"
                   @page="onPage($event)" @sort="onSort($event)" :totalRecords="count"
                   :rowsPerPageOptions="[10,20,30]">
          <Column>
            <template #body="item">
              <Button icon="pi pi-pencil" v-tp.bottom="'Edit post'" class="p-button-rounded p-button-success me-2" @click="editPage(item.data)" />
              <Button icon="pi pi-trash" v-tp.bottom="'Delete post'" class="p-button-rounded p-button-warning" @click="confirmDelete(item.data)" />
            </template>
          </Column>
          <Column field="title" header="Title" :sortable="true"></Column>
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
import Button from "primevue/button"
import Dialog from "primevue/dialog"
import Tooltip from "primevue/tooltip";

export default {
  name: "ContentList",
  components: {
    DataTable,
    Column,
    Button,
    Dialog
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
      deleteItem: null
    }
  },
  methods:{
    onPage(event) {
      this.lazyParams = event;
      this.filter = convertFilters.lazyToFilter(this.lazyParams);
      this.loadLazyData();
    },
    onSort(event) {
      this.lazyParams = event;
      this.filter = convertFilters.lazyToFilter(this.lazyParams);
      this.loadLazyData();
    },
    loadLazyData(){
      this.filter.type="post";
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
    editPage(page) {
      this.$router.push({path: `/content/${page._key}`});
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
  mounted() {
    this.lazyParams = convertFilters.filterToLazy(this.filter)
    this.loadLazyData();
  }
}
</script>

<style scoped>

</style>
