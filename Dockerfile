# Utilisation de l'image officielle Node.js
FROM node:16

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package*.json ./
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Commande de démarrage
CMD ["npm", "start"]
