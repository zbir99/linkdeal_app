# 🧪 Guide Complet de Test Postman - LinkDeal API

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Configuration Postman](#configuration-postman)
3. [Obtenir un Token Auth0](#obtenir-un-token-auth0)
4. [Tests par Catégorie](#tests-par-catégorie)
   - [Inscription Publique](#1-inscription-publique)
   - [Authentification](#2-authentification)
   - [Inscription Sociale](#3-inscription-sociale)
   - [Reset Mot de Passe](#4-reset-mot-de-passe)
   - [Gestion Admin - Mentors](#5-gestion-admin---mentors)
   - [Gestion Admin - Mentees](#6-gestion-admin---mentees)
   - [Invitation Admin](#7-invitation-admin)
5. [Scénarios de Test Complets](#scénarios-de-test-complets)
6. [Vérifications dans la Base de Données](#vérifications-dans-la-base-de-données)

---

## 🔧 Prérequis

### 1. Démarrer le Serveur Django

```bash
cd "C:\3ACI\Porjet Logiciel\LinkDeal"
..\venv\Scripts\activate
python manage.py migrate
python manage.py runserver
```

Le serveur sera accessible sur : `http://localhost:8000`

### 2. Variables d'Environnement Requises

Assure-toi d'avoir configuré dans ton `.env` :
- `AUTH0_DOMAIN`
- `AUTH0_API_AUDIENCE`
- `AUTH0_SPA_CLIENT_ID`
- `AUTH0_SPA_CLIENT_SECRET`
- `AUTH0_MGMT_CLIENT_ID`
- `AUTH0_MGMT_CLIENT_SECRET`
- `AUTH0_MENTOR_ROLE_ID`
- `AUTH0_MENTEE_ROLE_ID`
- `AUTH0_ADMIN_ROLE_ID`
- `AUTH0_SUPER_ADMIN_ROLE_ID`
- `AUTH0_DB_CONNECTION`

---

## ⚙️ Configuration Postman

### Variables d'Environnement Postman

Crée un environnement Postman avec ces variables :

| Variable | Valeur Exemple | Description |
|----------|----------------|-------------|
| `base_url` | `http://localhost:8000` | URL de base de l'API |
| `auth0_domain` | `your-tenant.auth0.com` | Domaine Auth0 |
| `auth0_audience` | `https://api.linkdeal.com` | Audience Auth0 API |
| `spa_client_id` | `abc123...` | Client ID SPA |
| `spa_client_secret` | `xyz789...` | Client Secret SPA |
| `access_token` | (sera rempli automatiquement) | Token JWT |
| `admin_token` | (sera rempli automatiquement) | Token admin |
| `super_admin_token` | (sera rempli automatiquement) | Token super_admin |
| `mentor_uuid` | (sera rempli après création) | UUID d'un mentor |
| `mentee_uuid` | (sera rempli après création) | UUID d'un mentee |

---

## 🔐 Obtenir un Token Auth0

### Méthode 1 : Resource Owner Password Grant (Pour Tests)

**Endpoint** : `POST https://{{auth0_domain}}/oauth/token`

**Headers** :
```
Content-Type: application/json
```

**Body (JSON)** :
```json
{
  "grant_type": "password",
  "client_id": "{{spa_client_id}}",
  "client_secret": "{{spa_client_secret}}",
  "audience": "{{auth0_audience}}",
  "username": "user@example.com",
  "password": "Password123!",
  "scope": "openid profile email"
}
```

**Réponse** :
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

**Action Postman** :
1. Crée une requête "Get Auth0 Token"
2. Dans l'onglet **Tests**, ajoute ce script pour sauvegarder automatiquement le token :
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.access_token);
    console.log("Token saved to environment");
}
```

---

## 📝 Tests par Catégorie

---

## 1. Inscription Publique

### 1.1 Inscription Mentee (Email/Password)

**Endpoint** : `POST {{base_url}}/auth/register/mentee/`

**Headers** :
```
Content-Type: multipart/form-data
```

**Body (form-data)** :
| Clé | Type | Valeur | Requis |
|-----|------|--------|--------|
| `email` | Text | `mentee1@test.com` | ✅ |
| `password` | Text | `Test@1234` | ✅ |
| `password_confirm` | Text | `Test@1234` | ✅ |
| `full_name` | Text | `John Mentee` | ✅ |
| `field_of_study` | Text | `Computer Science` | ✅ |
| `country` | Text | `Morocco` | ✅ |
| `profile_picture` | File | (fichier image) | ❌ |

**Réponse Attendue** : `201 Created`
```json
{
  "id": "uuid",
  "user": {
    "id": "uuid",
    "email": "mentee1@test.com",
    "role": "mentee"
  },
  "full_name": "John Mentee",
  "email": "mentee1@test.com",
  "field_of_study": "Computer Science",
  "country": "Morocco"
}
```

**Tests Postman** :
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Response contains mentee data", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData.user.role).to.eql('mentee');
});
```

---

### 1.2 Inscription Mentor (Email/Password)

**Endpoint** : `POST {{base_url}}/auth/register/mentor/`

**Headers** :
```
Content-Type: multipart/form-data
```

**Body (form-data)** :
| Clé | Type | Valeur | Requis |
|-----|------|--------|--------|
| `email` | Text | `mentor1@test.com` | ✅ |
| `password` | Text | `Test@1234` | ✅ |
| `password_confirm` | Text | `Test@1234` | ✅ |
| `full_name` | Text | `Jane Mentor` | ✅ |
| `professional_title` | Text | `Software Engineer` | ✅ |
| `location` | Text | `Casablanca` | ✅ |
| `linkedin_url` | Text | `https://linkedin.com/in/jane` | ✅ |
| `bio` | Text | `Experienced software developer` | ✅ |
| `languages` | Text | `French, English` | ✅ |
| `country` | Text | `Morocco` | ✅ |
| `profile_picture` | File | (fichier image) | ❌ |
| `cv` | File | (fichier PDF) | ✅ |

**Réponse Attendue** : `201 Created`
```json
{
  "id": "uuid",
  "user": {
    "id": "uuid",
    "email": "mentor1@test.com",
    "role": "mentor"
  },
  "full_name": "Jane Mentor",
  "status": "pending",
  ...
}
```

**Tests Postman** :
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Mentor status is pending", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.eql('pending');
    
    // Sauvegarder l'UUID pour les tests suivants
    pm.environment.set("mentor_uuid", jsonData.id);
});
```

---

## 2. Authentification

### 2.1 Obtenir Mon Profil

**Endpoint** : `GET {{base_url}}/auth/me/`

**Headers** :
```
Authorization: Bearer {{access_token}}
```

**Réponse Attendue** : `200 OK`
```json
{
  "auth0_id": "auth0|abc123",
  "email": "user@test.com",
  "role": "mentee",
  "roles": ["mentee"],
  "app_metadata": {
    "role": "mentee",
    "approval_status": "approved"
  },
  "permissions": ["access:api", "profile:read_own"]
}
```

**Tests Postman** :
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("User data is present", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('auth0_id');
    pm.expect(jsonData).to.have.property('email');
    pm.expect(jsonData).to.have.property('role');
});
```

---

## 3. Inscription Sociale

> **Note** : Pour tester les endpoints sociaux, tu dois d'abord obtenir un token via Google/LinkedIn. Pour les tests Postman, tu peux utiliser un token obtenu via le frontend ou créer un utilisateur social dans Auth0 Dashboard et utiliser le Password Grant.

### 3.1 Inscription Mentee Sociale

**Endpoint** : `POST {{base_url}}/auth/register/mentee/social/`

**Headers** :
```
Authorization: Bearer {{access_token}}
Content-Type: multipart/form-data
```

**Body (form-data)** :
| Clé | Type | Valeur | Requis |
|-----|------|--------|--------|
| `full_name` | Text | `Social Mentee` | ✅ |
| `field_of_study` | Text | `Data Science` | ✅ |
| `country` | Text | `Morocco` | ✅ |
| `profile_picture` | File | (fichier image) | ❌ |

**Réponse Attendue** : `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "social@test.com",
    "role": "mentee"
  }
}
```

---

### 3.2 Inscription Mentor Sociale

**Endpoint** : `POST {{base_url}}/auth/register/mentor/social/`

**Headers** :
```
Authorization: Bearer {{access_token}}
Content-Type: multipart/form-data
```

**Body (form-data)** :
| Clé | Type | Valeur | Requis |
|-----|------|--------|--------|
| `full_name` | Text | `Social Mentor` | ✅ |
| `professional_title` | Text | `Senior Developer` | ✅ |
| `location` | Text | `Casablanca` | ✅ |
| `linkedin_url` | Text | `https://linkedin.com/in/social` | ✅ |
| `bio` | Text | `10 years of experience` | ✅ |
| `languages` | Text | `French, English` | ✅ |
| `country` | Text | `Morocco` | ✅ |
| `profile_picture` | File | (fichier image) | ❌ |
| `cv` | File | (fichier PDF) | ✅ |

**Réponse Attendue** : `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "social@test.com",
    "role": "mentor",
    "status": "pending"
  }
}
```

---

## 4. Reset Mot de Passe

### 4.1 Demander un Reset (DB users)

**Endpoints** :
- `POST {{base_url}}/auth/password/reset/`
- `POST {{base_url}}/auth/reset-password/` (alias)

**Headers** :
```
Content-Type: application/json
```

**Body (JSON)** :
```json
{
  "email": "user@example.com"
}
```

**Réponse Attendue** : `200 OK` (toujours, même si l'email n'existe pas)
```json
{
  "success": true,
  "message": "If an account exists for this email, a password reset link has been sent."
}
```

**Tests Postman** :
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response is always success (no email leak)", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
});
```

### 4.2 Cas Spécifiques
- **Utilisateur DB (email/password)** : un email Auth0 de reset est envoyé.
- **Utilisateur social seulement (Google/LinkedIn)** : aucune action Auth0, mais la réponse reste 200 OK et générique (pas de fuite d'existence).
- **Email invalide** : `400 Bad Request` avec message d'erreur de format.

---

## 5. Gestion Admin - Mentors

> **Note** : Tous ces endpoints nécessitent un token d'admin ou super_admin.

### 5.1 Lister les Mentors par Statut

**Endpoint** : `GET {{base_url}}/auth/admin/mentors/pending/`

**Query Params** :
- `status` : `pending` (défaut), `approved`, `rejected`, `banned`

**Headers** :
```
Authorization: Bearer {{admin_token}}
```

**Exemples** :
- `GET .../pending/?status=pending` → Liste des mentors en attente
- `GET .../pending/?status=approved` → Liste des mentors approuvés
- `GET .../pending/?status=banned` → Liste des mentors bannis

**Réponse Attendue** : `200 OK`
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "auth0_id": "auth0|abc123",
    "full_name": "Jane Mentor",
    "email": "mentor1@test.com",
    "status": "pending",
    "created_at": "2025-01-01T00:00:00Z",
    ...
  }
]
```

---

### 5.2 Détail d'un Mentor

**Endpoint** : `GET {{base_url}}/auth/admin/mentors/{{mentor_uuid}}/`

**Headers** :
```
Authorization: Bearer {{admin_token}}
```

**Réponse Attendue** : `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "full_name": "Jane Mentor",
  "email": "mentor1@test.com",
  "professional_title": "Software Engineer",
  "location": "Casablanca",
  "linkedin_url": "https://linkedin.com/in/jane",
  "bio": "Experienced software developer",
  "languages": "French, English",
  "country": "Morocco",
  "status": "pending",
  "cv_url": "http://localhost:8000/media/...",
  "profile_picture_url": "http://localhost:8000/media/...",
  ...
}
```

---

### 5.3 Approuver un Mentor

**Endpoint** : `POST {{base_url}}/auth/admin/mentors/{{mentor_uuid}}/approve/`

**Headers** :
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body** : (vide ou `{}`)

**Réponse Attendue** : `200 OK`
```json
{
  "success": true,
  "message": "Mentor approved successfully.",
  "data": {
    "id": "uuid",
    "status": "approved",
    ...
  }
}
```

**Tests Postman** :
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Mentor status is approved", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.status).to.eql('approved');
});
```

---

### 5.4 Rejeter un Mentor

**Endpoint** : `POST {{base_url}}/auth/admin/mentors/{{mentor_uuid}}/reject/`

**Headers** :
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body** : (vide ou `{}`)

**Réponse Attendue** : `200 OK`
```json
{
  "success": true,
  "message": "Mentor rejected successfully.",
  "data": {
    "id": "uuid",
    "status": "rejected",
    ...
  }
}
```

---

### 5.5 Bannir un Mentor

**Endpoint** : `POST {{base_url}}/auth/admin/mentors/{{mentor_uuid}}/ban/`

**Headers** :
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body (JSON, optionnel)** :
```json
{
  "reason": "Violation des conditions d'utilisation"
}
```

**Prérequis** : Mentor doit être en statut `approved`

**Réponse Attendue** : `200 OK`
```json
{
  "success": true,
  "message": "Mentor banned successfully.",
  "data": {
    "id": "uuid",
    "status": "banned",
    "banned_at": "2025-01-01T12:00:00Z",
    "ban_reason": "Violation des conditions d'utilisation",
    "banned_by_email": "admin@test.com",
    ...
  }
}
```

**Tests Postman** :
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Mentor is banned", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.data.status).to.eql('banned');
    pm.expect(jsonData.data.banned_at).to.exist;
});
```

---

### 5.6 Débannir un Mentor (Super Admin uniquement)

**Endpoint** : `POST {{base_url}}/auth/admin/mentors/{{mentor_uuid}}/unban/`

**Headers** :
```
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

**Body** : (vide ou `{}`)

**Prérequis** : Mentor doit être en statut `banned`

**Réponse Attendue** : `200 OK`
```json
{
  "success": true,
  "message": "Mentor unbanned and restored to approved.",
  "data": {
    "id": "uuid",
    "status": "approved",
    ...
  }
}
```

---

## 6. Gestion Admin - Mentees

### 6.1 Lister les Mentees

**Endpoint** : `GET {{base_url}}/auth/admin/mentees/`

**Query Params** :
- `status` : `active` (défaut), `banned`

**Headers** :
```
Authorization: Bearer {{admin_token}}
```

**Exemples** :
- `GET .../mentees/?status=active` → Liste des mentees actifs
- `GET .../mentees/?status=banned` → Liste des mentees bannis

**Réponse Attendue** : `200 OK`
```json
[
  {
    "id": "uuid",
    "user_id": "uuid",
    "auth0_id": "auth0|abc123",
    "full_name": "John Mentee",
    "email": "mentee1@test.com",
    "field_of_study": "Computer Science",
    "country": "Morocco",
    "status": "active",
    "created_at": "2025-01-01T00:00:00Z",
    ...
  }
]
```

---

### 6.2 Détail d'un Mentee

**Endpoint** : `GET {{base_url}}/auth/admin/mentees/{{mentee_uuid}}/`

**Headers** :
```
Authorization: Bearer {{admin_token}}
```

**Réponse Attendue** : `200 OK`
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "full_name": "John Mentee",
  "email": "mentee1@test.com",
  "field_of_study": "Computer Science",
  "country": "Morocco",
  "status": "active",
  "profile_picture_url": "http://localhost:8000/media/...",
  ...
}
```

---

### 6.3 Bannir un Mentee

**Endpoint** : `POST {{base_url}}/auth/admin/mentees/{{mentee_uuid}}/ban/`

**Headers** :
```
Authorization: Bearer {{admin_token}}
Content-Type: application/json
```

**Body (JSON, optionnel)** :
```json
{
  "reason": "Comportement inapproprié"
}
```

**Prérequis** : Mentee doit être en statut `active`

**Réponse Attendue** : `200 OK`
```json
{
  "success": true,
  "message": "Mentee banned successfully.",
  "data": {
    "id": "uuid",
    "status": "banned",
    "banned_at": "2025-01-01T12:00:00Z",
    "ban_reason": "Comportement inapproprié",
    "banned_by_email": "admin@test.com",
    ...
  }
}
```

---

### 6.4 Débannir un Mentee (Super Admin uniquement)

**Endpoint** : `POST {{base_url}}/auth/admin/mentees/{{mentee_uuid}}/unban/`

**Headers** :
```
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

**Body** : (vide ou `{}`)

**Prérequis** : Mentee doit être en statut `banned`

**Réponse Attendue** : `200 OK`
```json
{
  "success": true,
  "message": "Mentee unbanned and restored to active.",
  "data": {
    "id": "uuid",
    "status": "active",
    ...
  }
}
```

---

## 7. Invitation Admin

### 7.1 Inviter un Admin (Super Admin uniquement)

**Endpoint** : `POST {{base_url}}/auth/admin/admins/`

**Headers** :
```
Authorization: Bearer {{super_admin_token}}
Content-Type: application/json
```

**Body (JSON)** :
```json
{
  "email": "newadmin@test.com",
  "full_name": "New Admin",
  "notes": "Administrateur pour la région MENA"
}
```

**Réponse Attendue** : `201 Created`
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newadmin@test.com",
    "role": "admin",
    "status": "invited"
  }
}
```

**Tests Postman** :
```javascript
pm.test("Status code is 201", function () {
    pm.response.to.have.status(201);
});

pm.test("Admin is created with invited status", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.success).to.be.true;
    pm.expect(jsonData.data.role).to.eql('admin');
    pm.expect(jsonData.data.status).to.eql('invited');
});
```

---

## 🎯 Scénarios de Test Complets

### Scénario A : Cycle de Vie Mentor Complet

```
1. POST /auth/register/mentor/           → Status: pending
   → Sauvegarder mentor_uuid

2. Essayer GET /auth/me/ avec token mentor
   → Devrait être bloqué (pending) ou retourner 401

3. POST /auth/admin/mentors/{uuid}/approve/ (admin)
   → Status: approved

4. GET /auth/me/ avec token mentor
   → Devrait fonctionner ✅

5. POST /auth/admin/mentors/{uuid}/ban/ (admin)
   → Status: banned

6. GET /auth/me/ avec token mentor
   → Devrait être bloqué (banned)

7. POST /auth/admin/mentors/{uuid}/unban/ (super_admin)
   → Status: approved

8. GET /auth/me/ avec token mentor
   → Devrait fonctionner ✅
```

---

### Scénario B : Cycle de Vie Mentee

```
1. POST /auth/register/mentee/           → Status: active
   → Sauvegarder mentee_uuid

2. GET /auth/me/ avec token mentee
   → Devrait fonctionner ✅

3. POST /auth/admin/mentees/{uuid}/ban/ (admin)
   → Status: banned

4. GET /auth/me/ avec token mentee
   → Devrait être bloqué (banned)

5. POST /auth/admin/mentees/{uuid}/unban/ (super_admin)
   → Status: active

6. GET /auth/me/ avec token mentee
   → Devrait fonctionner ✅
```

---

### Scénario C : Identity Linking (Email → Google)

```
1. POST /auth/register/mentee/ (email/password)
   → Email: user@test.com
   → Sauvegarder auth0_id

2. Login avec Google (même email: user@test.com)
   → Obtenir nouveau token (auth0_id différent: google-oauth2|...)

3. POST /auth/register/mentee/social/ avec token Google
   → Devrait utiliser le même AppUser (pas de duplication)
   → Vérifier dans la DB que auth0_id a été mis à jour
```

---

### Scénario D : Tests d'Erreurs

| Test | Endpoint | Attendu |
|------|----------|---------|
| Bannir mentor déjà banni | `POST /auth/admin/mentors/{uuid}/ban/` | `400 Bad Request` - "Mentor is already banned" |
| Bannir mentor pending | `POST /auth/admin/mentors/{uuid}/ban/` | `400 Bad Request` - "Only approved mentors can be banned" |
| Débannir sans être super_admin | `POST /auth/admin/mentors/{uuid}/unban/` | `403 Forbidden` |
| Débannir mentor non banni | `POST /auth/admin/mentors/{uuid}/unban/` | `400 Bad Request` - "Mentor is not banned" |
| Inviter admin avec email existant | `POST /auth/admin/admins/` | `400 Bad Request` - "Email already used" |
| Accès admin sans token | `GET /auth/admin/mentors/pending/` | `401 Unauthorized` |
| Accès admin avec token mentee | `GET /auth/admin/mentors/pending/` | `403 Forbidden` |

---

## 🔍 Vérifications dans la Base de Données

### Via Django Shell

```bash
python manage.py shell
```

```python
from accounts.models import AppUser, MentorProfile, MenteeProfile

# Voir tous les mentors bannis
MentorProfile.objects.filter(status="banned")

# Voir les détails de ban
m = MentorProfile.objects.get(email="mentor1@test.com")
print(f"Status: {m.status}")
print(f"Banned at: {m.banned_at}")
print(f"Banned by: {m.banned_by}")
print(f"Reason: {m.ban_reason}")

# Vérifier identity linking
user = AppUser.objects.get(email="user@test.com")
print(f"Auth0 ID: {user.auth0_id}")  # Devrait être le dernier utilisé

# Compter les utilisateurs par rôle
AppUser.objects.values('role').annotate(count=Count('id'))
```

---

## 📊 Checklist de Test Complète

### ✅ Inscription
- [ ] Inscription mentee email/password
- [ ] Inscription mentor email/password
- [ ] Inscription mentee sociale
- [ ] Inscription mentor sociale
- [ ] Validation mot de passe (complexité)
- [ ] Validation email unique
- [ ] Upload fichiers (profile_picture, cv)

### ✅ Authentification
- [ ] GET /auth/me/ avec token valide
- [ ] GET /auth/me/ sans token (401)
- [ ] GET /auth/me/ avec token expiré (401)

### ✅ Reset Mot de Passe
- [ ] Reset avec email existant
- [ ] Reset avec email inexistant (même réponse)
- [ ] Reset sans email (400)

### ✅ Gestion Mentors
- [ ] Lister mentors pending
- [ ] Lister mentors approved
- [ ] Lister mentors banned
- [ ] Détail mentor
- [ ] Approuver mentor
- [ ] Rejeter mentor
- [ ] Bannir mentor
- [ ] Débannir mentor (super_admin)

### ✅ Gestion Mentees
- [ ] Lister mentees actifs
- [ ] Lister mentees bannis
- [ ] Détail mentee
- [ ] Bannir mentee
- [ ] Débannir mentee (super_admin)

### ✅ Invitation Admin
- [ ] Inviter admin (super_admin)
- [ ] Inviter avec email existant (409)
- [ ] Inviter sans être super_admin (403)

### ✅ Identity Linking
- [ ] Email → Google (même email)
- [ ] Google → LinkedIn (même email)
- [ ] Vérifier pas de duplication AppUser

### ✅ Blocage Login
- [ ] Mentor pending ne peut pas se connecter
- [ ] Mentor rejected ne peut pas se connecter
- [ ] Mentor banned ne peut pas se connecter
- [ ] Mentee banned ne peut pas se connecter

---

## 🚨 Points d'Attention

1. **Tokens** : Les tokens Auth0 expirent après 24h. Rafraîchis-les régulièrement.

2. **Fichiers** : Pour les uploads, utilise des fichiers de test légers (< 5MB pour images, < 10MB pour PDF).

3. **UUIDs** : Sauvegarde les UUIDs retournés dans les variables Postman pour les réutiliser.

4. **Permissions** : Assure-toi d'avoir des tokens admin et super_admin pour tester tous les endpoints.

5. **Auth0 Metadata** : Après chaque action (approve, ban, etc.), vérifie dans Auth0 Dashboard que `app_metadata` est bien mis à jour.

---

## 📚 Ressources

- **Auth0 Dashboard** : https://manage.auth0.com/
- **Django Admin** : http://localhost:8000/admin/
- **API Base URL** : http://localhost:8000/auth/

---

**Bon test ! 🚀**

