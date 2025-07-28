// Skills API Service
// This service handles all backend communication for user skills

export interface SkillsAPI {
  getUserSkills(): Promise<string[]>;
  addSkill(skill: string): Promise<void>;
  removeSkill(skill: string): Promise<void>;
  updateSkills(skills: string[]): Promise<void>;
  validateSkill(skill: string): Promise<boolean>;
}

export interface SkillsResponse {
  success: boolean;
  data?: string[];
  error?: string;
  message?: string;
}

// Mock implementation for now - replace with actual API calls
class MockSkillsAPI implements SkillsAPI {
  private mockSkills: string[] = [];
  private mockDelay = 500; // Simulate network delay

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getUserSkills(): Promise<string[]> {
    await this.delay(this.mockDelay);
    return [...this.mockSkills];
  }

  async addSkill(skill: string): Promise<void> {
    await this.delay(this.mockDelay);
    if (!this.mockSkills.includes(skill)) {
      this.mockSkills.push(skill);
    }
  }

  async removeSkill(skill: string): Promise<void> {
    await this.delay(this.mockDelay);
    this.mockSkills = this.mockSkills.filter(s => s !== skill);
  }

  async updateSkills(skills: string[]): Promise<void> {
    await this.delay(this.mockDelay);
    this.mockSkills = [...skills];
  }

  async validateSkill(skill: string): Promise<boolean> {
    await this.delay(100);
    // Mock validation - in real implementation, this would check against backend rules
    return skill.trim().length > 0 && skill.trim().length <= 50;
  }
}

// Export singleton instance
export const skillsAPI: SkillsAPI = new MockSkillsAPI();

// Error types for better error handling
export class SkillsAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'SkillsAPIError';
  }
}

// Utility functions for skills management
export const skillsUtils = {
  // Validate skill format
  isValidSkillFormat(skill: string): boolean {
    return skill.trim().length > 0 && skill.trim().length <= 50;
  },

  // Normalize skill name (capitalize, trim, etc.)
  normalizeSkill(skill: string): string {
    return skill.trim().replace(/\s+/g, ' ');
  },

  // Check if skill is duplicate
  isDuplicate(skill: string, existingSkills: string[]): boolean {
    const normalizedSkill = this.normalizeSkill(skill);
    return existingSkills.some(existing => 
      this.normalizeSkill(existing).toLowerCase() === normalizedSkill.toLowerCase()
    );
  },

  // Get skill suggestions based on input
  getSuggestions(input: string, predefinedSkills: string[], existingSkills: string[]): string[] {
    const normalizedInput = input.toLowerCase().trim();
    if (!normalizedInput) return [];

    return predefinedSkills
      .filter(skill => 
        skill.toLowerCase().includes(normalizedInput) &&
        !existingSkills.includes(skill)
      )
      .slice(0, 10);
  }
}; 