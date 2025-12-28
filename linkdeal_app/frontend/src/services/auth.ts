import api from './api'
import { LOCAL_STORAGE_KEYS, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, AUTH0_AUDIENCE, AUTH0_DOMAIN } from '@/constants'
import axios from 'axios'

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  role: 'mentor' | 'mentee'
}

export interface AuthResponse {
  success: boolean
  data?: {
    id: string
    email: string
    role: string
    access_token?: string
    refresh_token?: string
  }
  message?: string
}

export interface UserProfile {
  auth0_id: string
  email: string
  role: string
  roles: string[]
  app_metadata: any
  permissions: string[]
}

class AuthService {
  // Login user - calls Auth0 via Vite proxy to bypass CORS
  // rememberMe: true = 30 days, false = session only
  async login(credentials: { email: string; password: string }, rememberMe: boolean = false): Promise<AuthResponse> {
    try {
      // Call Auth0's /oauth/token endpoint via Vite proxy (to bypass CORS)
      const auth0Response = await axios.post(
        '/auth0/oauth/token',  // Proxied through Vite to Auth0
        {
          grant_type: 'password',
          username: credentials.email,
          password: credentials.password,
          audience: AUTH0_AUDIENCE,
          scope: 'openid profile email',
          client_id: AUTH0_CLIENT_ID,
          client_secret: AUTH0_CLIENT_SECRET
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      console.log('Auth0 login response:', auth0Response.data)

      // Auth0 returns tokens: {access_token, id_token, token_type, expires_in}
      if (auth0Response.data.access_token) {
        // Get Auth0's actual token expiry (in seconds, typically 86400 = 24 hours)
        const expiresIn = auth0Response.data.expires_in || 86400; // Default to 24 hours if not provided

        if (rememberMe) {
          // Remember Me: Store in localStorage (persists across browser sessions)
          // Use the minimum of Auth0's expiry or 30 days for "remember me"
          const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
          const effectiveExpiry = Math.min(expiresIn, thirtyDaysInSeconds);
          const expiryDate = new Date();
          expiryDate.setSeconds(expiryDate.getSeconds() + effectiveExpiry);

          localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, auth0Response.data.access_token);
          localStorage.setItem('token_expiry', expiryDate.toISOString());
          localStorage.setItem('remember_me', 'true');
          if (auth0Response.data.id_token) {
            localStorage.setItem('id_token', auth0Response.data.id_token);
          }
          // Clear any sessionStorage tokens from previous session-only logins
          sessionStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
          sessionStorage.removeItem('token_expiry');
          sessionStorage.removeItem('id_token');
        } else {
          // Session only: Store in sessionStorage (clears when browser closes)
          const expiryDate = new Date();
          expiryDate.setSeconds(expiryDate.getSeconds() + expiresIn);

          sessionStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, auth0Response.data.access_token);
          sessionStorage.setItem('token_expiry', expiryDate.toISOString());
          if (auth0Response.data.id_token) {
            sessionStorage.setItem('id_token', auth0Response.data.id_token);
          }
          // Clear any localStorage tokens from previous "remember me" logins
          localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
          localStorage.removeItem('token_expiry');
          localStorage.removeItem('remember_me');
          localStorage.removeItem('id_token');
        }

        // Get user profile from Django backend using the access token
        try {
          const profileResponse = await api.get('auth/me/')
          const userData = {
            id: profileResponse.data.auth0_id,
            email: profileResponse.data.email,
            role: profileResponse.data.role,
          }

          // Store user data in the same storage as the token
          if (rememberMe) {
            localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));
          } else {
            sessionStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));
          }

