<script src="../../../../backend/src/data/Helpers/FilterParser.ts"></script>
<template>
  <div>
    <div class="row">
      <div class="offset-11 col-1">
        <Button class="float-end p-b" @click="handleHtml($event)">Html</Button>
      </div>
    </div>
    <br>
    <div class="row">
      <div class="col-12" v-show="show">
  <Editor v-model="value" editorStyle="height: 400px">
    <template #toolbar>
      <span class="ql-formats">
<!--        <select class="ql-font"></select>-->
<!--        <select class="ql-size"></select>-->
      </span>
      <span class="ql-formats">
        <button v-tp.bottom="'Bold (Ctrl+B)'" class="ql-bold"></button>
        <button v-tp.bottom="'Italic (Ctrl+I)'" class="ql-italic"></button>
        <button v-tp.bottom="'Underline (Ctrl+U)'" class="ql-underline"></button>
<!--        <button v-tp.bottom="'Strikethrough'" class="ql-strike"></button>-->
      </span>
      <span class="ql-formats">
<!--        <select class="ql-color"></select>-->
<!--        <select class="ql-background"></select>-->
      </span>
<!--      <span class="ql-formats">-->
<!--        <button v-tp.bottom="'Subscript'" class="ql-script" value="sub"></button>-->
<!--        <button v-tp.bottom="'Superscript'" class="ql-script" value="super"></button>-->
<!--      </span>-->
      <span class="ql-formats">
        <button v-tp.bottom="'Header 1'" class="ql-header" value="1"></button>
        <button v-tp.bottom="'Header 2'" class="ql-header" value="2"></button>
        <button v-tp.bottom="'Blockquote'" class="ql-blockquote"></button>
        <button v-tp.bottom="'Preformatted'" class="ql-code-block"></button>
      </span>
      <span class="ql-formats">
        <button v-tp.bottom="'Numbered list'" class="ql-list" value="ordered"></button>
        <button v-tp.bottom="'Bulleted list'" class="ql-list" value="bullet"></button>
        <button v-tp.bottom="'Indent'" class="ql-indent" value="+1"></button>
        <button v-tp.bottom="'Outdent'" class="ql-indent" value="-1"></button>

      </span>
      <span class="ql-formats">
<!--        <button v-tp.bottom="'Direction'" class="ql-direction" value="rtl"></button>-->
<!--        <select class="ql-align"></select>-->
        <button v-tp.bottom="'Left'" class="ql-align" value=""></button>
        <button v-tp.bottom="'Center'" class="ql-align" value="center"></button>
        <button v-tp.bottom="'Right'" class="ql-align" value="right"></button>
        <button v-tp.bottom="'Justify'" class="ql-align" value="justify"></button>
      </span>
      <span class="ql-formats">
        <button v-tp.bottom="'Edit link'" class="ql-link"></button>
<!--        <button class="ql-image"></button>-->
<!--        <button class="ql-video"></button>-->
<!--        <button class="ql-formula"></button>-->
      </span>
      <span class="ql-formats">
        <button v-tp.bottom="'Clear formatting'" class="ql-clean"></button>
      </span>
    </template>
  </Editor>
      </div>
      <div class="col-12" v-show="!show">
        <Textarea v-model="value"  style="height: 430px; width: inherit" />
      </div>
  </div>
    <br>
    <div class="row">
      <div class="offset-11 col-1">
      <Button class="float-end" @click="handleClick($event)">Save</Button>
      </div>
    </div>

  </div>

</template>

<script>
import Editor from 'primevue/editor'
// import axios from 'axios'
import Button from 'primevue/button'
import service from '../services/ContentService'
import Tooltip from 'primevue/tooltip'
import Textarea from 'primevue/textarea'

export default {
  name: 'Content',
  components: {
    Editor,
    Button,
    Textarea
  },
  data() {
    return {
      value: '',
      show: true
    }
  },
  mounted(){
    service.getContent(this.$route.params.slug)
    .then(response => (this.value = response.data.body))
    .catch(error => alert(error));
    // axios
    //   .get('http://localhost:3000/api/content/62604')
    //   .then(response => (this.value = response.data[0].body));
  },
  methods:{
    handleClick: function (){
      // axios
      //   .put('http://localhost:3000/api/content/62604', {body: this.value})
      //   .then(() => (alert("Sve je u redu")));
    },
    handleHtml: function (){
      this.show = !this.show;
    }
  },
  directives: {
    'tp': Tooltip
  }
}
</script>

<style scoped>

</style>
