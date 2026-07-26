# Red Store

Application e-commerce MERN, composée de deux projets npm indépendants :

- `backend/` — API REST Express 5 + MongoDB (Mongoose), authentification JWT, upload d'images via Multer + Cloudinary.
- `frontend/` — React 19 + Vite, React Router v7, Redux (redux + redux-thunk), React-Bootstrap.

Il n'y a pas de `package.json` à la racine : il faut toujours se placer dans `backend/` ou `frontend/` avant de lancer une commande npm.

## Installation

### Backend

```bash
cd backend
npm install
npm run dev
```

Avant de lancer le backend, copie `backend/.env.example` en `backend/.env` et renseigne les vraies valeurs (URI MongoDB, clé secrète JWT, identifiants Cloudinary, etc.).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Scripts disponibles

### Backend (depuis `backend/`)

```bash
npm run dev    # démarre l'API avec nodemon (auto-restart)
npm start      # démarre l'API une seule fois avec node
```

### Frontend (depuis `frontend/`)

```bash
npm run dev      # démarre le serveur de développement Vite
npm run build    # build de production
npm run lint     # exécute ESLint
npm run preview  # prévisualise le build de production
```

## Configuration

Le fichier `backend/.env` doit contenir les variables suivantes (voir `backend/.env.example`) :

- `PORT`
- `MONGODB_URI`
- `SECRET_KEY`
- `CLOUD_NAME`
- `API_KEY`
- `API_SECRET`

Ce fichier est ignoré par Git et ne doit jamais être commité avec de vraies valeurs.
