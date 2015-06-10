# Initialisation du projet pugh AngularJS + TypeScript


### Requis
Pour démarrer le projet, nodeJs doit être installé sur le poste de développement.


### Fonctionnalités

- Compilation typescript avec watcher
- Compilation less avec watcher
- Tests unitaires avec karma avec couverture pour jenkins
- Tests avec protractor
- Création d'une archive de distribution
- Fichier tsconfig.json
- Récupération des définitions de typage avec tsd
- Concaténation des fichiers avec prise en compte de bower main files
- tslint
- ngAnotate
- Uglify des fichiers js et css
- Compilation des html dans un fichier template.js
- Serveur de dev avec fichiers normaux
- Serveur de dist avec fichiers pour la production
- Internationalisation avec fichiers po et pot

### RAF


### Installation et lancement du serveur Node
`$ npm start`

Cette commande permet d'installer les packages mais également de lancer le serveur en livereload.


### Liste des URLS pour les interfaces

`$ curl -XGET http://localhost:9001/#/home`


### Liste des routes présentes sur le serveur Node.
`$ curl -XGET http://localhost:9001/api/users`
	[{"id":1,"mdp":"user1","firstName":"User1","lastName":"LastName"},{"id":2,"mdp":"user2","firstName":"User2","lastName":"LastName"}]

`$ curl -XGET http://localhost:9001/api/users/1`
{"id":1,"mdp":"user1","firstName":"User1","lastName":"LastName"}
