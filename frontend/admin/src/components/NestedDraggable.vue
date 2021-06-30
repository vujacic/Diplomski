<template>
  <draggable
      class="dragArea"
      tag="ul"
      :list="menu"
      :group="{ name: 'g1' }"
      item-key="uuid"
      @start="drag = true"
      @end="drag = false"
      invertSwap = "true"
  >
    <template #item="{ element }">
      <li>
        <Accordion class="col-6">
        <accordion-tab>
          <template #header>
            {{element.title}}
          </template>
          <div class="row">
            <div class="col">
              <label class="float-start">Link label</label>
              <InputText  class="p-inputtext-sm w-100 mb-2" type="text" v-model="element.title"  placeholder="Title" />
              <label class="float-start">Url</label>
              <InputText :disabled="element._key > 0"  class="p-inputtext-sm w-100 mb-2" type="text" v-model="element.name"  placeholder="Title" />
              <Button class="p-button-danger float-start" @click="removeLink(element.uuid)">Remove</Button>
            </div>
          </div>
        </accordion-tab>
        </Accordion>
<!--        <p>{{ element.name }}</p>-->
        <nested-draggable :list="element.menu" />
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
  props: {
    menu: {
      required: false,
      type: Array
    }
  },
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
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
        fallbackOnBody: true,
        invertSwap: true,
        swapThreshold: 0.65
      };
    }
  },
  methods: {
    removeLink(uuid){
      this.$store.commit('deleteFromList', uuid);
    }
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
