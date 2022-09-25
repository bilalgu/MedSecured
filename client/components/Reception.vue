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
            <h1>Reception</h1>
            <article v-for="client in reception" :key="client.nom" class="article">
                <div class="client">
                    <div id = "pdp_img" v-bind:style="{ backgroundImage: 'url('+ client.pdp +')'}"></div>
                    <div class="client-content">
                        <h2>Nom : {{ client.nom }}</h2>
                        <h2>Description : {{ client.description }}</h2>
                        <h2>CB : {{ client.cb }}</h2>
                        <h2>CV : {{ client.cv }}</h2>
                        <h2>Doc1 : </h2>
                        <p class="pdoc">{{ client.doc1 }}</p>
                        <h2>Doc2 : </h2>
                        <p class="pdoc">{{ client.doc2 }}</p><br><br>
                        <input type="text" v-model="clef">
                        <button id="choisir" @click="chooseClient(client)">Déchiffrer</button>
                    </div>
                </div>
            </article>
        </div>
    </div>   
</template>
<script>
module.exports = {
  props: {
    currentuser: { type: Array, default: []},
    reception: { type: Array, default: []}
  },
  data () {
      return { 
        clef
      }
    },
    beforeMount(){
        
    },
    methods: {
        logout(){
            this.$emit('logout')
        },
        chooseClient(client){
            client.clef = this.clef
            this.$emit('chooseclient',client)
        }
    }
}

</script>

<style scoped>
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
	color:white; ;
}

#pdp_img{
    width: 100px;
    height: 100px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px
}

.client-content{
    text-align: center;
    background-color: cadetblue;
    margin: 35px 100px;
    border-radius: 10px;
    padding-bottom: 20px;
    padding-top: 0.5px;
    margin-bottom: 0px;
}

#choisir{
    border-radius: 30px;
    background-color : black;
    color: white;
    padding: 10px;
    font-size: 16px;
    font-family: "Open sans", Arial;
}

.article{
    margin-top: 50px;
}

.pdoc{
    background-color: white;
    display: initial;
    color: black;
    padding: 5px;
    border: 1px solid black;
    border-radius: 5%;
}
</style>