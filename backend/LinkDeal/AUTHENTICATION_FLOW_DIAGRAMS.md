# Diagrammes de Flux d'Authentification

Ce document contient les diagrammes de flux complets pour tous les scénarios d'authentification du système LinkDeal.

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Inscription avec Email/Password (DB)](#inscription-avec-emailpassword-db)
3. [Inscription Sociale (Google/LinkedIn)](#inscription-sociale-googlelinkedin)
4. [Login avec Email/Password (DB)](#login-avec-emailpassword-db)
5. [Login Social (Google/LinkedIn)](#login-social-googlelinkedin)
6. [Account Linking Flow](#account-linking-flow)
7. [Logout Flow](#logout-flow)
8. [Sync AppUser lors de l'Authentification](#sync-appuser-lors-de-lauthentification)

---

## 🎯 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYSTÈME D'AUTHENTIFICATION                    │
│                         LinkDeal Backend                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   Frontend   │         │    Auth0     │         │   Backend    │
│              │         │              │         │   Django     │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │                        │                        │
       │  1. Registration       │                        │
       │     - DB (email/pwd)   │                        │
       │     - Social (OAuth)   │                        │
       │                        │                        │
       │  2. Login              │                        │
       │     - DB (email/pwd)   │                        │
       │     - Social (OAuth)   │                        │
       │                        │                        │
       │  3. Account Linking    │                        │
       │     (si email existe)  │                        │
       │                        │                        │
       │  4. Logout             │                        │
       │                        │                        │
```

---

## 📝 Inscription avec Email/Password (DB)

### Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant A as Auth0
    participant D as Database

    U->>F: 1. Fill registration form<br/>(email, password, profile data)
    F->>B: 2. POST /register/mentee/<br/>or /register/mentor/
    
    Note over B: Validate input data
    
    B->>A: 3. Create Auth0 user<br/>(email, password, role)
    A-->>B: 4. Auth0 user created<br/>(user_id, email)
    
    B->>A: 5. Send verification email
    A-->>B: 6. Email sent
    
    B->>A: 7. Assign RBAC role<br/>(mentee/mentor)
    A-->>B: 8. Role assigned
    
    B->>D: 9. Create AppUser<br/>(auth0_id, email, role)
    D-->>B: 10. AppUser created
    
    B->>D: 11. Create Profile<br/>(MenteeProfile/MentorProfile)
    D-->>B: 12. Profile created
    
    B-->>F: 13. 201 Created<br/>{success: true, data: {...}}
    F-->>U: 14. Show success message<br/>Redirect to email verification
    
    Note over U,A: User receives verification email
    U->>A: 15. Click verification link
    A-->>U: 16. Email verified
```

### Détails du Processus

```
┌─────────────────────────────────────────────────────────────┐
│           INSCRIPTION DB (Email/Password)                     │
└─────────────────────────────────────────────────────────────┘

1. USER REMPLIT LE FORMULAIRE
   ├─ Email
   ├─ Password + Confirm
   ├─ Full Name
   ├─ Field of Study (mentee) / Bio (mentor)
   ├─ Country
   └─ Profile Picture (optionnel)

2. FRONTEND ENVOIE À BACKEND
   POST /api/auth/register/mentee/
   ou
   POST /api/auth/register/mentor/
   
   Body: FormData
   {
     email: "user@example.com",
     password: "SecurePass123!",
     password_confirm: "SecurePass123!",
     full_name: "John Doe",
     field_of_study: "Computer Science",  // mentee
     country: "Morocco",
     profile_picture: File (optional)
   }

3. BACKEND VALIDE LES DONNÉES
   ├─ Email format
   ├─ Password strength
   ├─ Passwords match
   └─ Required fields

4. BACKEND CRÉE USER DANS AUTH0
   Auth0Client.create_user()
   ├─ Email: user@example.com
   ├─ Password: SecurePass123!
   ├─ Role: "mentee" ou "mentor"
   └─ Approval Status: "approved" (mentee) / "pending" (mentor)
   
   Response: {
     user_id: "auth0|abc123",
     email: "user@example.com"
   }

5. BACKEND ENVOIE EMAIL DE VÉRIFICATION
   Auth0Client.send_verification_email()
   └─ Auth0 envoie email automatiquement

6. BACKEND ASSIGNE ROLE RBAC (si configuré)
   Auth0Client.assign_role()
   └─ Role ID: AUTH0_MENTEE_ROLE_ID ou AUTH0_MENTOR_ROLE_ID

7. BACKEND CRÉE APPUSER DANS DB
   AppUser.objects.create()
   ├─ auth0_id: "auth0|abc123"
   ├─ email: "user@example.com"
   ├─ role: "mentee" ou "mentor"
   └─ status: "active"

8. BACKEND CRÉE PROFILE DANS DB
   MenteeProfile.objects.create() ou MentorProfile.objects.create()
   ├─ user: AppUser
   ├─ full_name: "John Doe"
   ├─ email: "user@example.com"
   ├─ field_of_study: "Computer Science" (mentee)
   └─ country: "Morocco"

9. BACKEND RETOURNE SUCCÈS
   Response 201:
   {
     "success": true,
     "data": {
       "id": "uuid",
       "email": "user@example.com",
       "role": "mentee"
     }
   }

10. USER REÇOIT EMAIL DE VÉRIFICATION
    └─ Click sur lien → Email vérifié dans Auth0
```

---

## 🌐 Inscription Sociale (Google/LinkedIn)

### Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth0
    participant B as Backend API
    participant D as Database

    U->>F: 1. Click "Login with Google"
    F->>A: 2. Redirect to Auth0<br/>OAuth flow
    A->>U: 3. Google login page
    U->>A: 4. Authenticate with Google
    A-->>F: 5. Redirect with code
    F->>A: 6. Exchange code for token
    A-->>F: 7. JWT Token received
    
    Note over F: Store token in localStorage
    
    F->>B: 8. GET /me/<br/>Authorization: Bearer <token>
    B->>D: 9. Check if AppUser exists<br/>(by auth0_id)
    D-->>B: 10. AppUser NOT FOUND
    B-->>F: 11. 401/404 Not Found
    
    Note over F: User needs registration
    
    F->>U: 12. Show registration form
    U->>F: 13. Fill profile data
    F->>B: 14. POST /register/mentee/social/<br/>Authorization: Bearer <token>
    
    Note over B: Check if email exists
    
    alt Email does NOT exist
        B->>D: 15. Create AppUser<br/>(auth0_id, email, role)
        D-->>B: 16. AppUser created
        B->>A: 17. Update Auth0 metadata<br/>(role, approval_status)
        A-->>B: 18. Metadata updated
        B->>D: 19. Create Profile
        D-->>B: 20. Profile created
        B-->>F: 21. 201 Created
        F-->>U: 22. Redirect to dashboard
    else Email EXISTS
        B-->>F: 23. 400 Bad Request<br/>{requires_linking: true}
        F->>U: 24. Show "Link accounts?" dialog
        U->>F: 25. Click "Yes, link accounts"
        F->>B: 26. POST /register/request-linking/
        B->>D: 27. Create AccountLinkingVerification
        D-->>B: 28. Verification record created
        B->>B: 29. Send verification email
        B-->>F: 30. 200 OK "Email sent"
        F-->>U: 31. Show "Check your email"
        Note over U: User clicks email link
        U->>B: 32. GET /register/verify-linking/<token>/
        B->>A: 33. Link identities in Auth0
        A-->>B: 34. Identities linked
        B->>D: 35. Update AppUser auth0_id
        D-->>B: 36. AppUser updated
        B-->>F: 37. 200 OK "Linked!"
        F-->>U: 38. Redirect to dashboard
    end
```

### Détails du Processus

```
┌─────────────────────────────────────────────────────────────┐
│           INSCRIPTION SOCIALE (Google/LinkedIn)              │
└─────────────────────────────────────────────────────────────┘

ÉTAPE 1: AUTHENTIFICATION AUTH0
────────────────────────────────
1. USER CLIQUE "LOGIN WITH GOOGLE"
   └─ Frontend appelle authService.login('google-oauth2')

2. REDIRECTION VERS AUTH0
   └─ window.location → https://tenant.auth0.com/authorize
      ├─ client_id: AUTH0_SPA_CLIENT_ID
      ├─ redirect_uri: http://localhost:3000/callback
      ├─ response_type: code
      ├─ scope: openid profile email
      └─ connection: google-oauth2

3. USER S'AUTHENTIFIE AVEC GOOGLE
   └─ Google OAuth flow

4. AUTH0 REDIRECTE VERS CALLBACK
   └─ http://localhost:3000/callback?code=xxx&state=yyy

5. FRONTEND ÉCHANGE CODE POUR TOKEN
   └─ POST https://tenant.auth0.com/oauth/token
      Response: {
        access_token: "eyJhbGc...",
        id_token: "eyJhbGc...",
        expires_in: 86400
      }

6. FRONTEND STOCKE LE TOKEN
   └─ localStorage.setItem('auth0_token', token)


ÉTAPE 2: VÉRIFICATION UTILISATEUR
──────────────────────────────────
7. FRONTEND APPELLE /me/
   GET /api/auth/me/
   Headers: Authorization: Bearer <token>

8. BACKEND VÉRIFIE LE TOKEN
   ├─ Auth0JWTAuthentication.authenticate()
   ├─ Verify JWT signature
   └─ Extract user info from token

9. BACKEND SYNC APPUSER
   ├─ IdentityMappingService.map_identity_to_app_user()
   └─ Check if AppUser exists by auth0_id

10. SI APPUSER N'EXISTE PAS
    └─ Response: 401 Unauthorized ou 404 Not Found
    └─ Frontend affiche formulaire d'inscription


ÉTAPE 3: INSCRIPTION
─────────────────────
11. USER REMPLIT FORMULAIRE
    ├─ Full Name
    ├─ Field of Study (mentee) / Bio (mentor)
    ├─ Country
    └─ Profile Picture (optional)

12. FRONTEND ENVOIE À BACKEND
    POST /api/auth/register/mentee/social/
    Headers: Authorization: Bearer <token>
    Body: FormData
    {
      full_name: "John Doe",
      field_of_study: "Computer Science",
      country: "Morocco",
      profile_picture: File (optional)
    }

13. BACKEND VÉRIFIE SI EMAIL EXISTE
    AppUser.objects.filter(email=email).first()

14. SI EMAIL N'EXISTE PAS
    ├─ Create AppUser
    ├─ Update Auth0 metadata
    ├─ Create Profile
    └─ Response: 201 Created

15. SI EMAIL EXISTE
    └─ Response: 400 Bad Request
       {
         "email": ["An account with this email already exists..."],
         "requires_linking": true
       }
    └─ Frontend affiche dialog "Link accounts?"
```

---

## 🔐 Login avec Email/Password (DB)

### Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth0
    participant B as Backend API
    participant D as Database

    U->>F: 1. Enter email & password
    F->>A: 2. POST /oauth/token<br/>(Resource Owner Password Grant)
    Note over A: Validate credentials
    alt Valid credentials
        A-->>F: 3. JWT Token
        F->>B: 4. GET /me/<br/>Authorization: Bearer <token>
        B->>A: 5. Verify JWT token
        A-->>B: 6. Token valid
        B->>D: 7. Find AppUser by auth0_id
        D-->>B: 8. AppUser found
        B->>D: 9. Check Profile exists
        D-->>B: 10. Profile found
        B->>B: 11. Validate role & status
        Note over B: Check if banned/rejected/pending
        B-->>F: 12. 200 OK<br/>{user data}
        F-->>U: 13. Redirect to dashboard
    else Invalid credentials
        A-->>F: 14. 401 Unauthorized
        F-->>U: 15. Show error message
    else Email not verified
        A-->>F: 16. Token with email_verified=false
        F->>B: 17. GET /me/
        B->>B: 18. Check email_verified
        B-->>F: 19. 401 "Email not verified"
        F-->>U: 20. Show "Verify email" message
    end
```

### Détails du Processus

```
┌─────────────────────────────────────────────────────────────┐
│              LOGIN DB (Email/Password)                       │
└─────────────────────────────────────────────────────────────┘

1. USER ENTRE EMAIL ET PASSWORD
   └─ Frontend form

2. FRONTEND OBTIENT TOKEN D'AUTH0
   POST https://tenant.auth0.com/oauth/token
   {
     grant_type: "password",
     client_id: AUTH0_SPA_CLIENT_ID,
     client_secret: AUTH0_SPA_CLIENT_SECRET,
     username: "user@example.com",
     password: "SecurePass123!",
     audience: AUTH0_AUDIENCE,
     scope: "openid profile email"
   }

3. AUTH0 VALIDE CREDENTIALS
   ├─ Check email exists
   ├─ Verify password
   └─ Check email_verified

4. SI CREDENTIALS VALIDES
   └─ Response: {
        access_token: "eyJhbGc...",
        id_token: "eyJhbGc...",
        expires_in: 86400
      }

5. FRONTEND STOCKE LE TOKEN
   └─ localStorage.setItem('auth0_token', token)

6. FRONTEND APPELLE /me/
   GET /api/auth/me/
   Headers: Authorization: Bearer <token>

7. BACKEND AUTHENTIFIE LE TOKEN
   ├─ Auth0JWTAuthentication.authenticate()
   ├─ Verify JWT signature with Auth0 public key
   └─ Extract user info

8. BACKEND SYNC APPUSER
   ├─ _sync_app_user()
   ├─ Find AppUser by auth0_id
   ├─ Check if AppUser exists
   └─ If not found → 401 "Account not found"

9. BACKEND VALIDE ROLE
   ├─ Check if user has role (token or DB)
   ├─ If no role → 401 "User account has no role"
   └─ Sync role from token to DB if needed

10. BACKEND VALIDE STATUS
    ├─ If mentor: Check status (banned/rejected/pending)
    ├─ If mentee: Check status (banned)
    └─ If invalid → 401 "Account is banned/pending"

11. BACKEND VALIDE PROFILE
    ├─ Check if MentorProfile/MenteeProfile exists
    └─ If not found → 401 "Profile not found"

12. BACKEND RETOURNE USER DATA
    Response 200:
    {
      "id": "uuid",
      "email": "user@example.com",
      "role": "mentee",
      "auth0_id": "auth0|abc123",
      "app_metadata": {...},
      "permissions": [...]
    }

13. FRONTEND REDIRECTE VERS DASHBOARD
    └─ User is logged in
```

---

## 🌐 Login Social (Google/LinkedIn)

### Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth0
    participant B as Backend API
    participant D as Database

    U->>F: 1. Click "Login with Google"
    F->>A: 2. Redirect to Auth0<br/>OAuth flow
    A->>U: 3. Google login page
    U->>A: 4. Authenticate with Google
    A-->>F: 5. Redirect with code
    F->>A: 6. Exchange code for token
    A-->>F: 7. JWT Token received
    
    Note over F: Store token
    
    F->>B: 8. GET /me/<br/>Authorization: Bearer <token>
    B->>A: 9. Verify JWT token
    A-->>B: 10. Token valid
    
    B->>D: 11. Find AppUser by auth0_id
    alt AppUser EXISTS
        D-->>B: 12. AppUser found
        B->>D: 13. Check Profile exists
        D-->>B: 14. Profile found
        B->>B: 15. Validate role & status
        B-->>F: 16. 200 OK<br/>{user data}
        F-->>U: 17. Redirect to dashboard
    else AppUser NOT FOUND
        D-->>B: 18. AppUser not found
        B-->>F: 19. 401 "Account not found.<br/>Please complete registration"
        F->>U: 20. Show registration form
        Note over U: User must register first
    end
```

### Détails du Processus

```
┌─────────────────────────────────────────────────────────────┐
│              LOGIN SOCIAL (Google/LinkedIn)                   │
└─────────────────────────────────────────────────────────────┘

1. USER CLIQUE "LOGIN WITH GOOGLE"
   └─ Frontend appelle authService.login('google-oauth2')

2. REDIRECTION VERS AUTH0
   └─ OAuth flow (même que registration sociale)

3. USER S'AUTHENTIFIE AVEC GOOGLE
   └─ Google OAuth

4. AUTH0 RETOURNE TOKEN
   └─ JWT token avec:
      ├─ sub: "google-oauth2|123456"
      ├─ email: "user@gmail.com"
      ├─ email_verified: true
      └─ role: (si assigné)

5. FRONTEND APPELLE /me/
   GET /api/auth/me/
   Headers: Authorization: Bearer <token>

6. BACKEND AUTHENTIFIE LE TOKEN
   ├─ Verify JWT signature
   └─ Extract user info

7. BACKEND SYNC APPUSER
   ├─ _sync_app_user()
   ├─ IdentityMappingService.map_identity_to_app_user()
   └─ Find AppUser by auth0_id

8. SI APPUSER EXISTE
   ├─ Check Profile exists
   ├─ Validate role & status
   └─ Response: 200 OK {user data}
   └─ Frontend redirecte vers dashboard

9. SI APPUSER N'EXISTE PAS
   └─ Response: 401 "Account not found. Please complete registration first."
   └─ Frontend affiche formulaire d'inscription
   └─ IMPORTANT: Pas d'auto-création!
```

---

## 🔗 Account Linking Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant A as Auth0
    participant D as Database
    participant E as Email

    Note over U,E: User tries to register with social login<br/>but email already exists

    U->>F: 1. Social login (Google)
    F->>B: 2. POST /register/mentee/social/
    B->>D: 3. Check if email exists
    D-->>B: 4. Email EXISTS
    B-->>F: 5. 400 Bad Request<br/>{requires_linking: true}
    
    F->>U: 6. Show "Link accounts?" dialog
    U->>F: 7. Click "Yes, link accounts"
    
    F->>B: 8. POST /register/request-linking/
    Note over B: Validate inputs
    B->>D: 9. Find existing AppUser by email
    D-->>B: 10. Existing user found
    
    B->>B: 11. Validate:
    Note over B: - Same role?<br/>- Not banned?<br/>- Email verified?
    
    alt Validation PASSED
        B->>D: 12. Create AccountLinkingVerification
        D-->>B: 13. Verification record created
        B->>E: 14. Send verification email<br/>(with token)
        E-->>U: 15. Email received
        B-->>F: 16. 200 OK "Email sent"
        F-->>U: 17. Show "Check your email"
        
        U->>E: 18. Click email link
        E->>B: 19. GET /register/verify-linking/<token>/
        B->>D: 20. Find verification record
        D-->>B: 21. Verification found
        
        B->>B: 22. Validate token:
        Note over B: - Not expired?<br/>- Not already used?
        
        B->>A: 23. Link identities<br/>(primary + secondary)
        A-->>B: 24. Identities linked
        
        B->>D: 25. Update AppUser auth0_id<br/>(to primary identity)
        D-->>B: 26. AppUser updated
        
        B->>D: 27. Mark verification as verified
        D-->>B: 28. Verification updated
        
        B-->>F: 29. 200 OK "Linked!"
        F-->>U: 30. Redirect to dashboard
    else Validation FAILED
        B-->>F: 31. 400 Bad Request<br/>(role mismatch, banned, etc.)
        F-->>U: 32. Show error message
    end
```

### Détails du Processus

```
┌─────────────────────────────────────────────────────────────┐
│                    ACCOUNT LINKING FLOW                      │
└─────────────────────────────────────────────────────────────┘

SCÉNARIO: User a un compte DB (email/password) et veut lier
          son compte Google/LinkedIn

ÉTAPE 1: DÉTECTION DU CONFLIT
─────────────────────────────
1. USER S'INSCRIT AVEC GOOGLE
   └─ Email: user@example.com

2. BACKEND DÉTECTE EMAIL EXISTANT
   POST /api/auth/register/mentee/social/
   └─ AppUser.objects.filter(email=email).first()
   └─ Email trouvé!

3. BACKEND RETOURNE ERREUR
   Response 400:
   {
     "email": ["An account with this email already exists..."],
     "requires_linking": true
   }

4. FRONTEND AFFICHE DIALOG
   └─ "An account with this email already exists.
       Would you like to link your social account?"


ÉTAPE 2: DEMANDE DE LINKING
────────────────────────────
5. USER CLIQUE "YES, LINK ACCOUNTS"
   └─ Frontend appelle /register/request-linking/

6. BACKEND VALIDE LA DEMANDE
   POST /api/auth/register/request-linking/
   Body: {
     email: "user@example.com",
     link_consent: true,
     registration_data: {...},
     role: "mentee"
   }

7. BACKEND VÉRIFIE LES CONDITIONS
   ├─ Find existing AppUser by email
   ├─ Check if same role
   ├─ Check if not banned
   ├─ Check if email verified (for DB accounts)
   └─ Check if not already linked

8. SI VALIDATION PASSÉE
   ├─ Create AccountLinkingVerification record
   ├─ Generate secure token
   ├─ Set expires_at (15 minutes)
   └─ Send verification email

9. EMAIL DE VÉRIFICATION ENVOYÉ
   └─ Link: http://frontend.com/verify-linking/<token>/


ÉTAPE 3: VÉRIFICATION ET LINKING
─────────────────────────────────
10. USER CLIQUE LE LIEN DANS L'EMAIL
    └─ GET /api/auth/register/verify-linking/<token>/

11. BACKEND VALIDE LE TOKEN
    ├─ Find AccountLinkingVerification by token
    ├─ Check if not expired
    ├─ Check if not already verified
    └─ Check if not expired

12. BACKEND LIE LES IDENTITÉS DANS AUTH0
    Auth0Client.link_identities()
    ├─ Primary identity: existing auth0_id (DB)
    └─ Secondary identity: new auth0_id (Google)
    
    Result: Both identities linked to primary

13. BACKEND MET À JOUR APPUSER
    ├─ Update auth0_id to primary identity
    └─ Update email if changed

14. BACKEND MARQUE LA VÉRIFICATION
    └─ verification.verified = True

15. BACKEND RETOURNE SUCCÈS
    Response 200:
    {
      "success": true,
      "message": "Accounts linked successfully!",
      "user": {...}
    }

16. USER PEUT MAINTENANT SE CONNECTER
    └─ Avec email/password OU Google/LinkedIn
    └─ Même compte, même profil
```

---

## 🚪 Logout Flow

### Flow Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend API
    participant A as Auth0
    participant S as Storage

    U->>F: 1. Click "Logout" button
    F->>B: 2. POST /logout/<br/>Authorization: Bearer <token>
    B->>B: 3. Validate token
    B-->>F: 4. 200 OK "Logged out"
    F->>S: 5. Clear localStorage<br/>(remove token)
    F->>A: 6. Auth0 logout<br/>(optional, clears Auth0 session)
    A-->>F: 7. Redirect to home
    F-->>U: 8. User logged out
```

### Détails du Processus

```
┌─────────────────────────────────────────────────────────────┐
│                       LOGOUT FLOW                           │
└─────────────────────────────────────────────────────────────┘

1. USER CLIQUE "LOGOUT"
   └─ Frontend button

2. FRONTEND APPELLE BACKEND (optionnel)
   POST /api/auth/logout/
   Headers: Authorization: Bearer <token>
   
   Response 200:
   {
     "success": true,
     "message": "Logged out successfully"
   }

3. FRONTEND NETTOIE LE STORAGE
   ├─ localStorage.removeItem('auth0_token')
   ├─ Clear any user state
   └─ Clear any cached data

4. FRONTEND LOGOUT AUTH0 (optionnel)
   authService.logout()
   └─ Clears Auth0 session
   └─ Redirects to home page

5. USER EST DÉCONNECTÉ
   └─ Redirect to login page or home
```

---

## 🔄 Sync AppUser lors de l'Authentification

### Flow Diagram

```mermaid
flowchart TD
    A[Request with JWT Token] --> B[Auth0JWTAuthentication.authenticate]
    B --> C[Verify JWT Signature]
    C --> D{Token Valid?}
    D -->|No| E[401 AuthenticationFailed]
    D -->|Yes| F[Extract Auth0User from token]
    F --> G[_sync_app_user]
    
    G --> H{Has auth0_id & email?}
    H -->|No| I[Skip sync, return None]
    H -->|Yes| J{Is DB identity?}
    
    J -->|Yes auth0| K{Email verified?}
    K -->|No| L[401 Email not verified]
    K -->|Yes| M[Find AppUser by auth0_id]
    
    J -->|No social| M
    
    M --> N{AppUser found?}
    N -->|No| O[401 Account not found.<br/>Registration required]
    N -->|Yes| P[Update email if changed]
    
    P --> Q{Has role?}
    Q -->|No role in token or DB| R[401 User has no role]
    Q -->|Has role| S{Role in token but not DB?}
    
    S -->|Yes| T[Sync role from token to DB]
    S -->|No| U[Role already synced]
    
    T --> V{Valid role?}
    V -->|Invalid| W[401 Invalid role]
    V -->|Valid| X[Save role to DB]
    
    U --> Y{Is mentor?}
    X --> Y
    
    Y -->|Yes| Z{Status check}
    Z -->|Banned| AA[401 Account banned]
    Z -->|Rejected| BB[401 Account rejected]
    Z -->|Pending| CC[401 Account pending]
    Z -->|Approved| DD[Continue]
    
    Y -->|No mentee| EE{Profile exists?}
    DD --> EE
    
    EE -->|No| FF[401 Profile not found]
    EE -->|Yes| GG{Is banned?}
    
    GG -->|Yes| HH[401 Account banned]
    GG -->|No| II[Authentication Success]
    
    II --> JJ[Return Auth0User]
    
    style E fill:#ffcccc
    style L fill:#ffcccc
    style O fill:#ffcccc
    style R fill:#ffcccc
    style W fill:#ffcccc
    style AA fill:#ffcccc
    style BB fill:#ffcccc
    style CC fill:#ffcccc
    style FF fill:#ffcccc
    style HH fill:#ffcccc
    style II fill:#90ee90
    style JJ fill:#90ee90
```

### Détails du Processus de Sync

```
┌─────────────────────────────────────────────────────────────┐
│         SYNC APPUSER LORS DE L'AUTHENTIFICATION              │
└─────────────────────────────────────────────────────────────┘

1. TOKEN REÇU
   └─ Authorization: Bearer <JWT_TOKEN>

2. VÉRIFICATION DU TOKEN
   ├─ Verify JWT signature with Auth0 public key
   ├─ Check expiration
   └─ Extract payload

3. CRÉATION AUTH0USER
   └─ Auth0User(payload)
      ├─ auth0_id: "google-oauth2|123456"
      ├─ email: "user@gmail.com"
      ├─ email_verified: true
      ├─ role: "mentee" (if in token)
      └─ roles: ["mentee"] (if in token)

4. SYNC APPUSER
   └─ _sync_app_user(auth0_user)

5. VALIDATIONS INITIALES
   ├─ Check auth0_id exists → Skip if missing
   ├─ Check email exists → Skip if missing
   └─ Check if DB identity → Require email_verified

6. RECHERCHE APPUSER
   └─ IdentityMappingService.map_identity_to_app_user()
      ├─ Find AppUser by auth0_id (exact match)
      └─ If not found → ValueError → 401 "Account not found"

7. MISE À JOUR EMAIL (si changé)
   └─ If app_user.email != auth0_user.email
      └─ Update app_user.email

8. VALIDATION ROLE
   ├─ Check if user has role (token or DB)
   ├─ If no role → 401 "User has no role"
   └─ If token has role but DB doesn't → Sync from token

9. SYNC ROLE (si nécessaire)
   ├─ Extract role from token (priority: super_admin > admin > mentor > mentee)
   ├─ Validate role is in allowed choices
   └─ Save to DB

10. VALIDATION STATUS (Mentor)
    ├─ Check MentorProfile exists
    ├─ Check status: banned → 401 "Account banned"
    ├─ Check status: rejected → 401 "Account rejected"
    └─ Check status: pending → 401 "Account pending"

11. VALIDATION STATUS (Mentee)
    ├─ Check MenteeProfile exists
    └─ Check status: banned → 401 "Account banned"

12. SUCCÈS
    └─ Return Auth0User instance
    └─ request.user = Auth0User
    └─ View can access user data
```

---

## 📊 Vue d'Ensemble Complète

```mermaid
graph TB
    Start([User Action]) --> Choice{Action Type}
    
    Choice -->|Register| RegChoice{Registration Type}
    Choice -->|Login| LoginChoice{Login Type}
    Choice -->|Logout| Logout[Logout Flow]
    
    RegChoice -->|DB Email/Password| RegDB[DB Registration]
    RegChoice -->|Social Google/LinkedIn| RegSocial[Social Registration]
    
    LoginChoice -->|DB Email/Password| LoginDB[DB Login]
    LoginChoice -->|Social Google/LinkedIn| LoginSocial[Social Login]
    
    RegDB --> RegDBResult{Success?}
    RegDBResult -->|Yes| EmailVerify[Email Verification Required]
    RegDBResult -->|No| RegDBError[Show Error]
    
    RegSocial --> Auth0OAuth[Auth0 OAuth Flow]
    Auth0OAuth --> CheckUser{User Exists?}
    CheckUser -->|No| RegForm[Show Registration Form]
    CheckUser -->|Yes| LoginSuccess[Login Success]
    
    RegForm --> EmailCheck{Email Exists?}
    EmailCheck -->|No| CreateUser[Create AppUser + Profile]
    EmailCheck -->|Yes| LinkingFlow[Account Linking Flow]
    
    CreateUser --> RegSuccess[Registration Success]
    
    LinkingFlow --> SendEmail[Send Verification Email]
    SendEmail --> UserClicks[User Clicks Email Link]
    UserClicks --> LinkIdentities[Link Identities in Auth0]
    LinkIdentities --> LinkSuccess[Linking Success]
    
    LoginDB --> Auth0Password[Auth0 Password Grant]
    Auth0Password --> GetToken{Token Received?}
    GetToken -->|Yes| VerifyToken[Verify Token + Sync AppUser]
    GetToken -->|No| LoginError[Show Error]
    
    VerifyToken --> ValidateUser{User Valid?}
    ValidateUser -->|Yes| LoginSuccess
    ValidateUser -->|No| LoginError
    
    LoginSocial --> Auth0OAuth2[Auth0 OAuth Flow]
    Auth0OAuth2 --> GetToken2{Token Received?}
    GetToken2 -->|Yes| VerifyToken2[Verify Token + Sync AppUser]
    GetToken2 -->|No| LoginError2[Show Error]
    
    VerifyToken2 --> ValidateUser2{User Exists?}
    ValidateUser2 -->|Yes| LoginSuccess
    ValidateUser2 -->|No| RegForm
    
    LoginSuccess --> Dashboard[Redirect to Dashboard]
    RegSuccess --> Dashboard
    LinkSuccess --> Dashboard
    
    Logout --> ClearToken[Clear Token from Storage]
    ClearToken --> Home[Redirect to Home/Login]
    
    style RegDB fill:#e1f5ff
    style RegSocial fill:#e1f5ff
    style LoginDB fill:#fff4e1
    style LoginSocial fill:#fff4e1
    style LinkingFlow fill:#ffe1f5
    style LoginSuccess fill:#d4edda
    style RegSuccess fill:#d4edda
    style LinkSuccess fill:#d4edda
    style LoginError fill:#f8d7da
    style RegDBError fill:#f8d7da
```

---

## 🔑 Points Clés

### Règles Importantes

1. **Pas d'auto-création** : L'inscription est obligatoire avant le login
2. **Email verification** : Requis pour les comptes DB (email/password)
3. **Role validation** : L'utilisateur doit avoir un rôle valide pour se connecter
4. **Status validation** : Les mentors doivent être approuvés, les comptes bannis sont bloqués
5. **Profile requirement** : Le profil (MenteeProfile/MentorProfile) doit exister
6. **Account linking** : Si l'email existe, proposer le linking au lieu de créer un nouveau compte

### Endpoints Principaux

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/register/mentee/` | POST | No | Inscription mentee DB |
| `/register/mentor/` | POST | No | Inscription mentor DB |
| `/register/mentee/social/` | POST | Yes (JWT) | Inscription mentee social |
| `/register/mentor/social/` | POST | Yes (JWT) | Inscription mentor social |
| `/register/check-email/` | POST | Yes (JWT) | Vérifier si email existe |
| `/register/request-linking/` | POST | Yes (JWT) | Demander account linking |
| `/register/verify-linking/<token>/` | GET | No | Vérifier et lier les comptes |
| `/me/` | GET | Yes (JWT) | Obtenir info utilisateur actuel |
| `/logout/` | POST | Yes (JWT) | Déconnexion |

---

**Note** : Ces diagrammes représentent le flux complet d'authentification. Adaptez-les selon vos besoins spécifiques.

