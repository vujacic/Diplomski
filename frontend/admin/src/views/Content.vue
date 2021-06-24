<template>
  <div>
    <div class="row">
      <div class="col-6">
        <label class="float-start">Title</label>
        <InputText  class="p-inputtext-sm w-100" type="text" v-model="value.title"  placeholder="Title" />
      </div>
      <div class="col-6">
        <label class="float-start">Slug</label>
        <InputText class="p-inputtext-sm w-100" type="text" v-model="value.name"  placeholder="Slug" />
      </div>
      <br>
      <div class="offset-11 col-1">
        <Button class="float-end p-b mt-2  p-button-text" :class="show ? 'p-button-info' : 'p-button-secondary'" @click="handleHtml()" :label="btnHtml"></Button>
      </div>
    </div>
    <div class="row">
      <div class="col-12" v-show="show">
  <Editor v-model="value.body" editorStyle="height: 400px">
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
        <Textarea v-model="html"  style="height: 430px; width: inherit" />
      </div>
  </div>
    <br>
    <div class="row">
      <div class="offset-11 col-1">
      <Button class="float-end" @click="saveContent()">Save</Button>
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
import parseHtml from '../helpers/parseHtml'
import InputText from 'primevue/inputtext'

export default {
  name: 'Content',
  components: {
    Editor,
    Button,
    Textarea,
    InputText
  },
  data() {
    return {
      value: {},
      show: true,
      html: '',
      btnHtml: 'Html'
    }
  },
  mounted(){
    service.getContent(this.$route.params.slug)
    .then(response => (this.value = response.data))
    .catch(error => this.$toast.add({
      severity: 'error', summary: 'Error',
      detail: error.toString(), life: 3000
    }));
  },
  methods:{
    saveContent: function (){
      if(this.show === false){
        this.value.body = parseHtml.cleanHtml(this.html);
      }
      service.putContent(this.$route.params.slug, this.value)
          .then(response => {
            this.$toast.add({
              severity: 'success', summary: 'Post Saved',
              detail: 'The post has been saved', life: 3000
            });
            console.log(response);
          })
      .catch(er => this.$toast.add({
        severity: 'error', summary: 'Error',
        detail: er.toString(), life: 3000
      }));
    },
    handleHtml: function (){
      if(this.show === true){
        this.html = parseHtml.indentHtml(this.value.body);
        this.btnHtml = "Visual";
      } else {
        this.value.body = parseHtml.cleanHtml(this.html);
        this.btnHtml = "Html";
      }
      this.show = !this.show;
    }
  },
  directives: {
    tp: Tooltip
  }
}
</script>

<style scoped>

</style>
