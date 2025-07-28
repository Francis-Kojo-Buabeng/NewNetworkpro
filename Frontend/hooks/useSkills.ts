import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { skillsAPI, skillsUtils, SkillsAPIError } from '../services/skillsAPI';

interface UseSkillsReturn {
  skills: string[];
  isLoading: boolean;
  isSyncing: boolean;
  error: string | null;
  lastSyncTime: Date | null;
  addSkill: (skill: string) => Promise<void>;
  removeSkill: (skill: string) => Promise<void>;
  updateSkills: (skills: string[]) => Promise<void>;
  refreshSkills: () => Promise<void>;
  clearError: () => void;
}

export const useSkills = (): UseSkillsReturn => {
  const [skills, setSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);

  // Load skills from API
  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userSkills = await skillsAPI.getUserSkills();
      setSkills(userSkills);
      setLastSyncTime(new Date());
    } catch (err) {
      const errorMessage = err instanceof SkillsAPIError 
        ? err.message 
        : 'Failed to load skills. Please try again.';
      setError(errorMessage);
      console.error('Failed to load skills:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add a new skill
  const addSkill = useCallback(async (skill: string) => {
    const normalizedSkill = skillsUtils.normalizeSkill(skill);
    
    // Validate skill format
    if (!skillsUtils.isValidSkillFormat(normalizedSkill)) {
      setError('Skill must be between 1 and 50 characters.');
      return;
    }

    // Check for duplicates
    if (skillsUtils.isDuplicate(normalizedSkill, skills)) {
      setError('This skill has already been added.');
      return;
    }

    // Check skill limit
    if (skills.length >= 15) {
      setError('Maximum 15 skills allowed.');
      return;
    }

    setIsSyncing(true);
    setError(null);

    try {
      // Optimistic update
      const newSkills = [...skills, normalizedSkill];
      setSkills(newSkills);

      // Sync with backend
      await skillsAPI.addSkill(normalizedSkill);
      setLastSyncTime(new Date());
      
      // Show success feedback
      // ToastAndroid.show(`${normalizedSkill} added successfully`, ToastAndroid.SHORT);
      
    } catch (err) {
      // Revert optimistic update on failure
      setSkills(skills);
      
      const errorMessage = err instanceof SkillsAPIError 
        ? err.message 
        : 'Failed to add skill. Please try again.';
      setError(errorMessage);
      
      Alert.alert('Error', errorMessage);
      console.error('Failed to add skill:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [skills]);

  // Remove a skill
  const removeSkill = useCallback(async (skill: string) => {
    setIsSyncing(true);
    setError(null);

    try {
      // Optimistic update
      const newSkills = skills.filter(s => s !== skill);
      setSkills(newSkills);

      // Sync with backend
      await skillsAPI.removeSkill(skill);
      setLastSyncTime(new Date());
      
      // Show success feedback
      // ToastAndroid.show(`${skill} removed successfully`, ToastAndroid.SHORT);
      
    } catch (err) {
      // Revert optimistic update on failure
      setSkills(skills);
      
      const errorMessage = err instanceof SkillsAPIError 
        ? err.message 
        : 'Failed to remove skill. Please try again.';
      setError(errorMessage);
      
      Alert.alert('Error', errorMessage);
      console.error('Failed to remove skill:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [skills]);

  // Update all skills at once
  const updateSkills = useCallback(async (newSkills: string[]) => {
    setIsSyncing(true);
    setError(null);

    try {
      // Optimistic update
      setSkills(newSkills);

      // Sync with backend
      await skillsAPI.updateSkills(newSkills);
      setLastSyncTime(new Date());
      
    } catch (err) {
      // Revert optimistic update on failure
      setSkills(skills);
      
      const errorMessage = err instanceof SkillsAPIError 
        ? err.message 
        : 'Failed to update skills. Please try again.';
      setError(errorMessage);
      
      Alert.alert('Error', errorMessage);
      console.error('Failed to update skills:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [skills]);

  // Refresh skills from server
  const refreshSkills = useCallback(async () => {
    await loadSkills();
  }, [loadSkills]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load skills on mount
  useEffect(() => {
    loadSkills();
  }, [loadSkills]);

  return {
    skills,
    isLoading,
    isSyncing,
    error,
    lastSyncTime,
    addSkill,
    removeSkill,
    updateSkills,
    refreshSkills,
    clearError,
  };
}; 