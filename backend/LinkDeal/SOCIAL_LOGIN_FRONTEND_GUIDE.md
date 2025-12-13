# Guide d'Intégration Frontend - Social Login (Google/LinkedIn)

## 📋 Table des Matières
1. [Vue d'ensemble](#vue-densemble)
2. [Configuration Auth0](#configuration-auth0)
3. [Workflow Complet](#workflow-complet)
4. [Intégration Frontend](#intégration-frontend)
5. [Endpoints Backend](#endpoints-backend)
6. [Gestion des Erreurs](#gestion-des-erreurs)
7. [Exemples de Code](#exemples-de-code)

---

## 🎯 Vue d'ensemble

Le système utilise **Auth0** pour l'authentification sociale (Google/LinkedIn). Le workflow est en **2 étapes** :

1. **Étape 1** : Authentification Auth0 (OAuth) → Obtention du JWT token
2. **Étape 2** : Vérification/Inscription dans votre backend → Création du profil utilisateur

**Important** : L'inscription est **obligatoire** avant de pouvoir utiliser l'application. Il n'y a **pas d'auto-création** lors du premier login.

---

## ⚙️ Configuration Auth0

### Variables d'environnement nécessaires dans votre frontend :

```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-spa-client-id
AUTH0_AUDIENCE=your-api-audience
BACKEND_API_URL=http://localhost:8000/api/auth
FRONTEND_URL=http://localhost:3000
```

### Configuration Auth0 Dashboard :

1. **Application Type** : Single Page Application (SPA)
2. **Allowed Callback URLs** : `http://localhost:3000/callback, https://yourdomain.com/callback`
3. **Allowed Logout URLs** : `http://localhost:3000, https://yourdomain.com`
4. **Allowed Web Origins** : `http://localhost:3000, https://yourdomain.com`
5. **Connections activées** : Google OAuth, LinkedIn (selon vos besoins)

---

## 🔄 Workflow Complet

### Scénario 1 : Nouvel Utilisateur (Première Inscription)

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Frontend│      │  Auth0  │      │ Backend │      │   DB    │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │
     │ 1. Click       │                │                │
     │ "Login Google" │                │                │
     ├───────────────>│                │                │
     │                │                │                │
     │ 2. Redirect    │                │                │
     │ to Auth0       │                │                │
     │<───────────────┤                │                │
     │                │                │                │
     │ 3. User auth   │                │                │
     │ with Google    │                │                │
     │                │                │                │
     │ 4. Auth0       │                │                │
     │ returns JWT    │                │                │
     │<───────────────┤                │                │
     │                │                │                │
     │ 5. Store token │                │                │
     │                │                │                │
     │ 6. GET /me/    │                │                │
     │ (with JWT)     │                │                │
     ├────────────────────────────────>│                │
     │                │                │                │
     │                │                │ 7. Check if    │
     │                │                │ AppUser exists│
     │                │                ├───────────────>│
     │                │                │                │
     │                │                │ 8. Not found  │
     │                │                │<───────────────┤
     │                │                │                │
     │ 9. 401/404     │                │                │
     │ "Not registered"│                │                │
     │<────────────────────────────────┤                │
     │                │                │                │
     │ 10. Show       │                │                │
     │ registration   │                │                │
     │ form           │                │                │
     │                │                │                │
     │ 11. POST       │                │                │
     │ /register/     │                │                │
     │ mentee/social/ │                │                │
     ├────────────────────────────────>│                │
     │                │                │                │
     │                │                │ 12. Create     │
     │                │                │ AppUser +      │
     │                │                │ Profile        │
     │                │                ├───────────────>│
     │                │                │                │
     │                │                │ 13. Success    │
     │                │                │<───────────────┤
     │                │                │                │
     │ 14. 201        │                │                │
     │ Success        │                │                │
     │<────────────────────────────────┤                │
     │                │                │                │
     │ 15. Redirect   │                │                │
     │ to dashboard   │                │                │
```

### Scénario 2 : Utilisateur Existant (Login)

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Frontend│      │  Auth0  │      │ Backend │      │   DB    │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │
     │ 1-4. Same as   │                │                │
     │ Scenario 1     │                │                │
     │                │                │                │
     │ 5. GET /me/    │                │                │
     │ (with JWT)     │                │                │
     ├────────────────────────────────>│                │
     │                │                │                │
     │                │                │ 6. Find        │
     │                │                │ AppUser        │
     │                │                ├───────────────>│
     │                │                │                │
     │                │                │ 7. Found +     │
     │                │                │ Profile exists │
     │                │                │<───────────────┤
     │                │                │                │
     │ 8. 200 OK      │                │                │
     │ User data      │                │                │
     │<────────────────────────────────┤                │
     │                │                │                │
     │ 9. Redirect    │                │                │
     │ to dashboard   │                │                │
```

### Scénario 3 : Email Existe Déjà (Account Linking)

```
┌─────────┐      ┌─────────┐      ┌─────────┐      ┌─────────┐
│ Frontend│      │  Auth0  │      │ Backend │      │   DB    │
└────┬────┘      └────┬────┘      └────┬────┘      └────┬────┘
     │                │                │                │
     │ 1-4. Auth0     │                │                │
     │ OAuth flow     │                │                │
     │                │                │                │
     │ 5. POST        │                │                │
     │ /register/     │                │                │
     │ mentee/social/ │                │                │
     ├────────────────────────────────>│                │
     │                │                │                │
     │                │                │ 6. Check email │
     │                │                │ exists         │
     │                │                ├───────────────>│
     │                │                │                │
     │                │                │ 7. Email found │
     │                │                │<───────────────┤
     │                │                │                │
     │ 8. 400 Error   │                │                │
     │ requires_linking│                │                │
     │<────────────────────────────────┤                │
     │                │                │                │
     │ 9. Show        │                │                │
     │ "Link accounts?"│                │                │
     │ dialog         │                │                │
     │                │                │                │
     │ 10. User       │                │                │
     │ clicks "Yes"   │                │                │
     │                │                │                │
     │ 11. POST       │                │                │
     │ /register/     │                │                │
     │ request-linking│                │                │
     ├────────────────────────────────>│                │
     │                │                │                │
     │                │                │ 12. Send       │
     │                │                │ verification   │
     │                │                │ email         │
     │                │                │                │
     │ 13. 200 OK     │                │                │
     │ "Email sent"   │                │                │
     │<────────────────────────────────┤                │
     │                │                │                │
     │ 14. User       │                │                │
     │ clicks email   │                │                │
     │ link           │                │                │
     │                │                │                │
     │ 15. GET        │                │                │
     │ /register/     │                │                │
     │ verify-linking │                │                │
     │ /<token>/      │                │                │
     ├────────────────────────────────>│                │
     │                │                │                │
     │                │                │ 16. Verify    │
     │                │                │ token + link   │
     │                │                │ identities     │
     │                │                │                │
     │ 17. 200 OK     │                │                │
     │ "Linked!"      │                │                │
     │<────────────────────────────────┤                │
     │                │                │                │
     │ 18. Redirect   │                │                │
     │ to dashboard   │                │                │
```

---

## 💻 Intégration Frontend

### 1. Installation des dépendances

```bash
npm install @auth0/auth0-spa-js
# ou
yarn add @auth0/auth0-spa-js
```

### 2. Configuration Auth0 Client

```typescript
// src/auth/auth0-config.ts
import { Auth0ClientOptions } from '@auth0/auth0-spa-js';

export const auth0Config: Auth0ClientOptions = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN!,
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID!,
  authorizationParams: {
    redirect_uri: window.location.origin + '/callback',
    audience: process.env.REACT_APP_AUTH0_AUDIENCE!,
    scope: 'openid profile email',
  },
  cacheLocation: 'localstorage',
};
```

### 3. Service d'Authentification

```typescript
// src/services/authService.ts
import { createAuth0Client, Auth0Client, User } from '@auth0/auth0-spa-js';
import { auth0Config } from '../auth/auth0-config';

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8000/api/auth';

class AuthService {
  private auth0Client: Auth0Client | null = null;
  private user: User | null = null;
  private accessToken: string | null = null;

  async initialize(): Promise<void> {
    this.auth0Client = await createAuth0Client(auth0Config);
    
    // Check if we're returning from Auth0 redirect
    if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
      await this.handleRedirectCallback();
    }

    // Get current user
    this.user = await this.auth0Client.getUser();
    if (this.user) {
      this.accessToken = await this.auth0Client.getTokenSilently();
    }
  }

  async login(connection?: 'google-oauth2' | 'linkedin'): Promise<void> {
    if (!this.auth0Client) {
      await this.initialize();
    }

    const options: any = {
      authorizationParams: {
        ...auth0Config.authorizationParams,
      },
    };

    // Specify connection if provided
    if (connection) {
      options.authorizationParams.connection = connection;
    }

    await this.auth0Client!.loginWithRedirect(options);
  }

  async handleRedirectCallback(): Promise<void> {
    if (!this.auth0Client) {
      await this.initialize();
    }

    await this.auth0Client!.handleRedirectCallback();
    
    // Update user and token
    this.user = await this.auth0Client!.getUser();
    this.accessToken = await this.auth0Client!.getTokenSilently();
  }

  async logout(): Promise<void> {
    if (!this.auth0Client) {
      await this.initialize();
    }

    await this.auth0Client!.logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }

  async getAccessToken(): Promise<string | null> {
    if (!this.auth0Client) {
      await this.initialize();
    }

    try {
      this.accessToken = await this.auth0Client!.getTokenSilently();
      return this.accessToken;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  }

  getUser(): User | null {
    return this.user;
  }

  isAuthenticated(): boolean {
    return this.user !== null;
  }
}

export const authService = new AuthService();
```

### 4. Service API Backend

```typescript
// src/services/apiService.ts
import { authService } from './authService';

const BACKEND_API_URL = process.env.REACT_APP_BACKEND_API_URL || 'http://localhost:8000/api/auth';

class ApiService {
  private async getHeaders(): Promise<HeadersInit> {
    const token = await authService.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async checkUserExists(): Promise<{ exists: boolean; user?: any }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BACKEND_API_URL}/me/`, {
      method: 'GET',
      headers,
    });

    if (response.status === 401 || response.status === 404) {
      return { exists: false };
    }

    if (!response.ok) {
      throw new Error('Failed to check user status');
    }

    const data = await response.json();
    return { exists: true, user: data };
  }

  async registerMenteeSocial(registrationData: {
    full_name: string;
    field_of_study: string;
    country: string;
    profile_picture?: File;
    interests?: string[];
    user_type?: string;
    session_frequency?: string;
  }): Promise<any> {
    const headers = await this.getHeaders();
    
    // Handle file upload
    const formData = new FormData();
    formData.append('full_name', registrationData.full_name);
    formData.append('field_of_study', registrationData.field_of_study);
    formData.append('country', registrationData.country);
    
    if (registrationData.profile_picture) {
      formData.append('profile_picture', registrationData.profile_picture);
    }
    
    if (registrationData.interests) {
      registrationData.interests.forEach(interest => {
        formData.append('interests', interest);
      });
    }
    
    if (registrationData.user_type) {
      formData.append('user_type', registrationData.user_type);
    }
    
    if (registrationData.session_frequency) {
      formData.append('session_frequency', registrationData.session_frequency);
    }

    // Remove Content-Type header for FormData (browser will set it with boundary)
    const headersWithoutContentType = { ...headers };
    delete (headersWithoutContentType as any)['Content-Type'];

    const response = await fetch(`${BACKEND_API_URL}/register/mentee/social/`, {
      method: 'POST',
      headers: headersWithoutContentType,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return await response.json();
  }

  async registerMentorSocial(registrationData: {
    full_name: string;
    bio: string;
    expertise: string[];
    country: string;
    profile_picture?: File;
    linkedin_url?: string;
    website_url?: string;
  }): Promise<any> {
    const headers = await this.getHeaders();
    
    const formData = new FormData();
    formData.append('full_name', registrationData.full_name);
    formData.append('bio', registrationData.bio);
    formData.append('country', registrationData.country);
    
    registrationData.expertise.forEach(exp => {
      formData.append('expertise', exp);
    });
    
    if (registrationData.profile_picture) {
      formData.append('profile_picture', registrationData.profile_picture);
    }
    
    if (registrationData.linkedin_url) {
      formData.append('linkedin_url', registrationData.linkedin_url);
    }
    
    if (registrationData.website_url) {
      formData.append('website_url', registrationData.website_url);
    }

    const headersWithoutContentType = { ...headers };
    delete (headersWithoutContentType as any)['Content-Type'];

    const response = await fetch(`${BACKEND_API_URL}/register/mentor/social/`, {
      method: 'POST',
      headers: headersWithoutContentType,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return await response.json();
  }

  async checkEmail(email: string): Promise<{ exists: boolean; requires_linking: boolean }> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BACKEND_API_URL}/register/check-email/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error('Failed to check email');
    }

    return await response.json();
  }

  async requestLinking(data: {
    email: string;
    link_consent: boolean;
    registration_data: any;
    role: 'mentee' | 'mentor';
  }): Promise<any> {
    const headers = await this.getHeaders();
    const response = await fetch(`${BACKEND_API_URL}/register/request-linking/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return await response.json();
  }

  async verifyLinking(token: string): Promise<any> {
    const response = await fetch(`${BACKEND_API_URL}/register/verify-linking/${token}/`, {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw error;
    }

    return await response.json();
  }
}

export const apiService = new ApiService();
```

### 5. Composant de Login Social

```typescript
// src/components/SocialLogin.tsx
import React, { useState } from 'react';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';
import { useNavigate } from 'react-router-dom';

export const SocialLogin: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSocialLogin = async (connection: 'google-oauth2' | 'linkedin') => {
    setLoading(true);
    try {
      await authService.login(connection);
      // User will be redirected to Auth0, then back to /callback
    } catch (error) {
      console.error('Login error:', error);
      alert('Failed to initiate login. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => handleSocialLogin('google-oauth2')}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Login with Google'}
      </button>
      
      <button
        onClick={() => handleSocialLogin('linkedin')}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Login with LinkedIn'}
      </button>
    </div>
  );
};
```

### 6. Callback Handler

```typescript
// src/pages/Callback.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';

export const Callback: React.FC = () => {
  const [status, setStatus] = useState<'processing' | 'checking' | 'needs-registration' | 'error'>('processing');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle Auth0 redirect
        await authService.handleRedirectCallback();
        setStatus('checking');

        // Check if user exists in backend
        const { exists, user } = await apiService.checkUserExists();

        if (exists && user) {
          // User is registered, redirect to dashboard
          navigate('/dashboard');
        } else {
          // User needs to register
          setStatus('needs-registration');
          navigate('/register', { state: { fromSocial: true } });
        }
      } catch (error: any) {
        console.error('Callback error:', error);
        setStatus('error');
        // Redirect to login with error message
        navigate('/login', { state: { error: 'Authentication failed. Please try again.' } });
      }
    };

    handleCallback();
  }, [navigate]);

  if (status === 'processing' || status === 'checking') {
    return <div>Processing authentication...</div>;
  }

  if (status === 'error') {
    return <div>Authentication failed. Please try again.</div>;
  }

  return null;
};
```

### 7. Composant d'Inscription Sociale

```typescript
// src/pages/SocialRegister.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';

export const SocialRegister: React.FC<{ role: 'mentee' | 'mentor' }> = ({ role }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    field_of_study: '', // for mentee
    bio: '', // for mentor
    expertise: [] as string[], // for mentor
    country: '',
    profile_picture: null as File | null,
    interests: [] as string[], // for mentee
    user_type: '', // for mentee
    session_frequency: '', // for mentee
    linkedin_url: '', // for mentor
    website_url: '', // for mentor
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showLinkingDialog, setShowLinkingDialog] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (role === 'mentee') {
        const response = await apiService.registerMenteeSocial({
          full_name: formData.full_name,
          field_of_study: formData.field_of_study,
          country: formData.country,
          profile_picture: formData.profile_picture || undefined,
          interests: formData.interests,
          user_type: formData.user_type || undefined,
          session_frequency: formData.session_frequency || undefined,
        });

        // Success - redirect to dashboard
        navigate('/dashboard');
      } else {
        const response = await apiService.registerMentorSocial({
          full_name: formData.full_name,
          bio: formData.bio,
          expertise: formData.expertise,
          country: formData.country,
          profile_picture: formData.profile_picture || undefined,
          linkedin_url: formData.linkedin_url || undefined,
          website_url: formData.website_url || undefined,
        });

        // Success - redirect to pending page (mentors need approval)
        navigate('/pending-approval');
      }
    } catch (err: any) {
      // Check if account linking is required
      if (err.requires_linking) {
        setShowLinkingDialog(true);
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLinkingConsent = async () => {
    setLoading(true);
    try {
      const user = authService.getUser();
      if (!user?.email) {
        throw new Error('Email not found');
      }

      await apiService.requestLinking({
        email: user.email,
        link_consent: true,
        registration_data: formData,
        role,
      });

      // Show success message
      alert('A verification email has been sent. Please check your inbox to complete account linking.');
      setShowLinkingDialog(false);
      // Optionally redirect to a "check your email" page
      navigate('/check-email');
    } catch (err: any) {
      setError(err.message || 'Failed to request account linking.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Complete Your {role === 'mentee' ? 'Mentee' : 'Mentor'} Registration</h2>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Form fields based on role */}
        {role === 'mentee' ? (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Field of Study"
              value={formData.field_of_study}
              onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              required
            />
            {/* Add other mentee fields */}
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
            />
            <textarea
              placeholder="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              required
            />
            {/* Add other mentor fields */}
          </>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Complete Registration'}
        </button>
      </form>

      {/* Account Linking Dialog */}
      {showLinkingDialog && (
        <div className="dialog">
          <h3>Account Already Exists</h3>
          <p>
            An account with this email already exists. Would you like to link your social account?
          </p>
          <button onClick={handleLinkingConsent}>Yes, Link Accounts</button>
          <button onClick={() => setShowLinkingDialog(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};
```

### 8. Page de Vérification de Linking

```typescript
// src/pages/VerifyLinking.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';

export const VerifyLinking: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification token');
        return;
      }

      try {
        const response = await apiService.verifyLinking(token);
        setStatus('success');
        setMessage(response.message || 'Accounts linked successfully!');
        
        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to verify account linking');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div>
      {status === 'verifying' && <div>Verifying account linking...</div>}
      {status === 'success' && (
        <div>
          <h2>Success!</h2>
          <p>{message}</p>
          <p>Redirecting to dashboard...</p>
        </div>
      )}
      {status === 'error' && (
        <div>
          <h2>Error</h2>
          <p>{message}</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      )}
    </div>
  );
};
```

---

## 📡 Endpoints Backend

### Base URL
```
http://localhost:8000/api/auth
```

### Endpoints Disponibles

#### 1. Vérifier l'utilisateur actuel
```
GET /me/
Headers: Authorization: Bearer <JWT_TOKEN>
```

**Réponse si utilisateur existe :**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "mentee",
  "auth0_id": "google-oauth2|123456",
  "app_metadata": { ... },
  "permissions": [ ... ]
}
```

**Réponse si utilisateur n'existe pas :**
- Status: `401 Unauthorized` ou `404 Not Found`

---

#### 2. Inscription Mentee Social
```
POST /register/mentee/social/
Headers: 
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: multipart/form-data
```

**Body (FormData) :**
```javascript
{
  full_name: "John Doe",
  field_of_study: "Computer Science",
  country: "USA",
  profile_picture: File (optional),
  interests: ["tech", "business"] (optional),
  user_type: "student" (optional),
  session_frequency: "once_week" (optional)
}
```

**Réponse succès (201) :**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "mentee"
  }
}
```

**Réponse si email existe (400) :**
```json
{
  "email": ["An account with this email already exists. Please use the account linking flow to connect your social account."],
  "requires_linking": true
}
```

---

#### 3. Inscription Mentor Social
```
POST /register/mentor/social/
Headers: 
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: multipart/form-data
```

**Body (FormData) :**
```javascript
{
  full_name: "Jane Smith",
  bio: "Experienced software engineer...",
  expertise: ["Python", "JavaScript"],
  country: "USA",
  profile_picture: File (optional),
  linkedin_url: "https://linkedin.com/in/jane" (optional),
  website_url: "https://janesmith.com" (optional)
}
```

**Réponse succès (201) :**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "mentor",
    "status": "pending"
  }
}
```

---

#### 4. Vérifier Email
```
POST /register/check-email/
Headers: Authorization: Bearer <JWT_TOKEN>
```

**Body :**
```json
{
  "email": "user@example.com"
}
```

**Réponse :**
```json
{
  "success": true,
  "exists": true,
  "requires_linking": true,
  "message": "Account with this email already exists."
}
```

---

#### 5. Demander Account Linking
```
POST /register/request-linking/
Headers: Authorization: Bearer <JWT_TOKEN>
```

**Body :**
```json
{
  "email": "user@example.com",
  "link_consent": true,
  "registration_data": {
    "full_name": "John Doe",
    "field_of_study": "Computer Science",
    "country": "USA"
  },
  "role": "mentee"
}
```

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "A verification email has been sent to your email address. Please check your inbox and click the link to complete account linking.",
  "expires_at": "2024-01-15T10:30:00Z",
  "expires_in_minutes": 15
}
```

---

#### 6. Vérifier Account Linking
```
GET /register/verify-linking/<token>/
Headers: None (public endpoint)
```

**Réponse succès (200) :**
```json
{
  "success": true,
  "message": "Accounts linked successfully!",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "mentee"
  }
}
```

---

#### 7. Logout
```
POST /logout/
Headers: Authorization: Bearer <JWT_TOKEN>
```

**Réponse :**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## ⚠️ Gestion des Erreurs

### Erreurs Communes

#### 1. **401 Unauthorized**
- **Cause** : Token invalide ou expiré
- **Solution** : Rediriger vers login, obtenir un nouveau token

#### 2. **400 Bad Request - requires_linking**
- **Cause** : Email existe déjà
- **Solution** : Afficher le dialog de linking

#### 3. **403 Forbidden**
- **Cause** : Utilisateur banni ou rejeté
- **Solution** : Afficher message d'erreur approprié

#### 4. **404 Not Found**
- **Cause** : Utilisateur non enregistré
- **Solution** : Rediriger vers formulaire d'inscription

#### 5. **500 Internal Server Error**
- **Cause** : Erreur serveur
- **Solution** : Logger l'erreur, afficher message générique

---

## 🔐 Sécurité

### Bonnes Pratiques

1. **Toujours valider le token** avant d'appeler les endpoints backend
2. **Ne jamais stocker le token** dans le localStorage si possible (utiliser httpOnly cookies en production)
3. **Vérifier l'expiration du token** et le renouveler automatiquement
4. **Gérer les erreurs** de manière sécurisée (ne pas exposer les détails techniques)
5. **Utiliser HTTPS** en production

---

## 📝 Checklist d'Intégration

- [ ] Installer `@auth0/auth0-spa-js`
- [ ] Configurer les variables d'environnement Auth0
- [ ] Créer le service `AuthService`
- [ ] Créer le service `ApiService`
- [ ] Implémenter la page `/callback`
- [ ] Implémenter la page `/register` (social)
- [ ] Implémenter le dialog de linking
- [ ] Implémenter la page `/verify-linking/:token`
- [ ] Tester le flow complet (nouvel utilisateur)
- [ ] Tester le flow complet (utilisateur existant)
- [ ] Tester le flow de linking
- [ ] Gérer les erreurs appropriées
- [ ] Ajouter le loading states
- [ ] Ajouter les messages de succès/erreur

---

## 🎯 Résumé du Workflow

1. **User clique "Login with Google"** → Redirection Auth0
2. **Auth0 authentifie** → Retourne JWT token
3. **Frontend stocke token** → Appelle `/me/`
4. **Si utilisateur existe** → Redirect dashboard
5. **Si utilisateur n'existe pas** → Afficher formulaire d'inscription
6. **User remplit formulaire** → POST `/register/mentee/social/` ou `/register/mentor/social/`
7. **Si email existe** → Afficher dialog linking → POST `/register/request-linking/`
8. **User clique lien email** → GET `/register/verify-linking/<token>/`
9. **Linking réussi** → Redirect dashboard

---

**Note** : Ce guide couvre l'intégration complète. Adaptez le code selon votre framework frontend (React, Vue, Angular, etc.) et votre structure de projet.

