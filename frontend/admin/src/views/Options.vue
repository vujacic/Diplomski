<template>
  <h1>Site settings</h1>
  <div class="row">
    <template v-for="option in options" :key="option._key">
      <div v-if="typeof option.value != 'object' " class="col-12 col-md-3 pb-4">
        <label class="float-start">{{option.name}}</label>
        <InputText class="p-inputtext-sm w-100 " type="text" :disabled="option.disabled" v-model="option.value"  placeholder="" />
      </div>
    </template>
  </div>
  <div class="row">
    <div class="col col-xl-12">
<!--      <button @click="log"> Click me</button>-->
      <render-object-option v-model="theme" :propCollapsed="false"></render-object-option>
    </div>
  </div>
  <div class="row">
    <div class="offset-11 col-1">
      <Button class="float-end" @click="saveOptions()" label="Save"></Button>
    </div>
  </div>
</template>

<script>
import { optionService} from "../services/Services";
import InputText from "primevue/inputtext";
import RenderObjectOption from "../components/RenderObjectOption";
import Button from "primevue/button";

export default {
  name: "Options",
  components: {
    RenderObjectOption,
    InputText,
    Button
  },
  data() {
    return{
      options: [],
      theme: {
      },
    }
  },
  mounted() {
    this.pageLoad();
  },
  methods:{
    pageLoad() {
        optionService.getOptions(this.$route.params.slug)
            .then(response => {
              this.options = response.data;
              this.theme = this.options.find(x => x._key == "theme_mods_francesca");
            })
            .catch(error => this.$toast.add({
              severity: 'error', summary: 'Error',
              detail: error.toString(), life: 3000
            }));
    },
    log(){
      console.log(this.theme.value[1])
    },
    saveOptions: async function (){
      optionService.putOptions(this.options)
          .then(() => {
            this.$toast.add({
              severity: 'success', summary: 'Settings Saved',
              detail: 'The settings have been saved', life: 3000
            });
            //console.log(response);
            this.pageLoad();
          })
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }));
    },
  }
}
</script>

<style scoped>

</style>