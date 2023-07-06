<template>
  <div class="home">
<!--    <img alt="Vue logo" src="../assets/logo.png">-->
    <h1>Admin home page</h1>
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <h2>Korisničko upustvo</h2>
    <ul>
      <li>
        Posts - View Posts: Lista svih članka u bazi. Moguć je pregled birsanje i filtriranje po nazivu, url-u  i statusu (promena statusa nije implementirana)
      </li>
      <li>New/Edit Post: Dodavanje novog/izmena postojećeg članka. Takođe je moguće svrstati članak u jednu ili više kategorija</li>
      <li>Categories: Dodavanje, bisanje i modifikovanje kategorija. Moguće je postaviti roditelja i može imati samo jednog roditelja. Crtice predstavljaju ugnježdene kategorije</li>
      <li>Pages: Stranice su iste kao i članci ali ne mogu se svrstati u kategorije</li>
      <li>Menu: Prikazuje se samo glavni meni. Moguće je dodati postojeće stranice ili članke ili dodati običan link. Omogućeno je pomeranje i ugnježdavanje stavki prevlačenjem </li>
      <li>Site settings: Menjanje imena sajta, opisa, broj članaka koji se prikazuje prilikom odlaska na stanicu /categories ili /search</li>
        <ul>
          <li>Site settings: Theme settings - 4 sekcije sa Home stranice. Moguće je menjanje</li>
          <li>Prva sekcija: naslov, tekst, link i boja celog sajta</li>
          <li>Druga sekcija: prikazivanje ili ne, kutijice sa slovom i linkom. Dodavanje i brisanje postojećih kutijica</li>
          <li>Treća sekcija: prikazivanje ili ne, naslov, tekst i link. Dodavanje i brisanje postojećih kutijica</li>
          <li>Četvrta sekcija: slično kao treća</li>
        </ul>
        <li>Manage users: nije implementirano</li>
    </ul>
    <ul>
      <li>Sajt (tekst preuzet iz diplomskog rada):</li>
      <li>Glavna stranica</li>
      <li>Stranica kategorije - prikazivanje i filtriranje članaka po postojećim kategorijama sa straničenjem</li>
      <li>Stranica search - search se prikazuje i na stranici sa kategorijama. Tokenizacija i pretraživanje pogleda sa invertovanim indeksima.</li>
    </ul>
  </div>
</template>
<style scoped>
ul{
  text-align: left;
}
li {
  padding-bottom: 1rem;
}
</style>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  }
}
</script>
