const express = require('express')
const res = require('express/lib/response')
const router = express.Router()
const bcrypt = require('bcryptjs')
const mysql = require('mysql');
const crypto =require("crypto-js");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "bd_medsecured"
    
});
db.connect(function(err) {
    if (err) throw err;
    console.log("Connecté à la BDD MySQL !")
});

router.post('/inscription', (req, res) => {
  
    const email = req.body.email;
    const password = req.body.password;
    const status = req.body.status;

    //verification email
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(email.match(mailformat)){
        //format email valide
        //hashage du mdp
        (async () => {
            try{
                //console.log(password)
                let hash = await bcrypt.hash(password,await bcrypt.genSalt(10))
                //console.log(hash)

                //verifie si le compte n'est pas déja dans la bdd
                if (status == 1){
                    var sql = "SELECT u.password FROM medecins u where u.email = '"+email+"'";
                db.query(sql, function (err, result, fields) {
                    if (err) throw err;
                    
                    if(result.length != 0){
                    //email present dans la bdd
                    res.json(false) 
                    }
                    else{
                        //email pas present dans la bdd
                        //créer une nouvelle ligne dans la bdd
                        var sql = "INSERT INTO medecins (email,password,status) VALUES ("+"'"+email+"'"+","+"'"+hash+"'"+","+status+")"
                        db.query(sql, function (err, result, fields) { if (err) throw err; })
                        res.json(true)
                    }
                })
                }
                else{
                    var sql = "SELECT u.password FROM clients u where u.email = '"+email+"'";
                    db.query(sql, function (err, result, fields) {
                        if (err) throw err;
                        
                        if(result.length != 0){
                        //email present dans la bdd
                        res.json(false) 
                        }
                        else{
                            //email pas present dans la bdd
                            //créer une nouvelle ligne dans la bdd
                            var sql = "INSERT INTO clients (email,password,status) VALUES ("+"'"+email+"'"+","+"'"+hash+"'"+","+status+")"
                            db.query(sql, function (err, result, fields) { if (err) throw err; })
                            res.json(true)
                        }
                    })
                }
                
            }
            catch(error){
                console.log(error.message)
            }
        })()
    }
    else{
        //email format invalide
        res.json(false)
    }
})

router.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    //verifie si le compte est dans la bdd
    var sql = "SELECT * FROM medecins u where u.email = '"+email+"'";
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
        
        if(result.length != 0){
            //email present dans la bdd
            //verifie si le mdp est bon
            let compare = bcrypt.compareSync(password,result[0].password)
            if (compare){
                //le mdp est bon
                req.session.currentuser = result
                //console.log(req.session)
                res.json([1,req.session.currentuser])
            }
            else{
                //le mdp n'est pas bon
                res.json([-1,undefined])
            }
        }
        else{
            //email pas present dans cette bdd
            var sql = "SELECT * FROM clients u where u.email = '"+email+"'";
            db.query(sql, function (err, result, fields) {
                if (err) throw err;
                
                if(result.length != 0){
                    //email present dans la bdd
                    //verifie si le mdp est bon
                    let compare = bcrypt.compareSync(password,result[0].password)
                    if (compare){
                        //le mdp est bon
                        req.session.currentuser = result
                        //console.log(req.session)
                        res.json([1,req.session.currentuser])
                    }
                    else{
                        //le mdp n'est pas bon
                        res.json([-1,undefined])
                    }
                }
                else{
                    //email pas present dans la bdd
                    res.json([0,undefined])
                }
            })
        }
    })
})

router.get('/logout', (req, res) =>{

    if (req.session.currentuser === undefined){
        res.json(false)
    }
    else{ 
        req.session.destroy();
        res.json(true)
    }
    
})

