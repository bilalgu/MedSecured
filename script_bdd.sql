#réinitialise toutes les tables
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS reception;

#initialisation des tables
CREATE TABLE clients(
	id_clients INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(50),
    password VARCHAR(100),
    status BOOLEAN,
    pdp VARCHAR(250),
	nom VARCHAR(50),
    description VARCHAR(100),
    PRIMARY KEY(id_clients)
);  

CREATE TABLE medecins(
	id_medecins INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(50),
    password VARCHAR(100),
    status BOOLEAN,
    pdp VARCHAR(250),
	nom VARCHAR(50),
    description VARCHAR(100),
    PRIMARY KEY(id_medecins)
);    

CREATE TABLE reception(
	id_medecins INT NOT NULL,
	id_clients INT NOT NULL,
    cb VARCHAR(250),
    cv VARCHAR(250),
    doc1 TEXT,
    doc2 TEXT,
    PRIMARY KEY(id_medecins,id_clients),
    FOREIGN KEY(id_medecins) REFERENCES medecins(id_medecins),
    FOREIGN KEY(id_clients) REFERENCES clients(id_clients)
);

#SET SQL_SAFE_UPDATES = 0;  #permet d'enlever la sécurité qui empeche de suppr toutes les valeurs d'une table
#réinitialise toutes les valeurs des tables
#TRUNCATE TABLE users;

#initialisation des valeurs des tables
/*
INSERT INTO users (id_users,email,password,admin)
VALUES
(1,'bilal.guirre@gmail.com','bilaladmin',true),
(2,'user2@gmail.com','test2',false);
*/

#ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
#flush privileges;

#verification des tables
SELECT * FROM clients;
SELECT * FROM medecins;
SELECT * FROM reception;

UPDATE users u SET u.status = true where u.id_users = 1;
UPDATE users u SET u.pdp = "https://us.123rf.com/450wm/thesomeday123/thesomeday1231712/thesomeday123171200009/91087331-icône-de-profil-d-avatar-par-défaut-pour-le-mâle-espace-réservé-photo-gris-vecteur-d-illustrations.jpg?ver=6"
WHERE u.id_users = 2;

SELECT c.nom,c.description,c.pdp,r.cb,r.cv,r.doc1,r.doc2 FROM reception r 
INNER JOIN clients c ON c.id_clients = r.id_clients
WHERE r.id_medecins = 2;

SELECT u.nom,u.description,u.pdp FROM users u WHERE u.status = 1;

UPDATE reception r SET r.cb = 'o', r.cv = 'k', r.doc1 = 'oui', r.doc2 = 'ouai'
WHERE r.id_medecins = 1 and r.id_clients = 1;