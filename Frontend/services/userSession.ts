// userSession.ts
// Manages user authentication state and profile data

export interface UserSession {
  token: string;
  email: string;
  profile: any; // User profile data from user-service
  isAuthenticated: boolean;
  isProfileComplete: boolean;
}

class UserSessionService {
  private currentSession: UserSession | null = null;

  // Set user session after successful login
  setUserSession(token: string, email: string, profile: any = null): void {
    console.log('UserSessionService - Setting user session for email:', email);
    
    this.currentSession = {
      token,
      email,
      profile,
      isAuthenticated: true,
      isProfileComplete: !!profile
    };
    
    console.log('UserSessionService - Session set:', {
      email: this.currentSession.email,
      isAuthenticated: this.currentSession.isAuthenticated,
      isProfileComplete: this.currentSession.isProfileComplete,
      hasProfile: !!this.currentSession.profile
    });
  }

  // Get current user session
  getUserSession(): UserSession | null {
    return this.currentSession;
  }

  // Get user profile data
  getUserProfile(): any | null {
    return this.currentSession?.profile || null;
  }

  // Get authentication token
  getToken(): string | null {
    return this.currentSession?.token || null;
  }

  // Get user email
  getUserEmail(): string | null {
    return this.currentSession?.email || null;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentSession?.isAuthenticated || false;
  }

  // Check if user profile is complete
  isProfileComplete(): boolean {
    return this.currentSession?.isProfileComplete || false;
  }

  // Update user profile data
  updateUserProfile(profile: any): void {
    if (this.currentSession) {
      console.log('UserSessionService - Updating user profile');
      this.currentSession.profile = profile;
      this.currentSession.isProfileComplete = true;
      console.log('UserSessionService - Profile updated:', {
        name: profile?.firstName + ' ' + profile?.lastName,
        hasAvatar: !!profile?.profilePictureUrl,
        hasHeaderImage: !!profile?.headerImage
      });
    }
  }

  // Clear user session (logout)
  clearSession(): void {
    console.log('UserSessionService - Clearing user session');
    this.currentSession = null;
  }

  // Get user's full name
  getUserFullName(): string {
    if (this.currentSession?.profile) {
      const { firstName, lastName } = this.currentSession.profile;
      return `${firstName || ''} ${lastName || ''}`.trim() || 'User';
    }
    return 'User';
  }

  // Get user's avatar URL
  getUserAvatarUrl(): string | null {
    return this.currentSession?.profile?.profilePictureUrl || null;
  }

  // Get user's header image URL
  getUserHeaderImageUrl(): string | null {
    return this.currentSession?.profile?.headerImage || null;
  }

  // Get user's headline/title
  getUserHeadline(): string {
    return this.currentSession?.profile?.headline || this.currentSession?.profile?.currentPosition || '';
  }

  // Get user's company
  getUserCompany(): string {
    return this.currentSession?.profile?.currentCompany || '';
  }

  // Get user's location
  getUserLocation(): string {
    return this.currentSession?.profile?.location || '';
  }

  // Get user's summary/about
  getUserSummary(): string {
    return this.currentSession?.profile?.summary || this.currentSession?.profile?.bio || '';
  }

  // Get user's skills
  getUserSkills(): string[] {
    return this.currentSession?.profile?.skills || [];
  }

  // Get user's work experience
  getUserWorkExperience(): any[] {
    return this.currentSession?.profile?.workExperience || this.currentSession?.profile?.workExperiences || [];
  }

  // Get user's education
  getUserEducation(): any[] {
    return this.currentSession?.profile?.education || [];
  }
}

// Export singleton instance
export const userSessionService = new UserSessionService(); 