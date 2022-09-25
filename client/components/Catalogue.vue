<template>
    <div>
        <div class="nav">
            <div>
                <div>
                    <ul>
                        <li><button @click="logout()" id="btn-nav" class="nav-btn">Déconnexion</button></li>
                        <li><router-link to='/profil' class="nav-btn">Profil</router-link></li>
                        <li v-if="currentuser[0].status == 1"><router-link to='/reception' class="nav-btn">Reception</router-link></li>
                        <li v-if="currentuser[0].status == 0"><router-link to='/catalogue' class="nav-btn">Catalogue</router-link></li>
                    </ul>
                </div>
            </div>
	    </div> 
        <div class="body">
            <h1>Catalogue</h1>
            <article v-for="medecin in medecins" :key="medecin.nom">
                <div class="medecin">
                    <div class = "medecin_img" v-bind:style="{ backgroundImage: 'url('+ medecin.pdp +')'}"></div>

                    <div class="medecin-content" v-if="documents.id_medecin !== medecin.id_medecins">
                        <div class="medecin-title">
                            <h2>{{ medecin.nom }} - {{ medecin.description }}</h2>
                            <button id="choisir" @click="chooseMedecin(medecin)">Choisir</button>
                        </div>
                    </div>
                    <div class="medecin-content" v-else>
                        <div class="medecin-title">
                            <h2>Carte banquaire</h2>
                            <input type="text" placeholder="Nom/Prénom">
                            <input type="text" v-model="documents.carteBanquaire" placeholder="Numéro" maxlength="19" minlength="16">
                            <input type="date" placeholder="Date Validité">
                            <input type="text" placeholder="CVV" maxlength="3" size="2">
                            <h2>Carte vitale</h2>
                            <input type="text" v-model="documents.carteVitale" size="40" maxlength="15">
                            <h2>Autres documents</h2>
                            <input class="input_cat" type="file" @change="loadFile1($event)"><br>
                            <textarea id="output1" rows="10" cols="150"></textarea><br>
                            <input class="input_cat" type="file" @change="loadFile2($event)"><br>
                            <textarea id="output2" rows="10" cols="150"></textarea><br>
                            <br>
                            <label>Veuillez choisir une clef pour sécuriser vos documents : </label>
                            <input type="text" v-model="documents.clef">
                            <div id="valider-annuler">
                                <button id="valider" @click="sendChooseMedecin()">Valider</button>
                                <button id="annuler" @click="abortChooseMedecin()">Annuler</button>
                            </div>
                        </div>
                    </div>
                </div>
            </article>
        </div>
    </div>
</template>
<script>
module.exports = {
  props: {
    medecins: { type: Array, default: []},
    currentuser: { type: Array, default: []}
  },
  components: {
  },
  data () {
      return {
        documents:{
            id_medecin: -1,
            carteBanquaire: '',
            carteVitale: '',
            doc1: '',
            doc2: '',
            clef: ''
        }
      }
    },
    monted(){
        this.$emit('refreshuser')
    },
    methods: {
        logout(){
            this.$emit('logout')
        },
        chooseMedecin (medecin) {
            this.documents.id_medecin = medecin.id_medecins
        },
        abortChooseMedecin() {
            this.documents = {
                id_medecin: -1,
                carteBanquaire: '',
                carteVitale: '',
                doc1: '',
                doc2: '',
                clef: ''
            }
        },
        sendChooseMedecin () {

            this.$emit('postdocument', this.documents)
            this.abortChooseMedecin()
        },
        async loadFile1(event){
            let file = event.target.files[0]
            let text = await file.text()
            document.getElementById('output1').textContent = text
            this.documents.doc1 = text
        },
        async loadFile2(event){
            let file = event.target.files[0]
            let text = await file.text()
            document.getElementById('output2').textContent = text;
            this.documents.doc2 = text
        }
    }
}
</script>

<style scoped>

input{
    padding: 7px;
}

ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background-color: #333;
}

li{
    display: inline;
}

.nav-btn{
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
    float: right;
}

#btn-nav{
    background-color: #333;
}

/********************************************************/
/*                        Body                        */
/********************************************************/
.body {
	background: #005363  bottom center; 
	color: white;
    min-height: 100%;
    padding-top: 10px;
}
.body h1 {
	font-family: "Open sans", Arial;
	font-size: 30px;
	font-weight: bold;
	text-align: center;
	text-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
	color:white; ;
}

.body h2 {
	font-family: "Open sans", Arial;
	font-size: 20px;
	font-weight: bold;
	text-align: center;
	text-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
	color:black; ;
}

.body label{
    color: black;
    font-family: "Open sans", Arial;
}

.medecin{
    border-color: 3px solid black;
    background-color: cadetblue;
    display: flex;
    justify-content: space-between;
    margin-left: 40px;
    margin-right: 40px;
    margin-bottom: 35px;
}

.medecin_img{
    width: 150px;
    height: 200px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
}

.medecin-content{
    margin: auto;
}

.medecin-title{
    text-align: center;
}

.input_cat{
    color: black;
}

.medecin_btn{
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.8);
    color: rgba(255,255,255,.8);
    font-size: 15px;
    padding: 12px 36px;
}

#valider{
    background-color : rgb(36, 210, 36);
    color: white;
    padding: 7px;
}

#annuler{
    background-color : rgb(248, 11, 11);
    color: white;
    padding: 7px;
}

#valider-annuler{
    margin: 30px;
    text-align: center;
}

#choisir{
    border-radius: 30px;
    background-color : black;
    color: white;
    padding: 10px;
    font-size: 16px;
    font-family: "Open sans", Arial;
}

#choisir:hover{
    background-color : cadetblue;
    color: black;
    transition: 0.3s;
}
</style>