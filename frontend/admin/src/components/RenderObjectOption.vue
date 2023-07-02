<template>


  <div v-if="modelValue.type == 'color'" class="p-2 clearfix">
    <label class="float-start">{{modelValue.name}}</label>
    <br>
    <InputText class="p-inputtext-sm w-25 float-start " type="text" :disabled="theModel.disabled" v-model="theModel.value"  placeholder="color" />
    <ColorPicker class="ps-2 float-start" v-model="theModel.value" />
  </div>
  <div v-else-if="modelValue.type == 'button'" class="clearfix p-2">
    <Button class="float-end" :class="theModel.value == 'delete' ? 'p-button-danger' : ''"
            @click="switchButtonOption(modelValue.value)" :label="modelValue.name"></Button>
  </div>
  <div v-else-if="typeof modelValue.value == 'boolean'" class="p-2 align-content-start d-flex" >
    <Checkbox class="" :binary="true" v-model="theModel.value" :id="uuid" />
    <label class="px-2" :for="uuid">{{modelValue.name}}</label>
  </div>
  <div v-else-if="typeof modelValue.value == 'string'" class="p-2 clearfix" >
    <label class="float-start">{{modelValue.name}}</label>
    <InputText class="p-inputtext-sm w-100 " type="text" v-model="theModel.value" placeholder="" />
  </div>

  <div v-else-if="typeof modelValue.value == 'object'" class="p-2" :class="{'col-12 col-md-6 col-xl-3': hasParentRow}">
    <panel toggleable toggler="header" :collapsed = isCollapsed>
      <template #header >
        <span><b>{{modelValue.name}}</b></span>
      </template>
      <div :class="{'row mx-0': modelValue.row}">
        <template v-for="(item, index) in modelValue.value" :key="item.name">
          <render-object-option v-model="theModel.value[index]" :indexValue = "index" @delete="deleteHandler" @add="addHandler"
                                :hasParentRow="modelValue.row ? true : false"/>
        </template>
      </div>
    </panel>
  </div>

</template>

<script>
import InputText from "primevue/inputtext";
import Panel from "primevue/panel";
import Button from "primevue/button";
import ColorPicker from "primevue/colorpicker";
import Checkbox from "primevue/checkbox";
import {v4 as uuidv4} from "uuid";

export default {
  name: "RenderObjectOption",
  emits: ['update:modelValue', 'delete', 'add'],
  components: {
    InputText,
    Panel,
    Button,
    ColorPicker,
    Checkbox
  },
  props: {
    modelValue: {
      type: Object || Array,
      default: () => ([])
    },
    propCollapsed: {
      default: true
    },
    indexValue: {
      default: 0
    },
    hasParentRow:{
      default: false
    }
  },
  data() {
    return {
      uuid:  uuidv4()
    }
  },
  computed: {
    isCollapsed() {
      return (typeof this.modelValue.value[0]?.value != 'string') && this.propCollapsed || this.modelValue.name.includes('Section');
    },
    theModel:{
      get(){ return this.modelValue},
      set(value) {this.$emit('update:modelValue', value)}
    }
  },
  methods: {
    switchButtonOption(optionValue){
      if(optionValue == "delete"){
        this.$emit('delete', {index: this.indexValue, depth: 0});
      } else if(optionValue == "add"){
        this.$emit('add', this.modelValue.prototype);
      }
    },
    deleteHandler(indexDepth){
      if(indexDepth.depth == 0){
        this.$emit('delete', {index: this.indexValue, depth: indexDepth+1});
      } else {
        let mv = JSON.parse(JSON.stringify(this.modelValue));
        mv.value.splice(indexDepth.index, 1);
        this.$emit('update:modelValue', mv);
      }
    },
    addHandler(prototype){
      let mv = JSON.parse(JSON.stringify(this.modelValue));
      let proto =  JSON.parse(JSON.stringify(prototype));
      proto.name =  `${prototype.name} ${mv.value.length}`;
      mv.value.splice(-1, 0, proto);
      this.$emit('update:modelValue', mv);
    }
  },
}
</script>

<style scoped>

</style>