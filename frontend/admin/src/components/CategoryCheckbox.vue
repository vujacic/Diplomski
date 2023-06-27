<template>
  <panel header="Categories" :toggleable="true">
    <div class="row">
      <div class="col">
        <label class="float-start">Add a Category</label>
        <MultiSelect v-model="selectedCategories" :options="list" optionLabel="name" optionValue="_id" placeholder="All Categories"
                      :maxSelectedLabels="3" class="w-100 mt-2" />
      </div>
    </div>
  </panel>
</template>

<script>
import Panel from "primevue/panel";
import {termService} from "../services/Services";
import sortSet from "../helpers/sortSetIndentation";
import MultiSelect from "primevue/multiselect";

export default {
  name: "CategoryCheckbox",
  components: {
    Panel,
    MultiSelect
  },
  props: {
    modelValue: {
      required: false,
      type: Array
    }
  },
  emits: ['update:modelValue'],
  data() {
    return{
      list: [],
      filter: {
        type: 'category'
      }
    }
  },
  computed: {
    selectedCategories: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    loadCategories(){
      termService.getTermByType(this.filter)
          .then(response =>{
            this.list = [...response.data];
            this.list = sortSet.sortSetIndentation(this.list);
            sortSet.setIndent(this.list, "- ");
          })
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }));
    }
  },
  mounted() {
    this.loadCategories();
  }
}
</script>

<style scoped>

</style>