          return {
            success: true,
            data: userData
          }
        } catch (profileError: any) {
          console.error('Failed to get user profile:', profileError)
          // Clear tokens since we can't get the profile - don't allow login with unknown role
          if (rememberMe) {
            localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
            localStorage.removeItem('token_expiry');
            localStorage.removeItem('remember_me');
            localStorage.removeItem('id_token');
          } else {
            sessionStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
            sessionStorage.removeItem('token_expiry');
            sessionStorage.removeItem('id_token');
          }

          // Return error - don't default to a role that might be wrong
          return {
            success: false,
            message: profileError?.message || 'Failed to load user profile. Please try again or contact support.'
          }
        }
      } else {
        // Handle Auth0 error response (when error comes in response body, not as exception)
        const errorCode = auth0Response.data.error;
        const errorDescription = auth0Response.data.error_description || 'Login failed';

        // Handle email not verified
        if (errorCode === 'email_not_verified' || errorDescription.toLowerCase().includes('email not verified') || errorDescription.toLowerCase().includes('verify your email')) {
          return {
            success: false,
            message: 'Your email address has not been verified. Please check your inbox for a verification email and click the link to verify your account.'
          }
        }

        // Handle invalid credentials
        if (errorCode === 'invalid_grant' || errorDescription.toLowerCase().includes('wrong email or password')) {
          return {
            success: false,
            message: 'Invalid email or password. Please check your credentials and try again.'
          }
        }

        return {
          success: false,
          message: errorDescription
        }
      }
    } catch (error: any) {
      // Don't log expected auth errors (wrong password, email not verified, etc.)

      // Handle Auth0 error responses
      if (error.response?.data) {
        const errorData = error.response.data;
        const errorCode = errorData.error;
        const errorDescription = errorData.error_description || errorData.error || 'Login failed';

        // Handle specific error cases
        if (errorCode === 'email_not_verified' ||
          errorDescription === 'email_not_verified' ||
          errorDescription.toLowerCase().includes('email not verified') ||
          errorDescription.toLowerCase().includes('email_not_verified') ||
          errorDescription.toLowerCase().includes('verify your email')) {
          return {
            success: false,
            message: 'Your email address has not been verified. Please check your inbox for a verification email and click the link to verify your account.'
          }
        }

        // Handle invalid credentials
        if (errorCode === 'invalid_grant' || errorDescription.toLowerCase().includes('wrong email or password')) {
          return {
            success: false,
            message: 'Invalid email or password. Please check your credentials and try again.'
          }
        }

        // Handle blocked/banned user
        if (errorCode === 'unauthorized' && (errorDescription.toLowerCase().includes('blocked') || errorDescription.toLowerCase().includes('banned'))) {
          return {
            success: false,
            message: 'Your account has been blocked. Please contact support for assistance.'
          }
        }

        // Handle brute force protection (too many login attempts)
        if (errorDescription.toLowerCase().includes('blocked after multiple') ||
          errorDescription.toLowerCase().includes('too many attempts') ||
          errorDescription.toLowerCase().includes('consecutive login attempts')) {
          return {
            success: false,
            message: 'Too many login attempts. Please try again later.'
          }
        }

        // Handle pending approval
        if (errorDescription.toLowerCase().includes('pending') || errorDescription.toLowerCase().includes('approval')) {
          return {
            success: false,
            message: 'Your account is pending approval. You will receive an email once your account is approved.'
          }
        }

        return {
          success: false,
          message: errorDescription
        }
      }

      return {
        success: false,
        message: error.message || 'Login failed. Please try again.'
      }
    }
  }

  // Social login - redirect to Auth0 Universal Login
  loginWithSocial(provider: 'google-oauth2' | 'linkedin'): void {
    const redirectUri = `${window.location.origin}/callback`;
    const state = Math.random().toString(36).substring(7); // Simple state for CSRF protection

    // Clear any previous social auth data to prevent stale data from previous accounts
    sessionStorage.removeItem('social_auth_pending');
    sessionStorage.removeItem('social_auth_timestamp');
    sessionStorage.removeItem('social_auth_name');
    sessionStorage.removeItem('social_auth_given_name');
    sessionStorage.removeItem('social_auth_family_name');
    sessionStorage.removeItem('social_auth_nickname');
    sessionStorage.removeItem('social_auth_picture');
    sessionStorage.removeItem('social_auth_email');
    sessionStorage.removeItem('social_auth_country');
    sessionStorage.removeItem('social_auth_language');

    // Store state for verification on callback
    sessionStorage.setItem('auth0_state', state);
    sessionStorage.setItem('auth0_provider', provider);
    // Store timestamp to detect stale sessions
    sessionStorage.setItem('social_auth_timestamp', Date.now().toString());

    // Build Auth0 authorization URL
    const authUrl = new URL(`https://${AUTH0_DOMAIN}/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', AUTH0_CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'openid profile email offline_access');
    authUrl.searchParams.set('audience', AUTH0_AUDIENCE);
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('connection', provider); // google-oauth2 or linkedin

    // Redirect to Auth0
    window.location.href = authUrl.toString();
  }

  // Handle social login callback - follows the flow:
  // 1. Get token from Auth0
  // 2. Store token
  // 3. Call backend with token to authenticate & sync user
  // 4. Decision: User exists? → Success / Registration needed / Linking needed
  async handleSocialCallback(code: string, state: string): Promise<AuthResponse & { needsRegistration?: boolean; requiresLinking?: boolean }> {
    try {
      // Verify state to prevent CSRF (if we have stored state)
      const storedState = sessionStorage.getItem('auth0_state');

      // Only validate if we have a stored state to compare against
      // State might be missing if page was reloaded during OAuth or HMR triggered
      if (storedState && state !== storedState) {
        console.warn('State mismatch - stored:', storedState, 'received:', state);
        return {
          success: false,
          message: 'Invalid state parameter. Please try again.'
        };
      }

      // Get the provider that was used
      const provider = sessionStorage.getItem('auth0_provider') || 'google-oauth2';

      // Clear stored state
      sessionStorage.removeItem('auth0_state');
      sessionStorage.removeItem('auth0_provider');

      const redirectUri = `${window.location.origin}/callback`;

      // Step 4: Exchange code for tokens (Auth0 returns access token JWT)
      const tokenResponse = await axios.post(
        '/auth0/oauth/token',
        {
          grant_type: 'authorization_code',
          client_id: AUTH0_CLIENT_ID,
          client_secret: AUTH0_CLIENT_SECRET,
          code: code,
          redirect_uri: redirectUri
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!tokenResponse.data.access_token) {
        return {
          success: false,
          message: 'Failed to get access token from social login.'
        };
      }

      // Step 5: Store token in localStorage
      localStorage.setItem(LOCAL_STORAGE_KEYS.TOKEN, tokenResponse.data.access_token);

      // Step 6 & 7: Call backend with token - backend authenticates & syncs user
      try {
        const profileResponse = await api.get('auth/me/');
        const profile = profileResponse.data;

        // Debug: log what the backend returns
        console.log('Backend /auth/me/ response:', profile);

        // Check if backend indicates account linking is needed
        // This happens when a social email matches an existing DB account
        if (profile.requires_linking) {
          // Store social auth info for the linking flow
          sessionStorage.setItem('social_auth_provider', provider);
          sessionStorage.setItem('social_auth_pending', 'true');
          sessionStorage.setItem('social_auth_email', profile.email || '');
          sessionStorage.setItem('social_auth_existing_role', profile.existing_role || 'mentee');
          sessionStorage.setItem('social_auth_requires_linking', 'true');

          // Try to get user's name from Auth0 userinfo endpoint
          try {
            const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
            if (token) {
              const userInfoResponse = await axios.get(
                `/auth0/userinfo`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              const userInfo = userInfoResponse.data;
              console.log('Auth0 userinfo (for linking):', userInfo);

              if (userInfo.name) {
                sessionStorage.setItem('social_auth_name', userInfo.name);
              }
              if (userInfo.picture) {
                sessionStorage.setItem('social_auth_picture', userInfo.picture);
              }
              // Email from namespaced claims
              const namespacedEmail = userInfo['https://linkdeal.com/claims/email'];
              if (namespacedEmail) {
                sessionStorage.setItem('social_auth_email', namespacedEmail);
              }
            }
          } catch (userInfoError) {
            console.log('Could not fetch userinfo for linking:', userInfoError);
          }

          return {
            success: false,
            requiresLinking: true,
            message: profile.message || 'An account with this email already exists. Would you like to link your accounts?'
          };
        }

        // Check if the backend indicates registration is needed
        // Backend now returns explicit needs_registration flag
        if (profile.needs_registration) {
          // User authenticated but profile not complete - needs registration
          // Store user info from social auth for signup pre-fill
          sessionStorage.setItem('social_auth_provider', provider);
          sessionStorage.setItem('social_auth_pending', 'true');
          sessionStorage.setItem('social_auth_email', profile.email || '');

          // Try to get user's name from Auth0 userinfo endpoint
          try {
            const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
            if (token) {
              const userInfoResponse = await axios.get(
                `/auth0/userinfo`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              const userInfo = userInfoResponse.data;
              console.log('Auth0 userinfo:', userInfo);

              // Store all available info for signup pre-fill
              // Common fields (Google & LinkedIn)
              if (userInfo.name) {
                sessionStorage.setItem('social_auth_name', userInfo.name);
              }
              if (userInfo.given_name) {
                sessionStorage.setItem('social_auth_given_name', userInfo.given_name);
              }
              if (userInfo.family_name) {
                sessionStorage.setItem('social_auth_family_name', userInfo.family_name);
              }
              if (userInfo.nickname) {
                sessionStorage.setItem('social_auth_nickname', userInfo.nickname);
              }
              if (userInfo.picture) {
                sessionStorage.setItem('social_auth_picture', userInfo.picture);
              }

              // Email from namespaced claims (both Google & LinkedIn)
              const namespacedEmail = userInfo['https://linkdeal.com/claims/email'];
              if (namespacedEmail) {
                sessionStorage.setItem('social_auth_email', namespacedEmail);
              }

              // LinkedIn-specific: locale info (country & language)
              if (userInfo.locale) {
                if (userInfo.locale.country) {
                  sessionStorage.setItem('social_auth_country', userInfo.locale.country);
                }
                if (userInfo.locale.language) {
                  sessionStorage.setItem('social_auth_language', userInfo.locale.language);
                }
              }
            }
          } catch (userInfoError) {
            console.log('Could not fetch userinfo:', userInfoError);
            // Continue anyway - name is optional
          }

          return {
            success: false,
            needsRegistration: true,
            message: 'Please complete your profile to finish registration.'
          };
        }

        // Step 8: User exists with complete profile! Login successful ✓
        const userData = {
          id: profile.id || profile.auth0_id || 'unknown',
          email: profile.email,
          role: profile.role || 'mentee'
        };

        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData));

        return {
          success: true,
          data: userData
        };
      } catch (profileError: any) {
        // Step 8: User doesn't exist → Registration needed
        // The user authenticated with Auth0 but doesn't have a profile in our database yet

        // Check the error to determine the flow
        const errorStatus = profileError.response?.status;
        // Backend error structure: { error: { type, message, details } }
        const errorObj = profileError.response?.data?.error || {};
        const errorMessage = errorObj.message ||
          profileError.response?.data?.message ||
          profileError.response?.data?.detail || '';

        // Backend returns 403 (AuthenticationFailed) when:
        // - User doesn't exist ("Account not found", "Registration required")
        // - Mentee/Mentor profile missing ("profile not found", "complete registration")
        // Also check for 404 for compatibility
        const isRegistrationNeeded = (
          errorStatus === 404 ||
          (errorStatus === 403 && (
            errorMessage.toLowerCase().includes('not found') ||
            errorMessage.toLowerCase().includes('registration') ||
            errorMessage.toLowerCase().includes('complete registration')
          ))
        );

        if (isRegistrationNeeded) {
          // User not found in database - needs to complete registration
          // We have the token, so they're authenticated with Auth0
          // Store the provider info for the registration flow
          sessionStorage.setItem('social_auth_provider', provider);
          sessionStorage.setItem('social_auth_pending', 'true');

          // Fetch user info from Auth0 userinfo endpoint to get name, picture, etc.
          try {
            const token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
            if (token) {
              const userInfoResponse = await axios.get(
                `/auth0/userinfo`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              const userInfo = userInfoResponse.data;
              console.log('Auth0 userinfo (from 403 handler):', userInfo);

              // Store all available info for signup pre-fill
              // Common fields (Google & LinkedIn)
              if (userInfo.name) {
                sessionStorage.setItem('social_auth_name', userInfo.name);
              }
              if (userInfo.given_name) {
                sessionStorage.setItem('social_auth_given_name', userInfo.given_name);
              }
              if (userInfo.family_name) {
                sessionStorage.setItem('social_auth_family_name', userInfo.family_name);
              }
              if (userInfo.nickname) {
                sessionStorage.setItem('social_auth_nickname', userInfo.nickname);
              }
              if (userInfo.picture) {
                sessionStorage.setItem('social_auth_picture', userInfo.picture);
              }

              // Email from namespaced claims (both Google & LinkedIn)
              const namespacedEmail = userInfo['https://linkdeal.com/claims/email'];
              if (namespacedEmail) {
                sessionStorage.setItem('social_auth_email', namespacedEmail);
              }

              // LinkedIn-specific: locale info (country & language)
              if (userInfo.locale) {
                if (userInfo.locale.country) {
                  sessionStorage.setItem('social_auth_country', userInfo.locale.country);
                }
                if (userInfo.locale.language) {
                  sessionStorage.setItem('social_auth_language', userInfo.locale.language);
                }
              }
            }
          } catch (userInfoError) {
            console.log('Could not fetch userinfo (from 403 handler):', userInfoError);
            // Continue anyway - social data is optional
          }

          return {
            success: false,
            needsRegistration: true,
            message: 'Please complete your profile to finish registration.'
          };
        }

        // Some other error occurred (banned, rejected, etc.)
        return {
          success: false,
          message: errorMessage || 'Failed to get user profile. Please try again.'
        };
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error_description ||
        error.response?.data?.error ||
        error.message ||
        'Social login failed';
      return {
        success: false,
        message: errorMsg
      };
    }
  }

  // Simple mentor registration (without Auth0, creates DB record only)
  async registerMentorDB(data: any): Promise<AuthResponse> {
    try {
      // Use the mentor registration endpoint
      const endpoint = 'auth/register/mentor/'
      const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${endpoint}`

      console.log('Sending simple mentor registration data:', data)
      console.log('Full URL:', fullUrl)

      // Handle FormData (for file uploads) vs JSON
      const response = await api.post(endpoint, data, {
        headers: {
          'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      })

      console.log('Simple mentor registration response:', response.data)

      // Success check - backend returns email and status for MentorProfile
      // Check for email presence as the main success indicator
      if (response.data.email) {
        console.log('Mentor registration successful - storing user data')
        // Store user data if registration successful
        const userData = {
          id: response.data.id || response.data.user_id || 'pending',
          email: response.data.email,
          role: 'mentor',
          status: response.data.status || 'pending',
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData))

        return {
          success: true,
          data: userData
        }
      } else {
        console.log('Mentor registration failed - no email in response')
        return {
          success: false,
          message: 'Registration failed'
        }
      }
    } catch (error: any) {
      console.log('Simple mentor registration error:', error)

      // Handle validation errors from backend
      if (error.response?.data) {
        const errorData = error.response.data;
        const statusCode = error.response.status;
        console.log('Error data structure:', JSON.stringify(errorData, null, 2));

        let errorMessage = 'Registration failed';

        // Handle 502 Bad Gateway (Auth0 errors like user already exists)
        if (statusCode === 502) {
          const errorType = errorData.error?.type;
          const errorMsg = errorData.error?.message || '';

          if (errorType === 'ExternalServiceError' || errorMsg.includes('Auth0') || errorMsg.includes('already exists')) {
            errorMessage = 'This email is already registered. Please use a different email or try logging in.';
          } else {
            errorMessage = 'Registration service temporarily unavailable. Please try again in a few minutes.';
          }
        }
        // Handle 409 Conflict (duplicate user)
        else if (statusCode === 409) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        }
        // Handle the new backend error format: { error: { type, message, details } }
        else if (errorData.error?.details) {
          const details = errorData.error.details;
          const fieldErrors: string[] = [];

          // Map field names to user-friendly labels
          const fieldLabels: { [key: string]: string } = {
            'email': 'Email',
            'password': 'Password',
            'password_confirm': 'Confirm Password',
            'full_name': 'Full Name',
            'professional_title': 'Professional Title',
            'location': 'Location',
            'linkedin_url': 'LinkedIn URL',
            'bio': 'Bio',
            'languages': 'Languages',
            'country': 'Country',
            'cv': 'CV',
            'profile_picture': 'Profile Picture'
          };

          // Extract all field-specific errors
          for (const [field, messages] of Object.entries(details)) {
            const label = fieldLabels[field] || field;
            const messageArray = Array.isArray(messages) ? messages : [messages];
            fieldErrors.push(`${label}: ${messageArray.join(', ')}`);
          }

          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('\n');
          }
        }
        // Handle ExternalServiceError type
        else if (errorData.error?.type === 'ExternalServiceError') {
          const msg = errorData.error?.message || '';
          if (msg.includes('already exists') || msg.includes('409')) {
            errorMessage = 'This email is already registered. Please use a different email or try logging in.';
          } else {
            errorMessage = 'Registration service temporarily unavailable. Please try again in a few minutes.';
          }
        }
        // Handle legacy error format
        else if (typeof errorData === 'object') {
          const errors = [];
          if (errorData.email) errors.push(`Email: ${Array.isArray(errorData.email) ? errorData.email.join(', ') : errorData.email}`);
          if (errorData.password) errors.push(`Password: ${Array.isArray(errorData.password) ? errorData.password.join(', ') : errorData.password}`);
          if (errorData.cv) errors.push(`CV: ${Array.isArray(errorData.cv) ? errorData.cv.join(', ') : errorData.cv}`);
          if (errorData.linkedin_url) errors.push(`LinkedIn URL: ${Array.isArray(errorData.linkedin_url) ? errorData.linkedin_url.join(', ') : errorData.linkedin_url}`);
          if (errorData.non_field_errors) errors.push(errorData.non_field_errors.join(', '));
          if (errorData.error === "Email already registered") {
            errorMessage = errorData.message || "This email is already registered. Please use a different email or try logging in.";
          }
          if (errors.length > 0) {
            errorMessage = errors.join('\n');
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        return {
          success: false,
          message: errorMessage
        }
      }

      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.'
      }
    }
  }

  // Mock mentor registration (for development without Auth0)
  async registerMentorMock(data: any): Promise<AuthResponse> {
    try {
      console.log('Mock mentor registration data:', data)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Extract email from FormData
      let email = ''
      if (data instanceof FormData) {
        email = data.get('email') as string
      } else {
        email = data.email
      }

      // Mock successful registration
      const userData = {
        id: 'mock-mentor-id-' + Date.now(),
        email: email,
        role: 'mentor',
      }

      console.log('Mock mentor registration successful:', userData)

      // Store user data
      localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData))

      return {
        success: true,
        data: userData
      }
    } catch (error: any) {
      console.log('Mock mentor registration error:', error)
      return {
        success: false,
        message: error.message || 'Mock registration failed. Please try again.'
      }
    }
  }

  // Register mentor (simple version without Auth0)
  async registerMentorSimple(data: any): Promise<AuthResponse> {
    try {
      const endpoint = 'auth/register/mentor/'
      const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${endpoint}`

      console.log('Sending mentor registration data:', data)
      console.log('Full URL:', fullUrl)

      // Handle FormData (for file uploads) vs JSON
      const response = await api.post(endpoint, data, {
        headers: {
          'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      })

      console.log('Mentor registration response:', response.data)

      // Simple success check - if we get user data back, it's successful
      if (response.data.email && response.data.id) {
        console.log('Mentor registration successful - storing user data')
        // Store user data if registration successful
        const userData = {
          id: response.data.id,
          email: response.data.email,
          role: 'mentor',
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData))

        return {
          success: true,
          data: userData
        }
      } else {
        console.log('Mentor registration failed')
        return {
          success: false,
          message: 'Registration failed'
        }
      }
    } catch (error: any) {
      console.log('Mentor registration error:', error)

      // Handle validation errors from backend
      if (error.response?.data) {
        const errorData = error.response.data;
        console.log('Error data structure:', JSON.stringify(errorData, null, 2));

        let errorMessage = 'Registration failed';

        // Check for specific email already registered error
        if (errorData.error?.details?.email && errorData.error.details.email[0]?.includes('Email is already registered')) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        }
        // Check for Auth0 service errors
        else if (errorData.error?.type === 'ExternalServiceError' && errorData.error?.message?.includes('Auth0')) {
          errorMessage = 'Registration service temporarily unavailable. Please try again in a few minutes.';
        }
        // Extract specific field errors
        else if (typeof errorData === 'object') {
          const errors = [];
          if (errorData.email) errors.push(`Email: ${errorData.email}`);
          if (errorData.password) errors.push(`Password: ${errorData.password}`);
          if (errorData.cv) errors.push(`CV: ${errorData.cv}`);
          if (errorData.linkedin_url) errors.push(`LinkedIn Profile: ${errorData.linkedin_url}`);
          if (errorData.non_field_errors) errors.push(errorData.non_field_errors.join(', '));
          if (errors.length > 0) {
            errorMessage = errors.join('; ');
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        return {
          success: false,
          message: errorMessage
        }
      }

      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.'
      }
    }
  }

  // Register mentor
  async registerMentor(data: any): Promise<AuthResponse> {
    try {
      const endpoint = 'auth/register/mentor/'
      const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${endpoint}`

      console.log('Sending mentor registration data:', data)
      console.log('Full URL:', fullUrl)

      // Handle FormData (for file uploads) vs JSON
      const response = await api.post(endpoint, data, {
        headers: {
          'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      })

      console.log('Mentor registration response:', response.data)
      console.log('Response data keys:', Object.keys(response.data))
      console.log('Response data type:', typeof response.data)

      // Check if response contains user data (success case)
      if (response.data.email && response.data.full_name) {
        console.log('Mentor registration successful - storing user data')
        // Store user data if registration successful
        const userData = {
          id: response.data.id || 'temp-id',
          email: response.data.email,
          role: 'mentor',
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData))

        return {
          success: true,
          data: userData
        }
      }
      // Check for MentorProfile response (contains different fields)
      else if (response.data.email && response.data.status === 'pending') {
        console.log('Mentor registration successful - MentorProfile response')
        // Store user data if registration successful
        const userData = {
          id: response.data.id || 'temp-id',
          email: response.data.email,
          role: 'mentor',
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData))

        return {
          success: true,
          data: userData
        }
      } else {
        console.log('Mentor registration failed - unexpected response format:', response.data)
        return {
          success: false,
          message: 'Registration failed'
        }
      }
    } catch (error: any) {
      console.log('Mentor registration error:', error);
      console.log('Full error response:', error.response?.data);

      // Handle validation errors from backend
      if (error.response?.data) {
        const errorData = error.response.data;
        console.log('Error data structure:', JSON.stringify(errorData, null, 2));

        let errorMessage = 'Registration failed';

        // Check for specific email already registered error
        if (errorData.error?.details?.email && errorData.error.details.email[0]?.includes('Email is already registered')) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        }
        // Check for Auth0 service errors
        else if (errorData.error?.type === 'ExternalServiceError' && errorData.error?.message?.includes('Auth0')) {
          errorMessage = 'Registration service temporarily unavailable. Please try again in a few minutes.';
        }
        // Extract specific field errors
        else if (typeof errorData === 'object') {
          const errors = [];
          if (errorData.email) errors.push(`Email: ${errorData.email}`);
          if (errorData.password) errors.push(`Password: ${errorData.password}`);
          if (errorData.cv) errors.push(`CV: ${errorData.cv}`);
          if (errorData.linkedin_url) errors.push(`LinkedIn Profile: ${errorData.linkedin_url}`);
          if (errorData.non_field_errors) errors.push(errorData.non_field_errors.join(', '));
          if (errors.length > 0) {
            errorMessage = errors.join('; ');
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        return {
          success: false,
          message: errorMessage
        }
      }

      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.'
      }
    }
  }

  // Register user
  async register(data: any): Promise<AuthResponse> {
    try {
      // For mentee registration, always use mentee endpoint
      const endpoint = 'auth/register/mentee/'
      const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${endpoint}`

      // Debug: Log the data being sent and full URL
      console.log('Sending registration data:', data)
      console.log('Full URL:', fullUrl)

      const response = await api.post(endpoint, data)

      // Backend returns user data directly on success: {email, full_name, field_of_study, country, profile_picture}
      console.log('Backend response:', response.data)
      console.log('Response data success:', response.data.success)

      // Check if response contains user data (success case)
      if (response.data.email && response.data.full_name) {
        console.log('Registration successful - storing user data')
        // Store user data if registration successful
        const userData = {
          id: response.data.id || 'temp-id', // Backend doesn't return ID, use temp
          email: response.data.email,
          role: 'mentee', // Default role for mentee registration
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData))

        // Also store in registered users list for login
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        if (!registeredUsers.find((u: any) => u.email === userData.email)) {
          registeredUsers.push(userData);
          localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }

        console.log('User data stored:', userData)

        return {
          success: true,
          data: userData
        }
      } else {
        console.log('Registration failed - backend returned success: false')
        return {
          success: false,
          message: 'Registration failed'
        }
      }
    } catch (error: any) {
      // Debug: Log the full error response
      console.log('Registration error:', error)
      console.log('Error response data:', error.response?.data)
      console.log('Error response status:', error.response?.status)
      console.log('Error response headers:', error.response?.headers)
      console.log('Error config:', error.config)

      // Handle validation errors from backend
      if (error.response?.data) {
        const errorData = error.response.data
        let errorMessage = 'Registration failed'

        // Check for specific email already registered error first
        if (errorData.error?.details?.email && errorData.error.details.email[0]?.includes('Email is already registered')) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.'
        }
        // Check for validation errors with details (backend returns { error: { type, message, details } })
        else if (errorData.error?.details && typeof errorData.error.details === 'object') {
          const details = errorData.error.details
          const fieldErrors: string[] = []

          // Map field names to user-friendly labels
          const fieldLabels: { [key: string]: string } = {
            'email': 'Email',
            'password': 'Password',
            'password_confirm': 'Confirm Password',
            'full_name': 'Full Name',
            'field_of_study': 'Field of Study',
            'country': 'Country',
            'interests': 'Interests',
            'user_type': 'User Type',
            'session_frequency': 'Session Frequency',
            'profile_picture': 'Profile Picture'
          }

          // Extract all field-specific errors
          for (const [field, messages] of Object.entries(details)) {
            const label = fieldLabels[field] || field
            const messageArray = Array.isArray(messages) ? messages : [messages]
            fieldErrors.push(`${label}: ${messageArray.join(', ')}`)
          }

          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('\n')
          }
        }
        // Check for ExternalServiceError message (from Auth0 errors)
        else if (errorData.error?.message && errorData.error.message !== 'Validation error') {
          errorMessage = errorData.error.message
        }
        // Extract specific field errors from legacy format
        else if (typeof errorData === 'object' && !errorData.error) {
          const errors = []
          if (errorData.email) errors.push(`Email: ${errorData.email}`)
          if (errorData.password) errors.push(`Password: ${errorData.password}`)
          if (errorData.non_field_errors) errors.push(errorData.non_field_errors.join(', '))
          if (errors.length > 0) {
            errorMessage = errors.join('; ')
          }
        } else if (errorData.message) {
          errorMessage = errorData.message
        }

        console.log('Final error message:', errorMessage)
        return {
          success: false,
          message: errorMessage
        }
      }

      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.'
      }
    }
  }

  // Register user with FormData (for file uploads like profile picture)
  async registerWithFormData(formData: FormData): Promise<AuthResponse> {
    try {
      const endpoint = 'auth/register/mentee/'
      const fullUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/${endpoint}`

      console.log('Sending registration with FormData to:', fullUrl)

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      console.log('Backend response:', response.data)

      // Check if response contains user data (success case)
      if (response.data.email && response.data.full_name) {
        console.log('Registration successful - storing user data')
        const userData = {
          id: response.data.id || 'temp-id',
          email: response.data.email,
          role: 'mentee',
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData))

        return {
          success: true,
          data: userData,
          message: 'Registration successful'
        }
      }

      return {
        success: false,
        message: response.data.message || 'Registration failed'
      }
    } catch (error: any) {
      console.error('Registration with FormData error:', error)

      if (error.response?.data) {
        const errorData = error.response.data
        let errorMessage = 'Registration failed'

        // Check for field-level validation errors FIRST (before generic message)
        if (errorData.error?.details && typeof errorData.error.details === 'object') {
          const details = errorData.error.details
          // Extract just the error messages without redundant field labels
          const messages: string[] = []
          for (const [, errors] of Object.entries(details)) {
            if (Array.isArray(errors)) {
              messages.push(...errors)
            } else if (typeof errors === 'string') {
              messages.push(errors)
            }
          }
          if (messages.length > 0) {
            errorMessage = messages.join('\n')
          }
        }
        // Check for ExternalServiceError message (from Auth0 errors) - skip generic "Validation error"
        else if (errorData.error?.message && errorData.error.message !== 'Validation error') {
          errorMessage = errorData.error.message
        }

        return {
          success: false,
          message: errorMessage
        }
      }

      return {
        success: false,
        message: error.message || 'Registration failed. Please try again.'
      }
    }
  }

  // Get current user profile
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await api.get('auth/me/')
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      // Call backend logout endpoint
      await api.post('auth/logout/')
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with local logout even if API fails
    }

    // Clear localStorage (remember me tokens)
    localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    localStorage.removeItem('token_expiry');
    localStorage.removeItem('remember_me');
    localStorage.removeItem('id_token');

    // Clear sessionStorage (session-only tokens)
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
    sessionStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
    sessionStorage.removeItem('token_expiry');
    sessionStorage.removeItem('id_token');

    // Clear any social auth session data
    sessionStorage.removeItem('social_auth_email');
    sessionStorage.removeItem('social_auth_name');
    sessionStorage.removeItem('social_auth_pending');
    sessionStorage.removeItem('social_auth_provider');
    sessionStorage.removeItem('social_auth_picture');
  }

  // Check if user is authenticated
  // Checks both localStorage (remember me) and sessionStorage (session only)
  // Always validates token expiry
  isAuthenticated(): boolean {
    // First check localStorage (remember me tokens)
    let token = localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
    let user = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    let tokenExpiry = localStorage.getItem('token_expiry');
    let storageType: 'local' | 'session' = 'local';

    // If not in localStorage, check sessionStorage (session-only tokens)
    if (!token) {
      token = sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
      user = sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER);
      tokenExpiry = sessionStorage.getItem('token_expiry');
      storageType = 'session';
    }

    if (!token || !user) {
      return false;
    }

    // ALWAYS check if token has expired (regardless of rememberMe)
    if (tokenExpiry) {
      const expiryDate = new Date(tokenExpiry);
      if (new Date() > expiryDate) {
        // Token expired - clear auth data from the appropriate storage
        console.log('Token expired - logging out');
        if (storageType === 'local') {
          localStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
          localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
          localStorage.removeItem('token_expiry');
          localStorage.removeItem('remember_me');
          localStorage.removeItem('id_token');
        } else {
          sessionStorage.removeItem(LOCAL_STORAGE_KEYS.TOKEN);
          sessionStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
          sessionStorage.removeItem('token_expiry');
          sessionStorage.removeItem('id_token');
        }
        return false;
      }
    }

    return true;
  }

  // Get stored user data (checks both localStorage and sessionStorage)
  getUser(): any | null {
    // First check localStorage
    let userStr = localStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    // If not found, check sessionStorage
    if (!userStr) {
      userStr = sessionStorage.getItem(LOCAL_STORAGE_KEYS.USER);
    }
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get the stored token (checks both localStorage and sessionStorage)
  getToken(): string | null {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN) || sessionStorage.getItem(LOCAL_STORAGE_KEYS.TOKEN);
  }

  // Social registration (for Google/LinkedIn)
  // Returns { success, requiresLinking?, data?, message? }
  async socialRegister(role: 'mentor' | 'mentee', profileData: any): Promise<AuthResponse & { requiresLinking?: boolean }> {
    try {
      const endpoint = role === 'mentor' ? 'auth/register/mentor/social/' : 'auth/register/mentee/social/'

      // Check if profileData contains files - if so, use FormData
      const hasFiles = Object.values(profileData).some(value => value instanceof File)

      let response
      if (hasFiles) {
        // Convert to FormData for file upload
        const formData = new FormData()
        for (const [key, value] of Object.entries(profileData)) {
          if (value instanceof File) {
            formData.append(key, value)
          } else if (Array.isArray(value)) {
            // Handle arrays: append each item with the same key
            // This is the standard way to send arrays via FormData
            value.forEach(item => formData.append(key, String(item)))
          } else if (value !== null && value !== undefined) {
            formData.append(key, String(value))
          }
        }
        response = await api.post(endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        response = await api.post(endpoint, profileData)
      }

      // Handle successful registration
      if (response.data.email || response.data.success) {
        const userData = {
          id: response.data.id || response.data.user_id || 'temp-id',
          email: response.data.email,
          role: role,
        }
        localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(userData))
        return { success: true, data: userData }
      }

      return response.data
    } catch (error: any) {
      console.log('Social registration error:', error.response?.data)

      // Check if this is an "email already exists" error requiring account linking
      const errorData = error.response?.data
      if (error.response?.status === 400) {
        // Check for email already registered error
        const details = errorData?.error?.details || errorData?.details || {}
        const emailErrors = details.email || []
        const isEmailExists = emailErrors.some((e: string) =>
          e.toLowerCase().includes('already registered') ||
          e.toLowerCase().includes('already exists')
        )

        if (isEmailExists) {
          return {
            success: false,
            requiresLinking: true,
            message: 'An account with this email already exists. Would you like to link your social account to the existing account?'
          }
        }

        // Extract validation error messages
        let errorMessage = 'Registration failed'
        if (errorData?.error?.details && typeof errorData.error.details === 'object') {
          const fieldErrors: string[] = []
          for (const [field, messages] of Object.entries(errorData.error.details)) {
            const msgArray = Array.isArray(messages) ? messages : [messages]
            fieldErrors.push(`${field}: ${msgArray.join(', ')}`)
          }
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('\n')
          }
        } else if (errorData?.error?.message) {
          errorMessage = errorData.error.message
        }

        return { success: false, message: errorMessage }
      }

      throw error
    }
  }

  // Check if email exists in the system (for account linking flow)
  async checkEmailExists(email: string): Promise<{ exists: boolean; requiresLinking: boolean; message: string }> {
    try {
      const response = await api.post('auth/register/check-email/', { email })
      return {
        exists: response.data.exists,
        requiresLinking: response.data.requires_linking || false,
        message: response.data.message || ''
      }
    } catch (error: any) {
      console.log('Check email error:', error.response?.data)
      throw error
    }
  }

  // Request account linking (sends verification email)
  async requestAccountLinking(
    email: string,
    role: 'mentor' | 'mentee',
    registrationData: any
  ): Promise<{ success: boolean; message: string; expiresAt?: string }> {
    try {
      const response = await api.post('auth/register/request-linking/', {
        email,
        link_consent: true,
        registration_data: registrationData,
        role
      })

      return {
        success: response.data.success,
        message: response.data.message,
        expiresAt: response.data.expires_at
      }
    } catch (error: any) {
      console.log('Request linking error:', error.response?.data)
      const errorData = error.response?.data
      return {
        success: false,
        message: errorData?.message || errorData?.error?.message || 'Failed to request account linking'
      }
    }
  }

  // Verify account linking (called when user clicks email link)
  async verifyLinking(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.get(`auth/register/verify-linking/${token}/`)
      return {
        success: response.data.success,
        message: response.data.message
      }
    } catch (error: any) {
      console.log('Verify linking error:', error.response?.data)
      const errorData = error.response?.data
      return {
        success: false,
        message: errorData?.message || errorData?.error?.message || 'Verification failed'
      }
    }
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('auth/password/reset/', { email })
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Confirm password reset
  async confirmPasswordReset(token: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post('auth/reset-password/confirm/', { token, password })
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Verify email
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`auth/verify-email/${token}/`)
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const authService = new AuthService()
export default authService
