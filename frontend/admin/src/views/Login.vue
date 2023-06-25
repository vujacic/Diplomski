<template>
  <form @submit="login">
    <div class="col pb-3">
      <label class="float-start">Email</label>
      <InputText  class="p-inputtext-sm w-100" type="text" v-model="value.email"  placeholder="Email" />
    </div>
    <div class="col pb-3">
      <label class="float-start">Password</label>
      <InputText class="p-inputtext-sm w-100" type="password" v-model="value.password"  placeholder="Password" />
    </div>
    <div class="col">
      <Button type="submit" class="justify-content-center w-100">Login</Button>
    </div>
  </form>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import {authService} from "../services/Services";

export default {
  name: "Login",
  components: {
    InputText,
    Button

  },
  data() {
    return {
      value: {
        email: null,
        pass: null
      }
    }
  },
  methods: {
    login(e) {
      e.preventDefault();
      authService.login({email: this.value.email, password: this.value.password})
          .then((res) => {
            if(res.data.status == true){
              this.$toast.add({
                severity: 'success', summary: 'Logged in',
                detail: 'You have been successfully logged in', life: 3000
              });
              sessionStorage.setItem("token", res.data.token);
              this.$router.replace({name: 'Home'})
            } else {
              sessionStorage.setItem("token", '');
              this.$toast.add({
                severity: 'error', summary: 'Invalid log in',
                detail: 'The log in provided is not valid', life: 3000
              });
            }
          })
          .catch(er => this.$toast.add({
            severity: 'error', summary: 'Error',
            detail: er.toString(), life: 3000
          }));
    }
  }
}
</script>

<style scoped>

</style>