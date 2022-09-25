<template>
    <div class="body">
        <h1>Med Secured</h1>
        <div id="formulaire">
            <form>
                <div id="input-grp">
                    <input type="email" class="form-control" v-model="user.email" placeholder="Email" required>
                    <input type="password" v-model="user.password" placeholder="Mot de passe" required class="form-control">
                    <label>Médecin ?</label>
                    <input type="checkbox" name="medecin" v-model="user.status" style="margin-top: 5px;">
                </div>          
                <div id="btn-grp">
                    <button @click="login()" class="btn-default">Connexion</button>
                    <button @click="inscription()" class="btn-default">Inscription</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
module.exports = {
  data () {
    return {
        user: {
            email: "",
            password: "",
            status: false
        }
    }
  },
  methods: {
    login() {
        this.$emit('login', this.user)
    },
    inscription(){
        this.$emit('inscription', this.user)
    }
  }
}
</script>


<style scoped>
/********************************************************/
/*                     Typography                       */
/********************************************************/
h1, h2, h3, h4, h5, h6 { 
	font-family: "Open sans", Helvetica, Arial;
	font-weight: 300;
    color: #00b0b0;
}

/********************************************************/
/*                        Body                        */
/********************************************************/
.body {
	background: #005363  bottom center; 
	color: white;
    min-height: 100%;
    padding-top: 30px;
}
.body h1 {
	font-family: "Open sans", Arial;
	font-size: 40px;
	font-weight: bold;
	text-align: center;
	text-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
	color:white; ;
}

.body h2 {
	font-family: "Open sans", Arial;
	font-weight: bold;
    font-size: 17px;
	text-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);
	color:white;
}

form{
    text-align: center;
}
#formulaire{
    border-radius: 6%;
    border-color: 3px solid black;
    color: black;
    background-color: cadetblue;
    display: flex;
    justify-content: space-between;
    margin-left: 500px;
    margin-right: 500px;
    margin-bottom: 35px;
    text-align: center;
}

#btn-grp{
    margin-top: 60px;
    text-align: center;
}

#input-grp{
    margin-left: 10px;
    text-align: center;
    margin-top: 50px;
}


.form-control{
    background-color: white;
    border-top: none;
    border-right: none;
    border-left: none;
    border-bottom: 2px solid black;
    padding: 10px;
}

.btn-default{
    background-color: black;
    color: white;
    border: none;
    border-radius: 20px;
    text-align: center;
	font-size:15px;
	padding: 12px 36px;
}

.btn-default:hover{
    background-color: cadetblue;
    color: black;
    transition: 0.3s;
}
/*.body .form-control::-webkit-input-placeholder { color: rgba(255,255,255,0.3); }*/


</style>