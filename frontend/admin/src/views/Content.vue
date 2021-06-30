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
      <Button class="float-end" v-if="!create" @click="saveContent()">Save</Button>
        <Button class="float-end" v-if="create" @click="createContent()">Create</Button>
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
      value: {

      },
      show: true,
      html: '',
      btnHtml: 'Html',
      create: false
    }
  },
  mounted(){
    if(this.$route.params.slug) {
      service.getContent(this.$route.params.slug)
          .then(response => (this.value = response.data))
          .catch(error => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: error.toString(), life: 3000
          }));
    } else{
      this.create = true;
    }
  },
  methods:{
    saveContent: async function (){
      if(this.show === false){
        this.value.body = parseHtml.cleanHtml(this.html);
      }
      if(!await this.validate()){
        return;
      }
      service.putContent(this.$route.params.slug, this.value)
          .then(() => {
            this.$toast.add({
              severity: 'success', summary: 'Post Saved',
              detail: 'The post has been saved', life: 3000
            });
            //console.log(response);
          })
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }));
    },
    createContent: async function (){
      if(this.show === false){
        this.value.body = parseHtml.cleanHtml(this.html);
      }
      if(!await this.validate()){
        return;
      }
      this.value.userId = "kad ga budem imao";
      this.value.status = "published";
      this.value.type = "post";
      this.value.date = new Date().toISOString();
      this.value.modified = new Date().toISOString();
      service.postContent(this.value)
          .then(response => {
            this.$toast.add({
              severity: 'success', summary: 'Post Created',
              detail: 'The post has been created', life: 3000
            });
            this.create = false;
            this.$router.replace({path: `/content/${response.data._key}`})
            this.value._key = response.data._key;
            this.value._rev = response.data._rev;
          })
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }));
    },
    async validate(){
      if(!this.value.title){
        this.$toast.add({
          severity: 'error', summary: 'Title invalid',
          detail: 'Must have a title', life: 3000
        });
        return false;
      }
      if(!this.value.name){
        this.$toast.add({
          severity: 'error', summary: 'Slug invalid',
          detail: 'Must have a slug', life: 3000
        });
        return false;
      }
      const res = await service.getPagedContent({type: "post", page: 0, limit: 10,
        order: "asc", sort: "_key", name: this.value.name})
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }));
      const list = res?.data?.list;
      // console.log(res);
      if(list && list.length > 1){
        this.$toast.add({
          severity: 'error', summary: 'Slug',
          detail: 'Slug already exists', life: 3000
        });
        return false;
      } else if(list && list.length == 1 && list[0]._key != this.value._key){
        this.$toast.add({
          severity: 'error', summary: 'Slug',
          detail: 'Slug already exists', life: 3000
        });
        return false;
      }
      return true;
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
  },
}
</script>

<style scoped>
#app .p-editor-container{
  text-align: left;
}
</style>
