<template>
    <div>
        <div class="nav">
            <div>
                <div>
                    <ul>
                        <li><button @click="logout()" id="btn-nav" class="nav-btn">Déconnexion</button></li>
                        <li><router-link to='/profil' class="nav-btn">Profil</router-link></li>
                        <li v-if="currentuser[0].status == 1"><router-link to='/Reception' class="nav-btn">Reception</router-link></li>
                        <li v-if="currentuser[0].status == 0"><router-link to='/catalogue' class="nav-btn">Catalogue</router-link></li>
                    </ul>
                </div>
            </div>
	    </div> 
        <div class="body">
            <h1>Profil</h1>
            <h2>Nom : {{ currentuser[0].nom }}</h2>
            <h2>Description : {{ currentuser[0].description }}</h2>
            <h2>Photo de Profil : </h2>
            <div id = "pdp_img" v-bind:style="{ backgroundImage: 'url('+ currentuser[0].pdp +')'}"></div>

            <form>
            <div id="input-grp">
                <input type="text" v-model="user.nom" placeholder="Nom" required class="form-control">
                <input type="text" v-model="user.description" placeholder="Description" required class="form-control">
                <input type="text" v-model="user.image" required placeholder="Lien image pdp" class="form-control">
            </div>
            
            <div id="btn-grp">
                <button @click="addProfil()" class="btn-default">Valider</button>
            </div>
        </form>
        </div>
    </div>   
</template>
<script>
module.exports = {
  props: {
    currentuser: { type: Array, default: []}
  },
  data () {
      return {
        user: {
            nom: "",
            descritpion: "",
            image: ""
        }
    }
    },
    monted(){
        this.$emit('refreshuser')
    },
    updated(){
    },
    methods: {
        logout(){
            this.$emit('logout')
        },
        addProfil(){
            this.$emit('addprofil', this.user)
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

form{
    text-align: center;
}

#btn-grp{
    margin-top: 60px;
}

#input-grp{
    margin-top: 50px;
}

#pdp_img{
    width: 100px;
    height: 100px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-left: auto;
    margin-right: auto;
}

.btn-default{
    text-align: center;
    background: rgba(255,255,255,.06);
	border: 1px solid rgba(255,255,255,.8);
	color: rgba(255,255,255,.8);
	font-size:15px;
	padding: 12px 36px;
}


.body .form-control { 
    background: rgba(5,5,5,0.4); 
    border: 0; 
    color: white; 
    font-size:18px;
}
.body .form-control::-webkit-input-placeholder { color: rgba(255,255,255,0.3); }
</style>