router.post('/addprofil', (req, res) =>{
    const nom = req.body.nom;
    const description = req.body.description;
    const image = req.body.image;
    const id = req.body.id;

    console.log(nom,description,image,id)
    //medecin
    if (req.session.currentuser[0].status == 1 ){

        var sql = "UPDATE medecins u SET u.nom = '"+nom+"', u.description = '"+description+"', u.pdp = '"+image+"' WHERE u.id_medecins = "+id+";"
        db.query(sql, function (err, result, fields) {
          if (err) throw err;
          
          //actualise l'users modifié
          var sql = "SELECT * FROM medecins u where u.id_medecins = "+id;
          db.query(sql, function (err, result, fields) {
            if (err) throw err;
                req.session.currentuser = result
                res.json(true)
          });
    
        });
    }
    else{

        var sql = "UPDATE clients u SET u.nom = '"+nom+"', u.description = '"+description+"', u.pdp = '"+image+"' WHERE u.id_clients = "+id+";"
        db.query(sql, function (err, result, fields) {
          if (err) throw err;
          
          //actualise l'users modifié
          var sql = "SELECT * FROM clients u where u.id_clients = "+id;
          db.query(sql, function (err, result, fields) {
            if (err) throw err;
                req.session.currentuser = result
                res.json(true)
          });
    
        }); 
    }

    
})

router.get('/medecins', (req, res) =>{
    db.query("SELECT u.id_medecins,u.nom,u.description,u.pdp FROM medecins u WHERE u.status = 1", function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });
})

router.post('/document', (req, res) =>{
    
    const carteBanquaire = req.body.carteBanquaire;
    const carteVitale = req.body.carteVitale;
    const doc1 = req.body.doc1;
    const doc2 = req.body.doc2;
    const clef = req.body.clef;
    const medecinId = req.body.id_medecin;

    /*
    console.log(carteBanquaire)
    console.log(carteVitale)
    console.log(doc1)
    console.log(doc2)
    console.log(clef)
    console.log(medecinId)
    console.log(userdId)
    console.log(encrypted_CB)
    console.log(encrypted_CV)
    */

    var encrypted_CB = crypto.AES.encrypt(carteBanquaire, clef).toString();
    var encrypted_CV = crypto.AES.encrypt(carteVitale, clef).toString();
    var encrypted_doc1 = crypto.AES.encrypt(doc1, clef).toString();
    var encrypted_doc2 = crypto.AES.encrypt(doc2, clef).toString();
    var userdId = req.session.currentuser[0].id_clients

    
    var sql = "INSERT INTO reception (id_medecins,id_clients,cb,cv,doc1,doc2) VALUES("+medecinId+","+userdId+",'"+encrypted_CB+"','"+encrypted_CV+"','"+encrypted_doc1+"','"+encrypted_doc2+"')"
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        res.json(true);
    });
    //var decrypted_CB = crypto.AES.decrypt(encrypted_CB, clef).toString(crypto.enc.Utf8)
    
})

router.get('/reception', (req,res) =>{
    var userdId = req.session.currentuser[0].id_medecins
    db.query("SELECT c.id_clients,c.nom,c.description,c.pdp,r.cb,r.cv,r.doc1,r.doc2 FROM reception r INNER JOIN clients c ON c.id_clients = r.id_clients WHERE r.id_medecins = "+userdId, function (err, result, fields) {
        if (err) throw err;
        res.json(result);
    });

})

router.post('/reception', (req,res) =>{
    const id_clients = req.body.id_clients;
    const id_medecins = req.session.currentuser[0].id_medecins
    const cb = req.body.cb;
    const cv = req.body.cv;
    const doc1 = req.body.doc1;
    const doc2 = req.body.doc2;
    const clef = req.body.clef;

    /*
    console.log(id_clients,cb,cv)
    console.log(doc1)
    console.log(doc2)
    console.log(decrypted_cb)
    console.log(decrypted_cv)
    console.log(decrypted_doc1)
    console.log(decrypted_doc2)
    */
    
    var decrypted_cb = crypto.AES.decrypt(cb, clef).toString(crypto.enc.Utf8)
    var decrypted_cv = crypto.AES.decrypt(cv, clef).toString(crypto.enc.Utf8)
    var decrypted_doc1 = crypto.AES.decrypt(doc1, clef).toString(crypto.enc.Utf8)
    var decrypted_doc2 = crypto.AES.decrypt(doc2, clef).toString(crypto.enc.Utf8)


    var sql = "UPDATE reception r SET r.cb = '"+decrypted_cb+"', r.cv = '"+decrypted_cv+"', r.doc1 = '"+decrypted_doc1+"', r.doc2 = '"+decrypted_doc2+"' WHERE r.id_medecins = "+id_medecins+" and r.id_clients = "+id_clients
    db.query(sql, function (err, result, fields) {
        if (err) throw err;

        res.json(true);
    });

    
})

