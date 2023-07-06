<template>
  <draggable
      class="dragArea"
      tag="ul"
      v-model="zmaj"
      :group="{ name: 'g1' }"
      item-key="uuid"
      @start="drag = true"
      @end="drag = false"
      invertSwap = "true"
      filter = ".p-inputtext-sm, .p-button-danger"
      :preventOnFilter=filter>
    <template #item = {element}>
      <li>
        <Accordion class="col-12 col-md-10 col-lg-8 col-xl-6">
        <accordion-tab>
          <template #header>
            {{element.title}}
          </template>
          <div class="row">
            <div class="col">
              <label class="float-start">Link label</label>
              <InputText class="p-inputtext-sm w-100 mb-2" type="text" v-model="element.title"  placeholder="Title" />
              <label class="float-start">Url</label>
              <InputText :disabled="element._key > 0"  class="p-inputtext-sm w-100 mb-2" type="text" :modelValue="element.name"  placeholder="Title" />
              <Button class="p-button-danger float-start" @click="removeLink(element.uuid)">Remove</Button>
            </div>
          </div>
        </accordion-tab>
        </Accordion>
<!--        <p>{{ element.name }}</p>-->
        <nested-draggable v-model="element.menu" />
      </li>
    </template>
  </draggable>
</template>
<script>
import draggable from "vuedraggable";
import AccordionTab from 'primevue/accordiontab';
import Accordion from 'primevue/accordion';
import InputText from "primevue/inputtext";
import Button from "primevue/button"

export default {
  name: "nested-draggable",
  props: ['modelValue'],
  emits: ['update:modelValue'],
  components: {
    draggable,
    AccordionTab,
    Accordion,
    InputText,
    Button
  },
  data() {
    return{
      drag: false,
      filter: false
    }
  },
  computed: {
    dragOptions() {
      return {
        filter: ".p-inputtext-sm"
      };
    },
    zmaj: {
      get(){
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    removeLink(uuid){
      // this.$store.commit('deleteFromList', uuid);
      let mv = JSON.parse(JSON.stringify(this.modelValue));
      let index = mv.findIndex(x => x.uuid == uuid);
      mv.splice(index, 1);
      this.$emit('update:modelValue', mv);
    },
    // updateValue(value, uuid){
    //   this.$store.commit('updateArray', {uuid: uuid, value: value})
    // }
  }
};
</script>
<style scoped>
.dragArea {
  /*min-height: 10px;*/
  padding-bottom: 10px;
  /*padding-top: 10px;  */
  border-bottom: 1px dashed;
}
ul > li{
  margin-top: 5px;
}
/*ul:empty{*/
/*  padding-bottom: 10px;*/
/*}*/
p {
  text-align: left;
}
</style>
