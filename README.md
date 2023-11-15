# Diplomski

CMS sa node.js api backend-om i ArangoDB bazom.
Frontend admin deo. Sajt i templejti - node.js sa ejs templates

Pokretanje projekta:
1. ArangoDB 3.11 verzija
2. NodeJs 14.17.0 verzija sa npm-om
3. Uraditi npm install u sva tri projekta /backend, /frontend i /frontend/admin
4. Upaliti Arango bazu
5. Importovati back-up baze u Arango iz /db-backup sa komandom: arangorestore --input-directory "putanja do foldera iz zip fajla" --server.database "diplomski" --create-database
6. Pokrenuti /backend sa komandom: npm run dev
7. Pokrenuti /frontend sa komandom: npm run restart
8. Pokrenuti /frontend/admin sa komandom: npm run serve