router.post('/addpanier', (req,res) =>{

    const userId = req.body.userid
    const livreId = req.body.livreid;
    
    //verifie si le livre n'est pas déja dans le panier
    db.query("SELECT * FROM panier p where p.id_users = "+userId+" and p.id_livres = "+livreId, function (err, result, fields) {
        if (err) throw err;

        if (result.length == 0){
            //livre pas dans le panier de l'user
            //on rajoute le livre dans le panier de l'user
            db.query("INSERT INTO panier (id_users,id_livres) VALUES("+userId+","+livreId+")", function (err, result, fields) {
                if (err) throw err;
                res.json(true);
            });
        }
        else{
            //livre déjà dans le panier de l'user
            res.json(false)
        }
    });
    
})

router.post('/deletelivre', (req,res) =>{
    const livreId = req.body.livreid;
    //supprime le livre de la table panier
    db.query("DELETE FROM panier p WHERE p.id_livres = "+livreId, function (err, result, fields) {
        if (err) throw err;
    });
    //supprime le livre de la table livres
    db.query("DELETE FROM livres l WHERE l.id_livres = "+livreId, function (err, result, fields) {
        if (err) throw err;
        res.json(true)
    });
})

router.post('/addlivre', (req,res) =>{
    const nom = req.body.nom
    const quantity = parseInt(req.body.quantity)
    const image = req.body.image
    
    // vérification de la validité des données d'entrée
    if (typeof nom !== 'string' || nom === '' ||
        typeof image !== 'string' || image === '' ||
        isNaN(quantity) || quantity <= 0) {
      res.status(400).json({ message: 'bad request' })
      return
    }
  
    var sql = "INSERT INTO livres (nom,quantity,image) VALUES ("+"'"+nom+"'"+","+quantity+","+"'"+image+"')"
    db.query(sql, function (err, result, fields) {
      if (err) throw err;
      res.json("Livre ajouté");
    });

})

router.post('/panier', (req,res) =>{
    const userId = req.body.id_users;

    //recupere tous les livres (dans la table livres) qui correspond à l'id_users (dans la table panier)
    var sql = "SELECT l.id_livres,l.nom,l.quantity,l.image FROM livres l INNER JOIN panier p on p.id_livres = l.id_livres WHERE p.id_users = "+userId
    db.query(sql, function (err, result, fields) {
      if (err) throw err;
      if (result.length == 0){
          //panier vide
          res.json(result)
      }
      else{
          //panier rempli
          res.json(result)
      }
    });

})

router.post('/deletelpanier', (req,res) =>{
    const livreId = req.body.livreid
    const userId = req.body.userid;

    //supprime de la table panier le livre correspond à l'user
    db.query("DELETE FROM panier p WHERE p.id_livres = "+livreId+" and p.id_users = "+userId, function (err, result, fields) {
        if (err) throw err;
        res.json(true)
    });
})

router.post('/validatepanier', (req,res) =>{
    const userId = req.body.userid;

    //-1 à la quantity des livres qui sont dans le panier
    var sql = "UPDATE livres l INNER JOIN panier p on p.id_livres = l.id_livres SET l.quantity = l.quantity - 1 WHERE p.id_users = "+userId
    db.query(sql, function (err, result, fields) {
        if (err) throw err;
    });
    //vide le panier de l'user
    db.query("DELETE FROM panier p WHERE p.id_users = "+userId, function (err, result, fields) {
        if (err) throw err;
        res.json(true)
    });

})

router.get('/user', (req,res) =>{
    res.json(req.session.currentuser)
})

module.exports = router
