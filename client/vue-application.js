const Accueil = window.httpVueLoader('./components/Accueil.vue')
const Catalogue = window.httpVueLoader('./components/Catalogue.vue')
const Reception = window.httpVueLoader('./components/Reception.vue')
const Profil = window.httpVueLoader('./components/Profil.vue')


const routes = [
  { path: '/', component: Accueil },
  { path: '/catalogue', component: Catalogue },
  { path: '/reception', component: Reception },
  { path: '/profil', component: Profil },
]

const router = new VueRouter({
  routes
})

var app = new Vue({
  router,
  el: '#app',
  data: {
    medecins: [],
    currentuser : [],
    reception: []
  },
  async mounted(){
    const res = await axios.get('/api/medecins')
    this.medecins = res.data
  },
  methods: {
    async loginUser (user){    
      const res = await axios.post('/api/login',user)
      if (res.data[0] == -1){
        alert("Mot de passe incorrect")
      }
      else if (res.data[0] == 0){
        alert("Email incorrect")
      }
      else{
        alert("Connexion résussite")
        this.$data.currentuser = res.data[1]
        //console.log(this.$data.currentuser[0])
        if (this.$data.currentuser[0].status == 1){
          const res2 = await axios.get('/api/reception')
          this.reception = res2.data
        }
        router.push("/profil")
      }
    },
    async inscriptionUser (user){

      const res = await axios.post('/api/inscription',user)
      
      if (res.data){ alert("Inscription réussite") }
      else{ alert("Email déjà présent ou format incorrect") } 
      
    },
    async logoutUser(){
      const res = await axios.get('/api/logout')

      if (res.data){ 
        alert("Déconnexion succes")
        this.$data.currentuser = []
        router.push("/")
      }
      else { 
        alert("Aucun compte est connecté")
      }
    },
    async refreshUser(){
      const res = await axios.get('api/user')
      this.$data.currentuser = res.data
      //console.log("this.$data.currentuser",this.$data.currentuser)
    },
    async addProfil (user){
      var ismed = false;
      if (this.$data.currentuser[0].status == 1){
        var id_users = this.$data.currentuser[0].id_medecins
        ismed = true;
      }
      else{
        var id_users = this.$data.currentuser[0].id_clients
      }
      const res = await axios.post('/api/addprofil',{nom: user.nom, description: user.description, 
        image: user.image, id: id_users})
      if (res.data){
        //actualise currentuser
        const res = await axios.get('api/user')
        this.$data.currentuser = res.data

        //actualise liste medecin si c'est le profil d'un medecins
        if (ismed){
          const res = await axios.get('/api/medecins')
          this.$data.medecins = res.data
        }
        alert("Profil enregistré")
      }
    },
    async postDocument(document){
      const res = await axios.post('api/document',document)

      if(res.data){
        alert("Données envoyé")
      }
    },
    async chooseClient(client){
      const res = await axios.post('api/reception',client)

      if (res.data){
        //actualise la table reception du medecin
        const res = await axios.get('/api/reception')
        this.$data.reception = res.data
        alert("Déchiffrage réussi")
      }
    }
  }
})
