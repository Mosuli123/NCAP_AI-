import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';

import type {
  ConsentState,
  JourneyMilestone,
  Province,
  QuestionnaireResult,
  SupportedLanguage,
  UserProfile,
} from '@/types';
import { StorageKeys, clearAll, getItem, setItem } from '@/services/storage';

/**
 * ProfileContext is the single source of truth for the personalised career
 * journey. It persists to AsyncStorage on every change so a user's results,
 * favourites and chosen subjects survive restarts and remain available offline.
 */

type FavouriteKind = 'careers' | 'qualifications' | 'providers';

function createEmptyProfile(): UserProfile {
  return {
    id: `user-${Date.now()}`,
    language: 'en',
    createdAt: new Date().toISOString(),
    consent: {
      dataProcessing: false,
      notifications: false,
      analytics: false,
      updatedAt: new Date().toISOString(),
    },
    results: [],
    favourites: { careers: [], qualifications: [], providers: [] },
    chosenSubjectIds: [],
    journey: [
      { key: 'onboarded', label: 'Get started' },
      { key: 'subjects_chosen', label: 'Choose your subjects' },
      { key: 'jobfit_done', label: 'Complete Job Fit' },
      { key: 'careerchoice_done', label: 'Complete Career Choice' },
      { key: 'saved_career', label: 'Save a career you like' },
      { key: 'saved_provider', label: 'Save a place to study' },
    ],
  };
}

type Action =
  | { type: 'HYDRATE'; profile: UserProfile }
  | { type: 'SET_BASICS'; payload: Partial<Pick<UserProfile, 'displayName' | 'grade' | 'province' | 'language'>> }
  | { type: 'SET_CONSENT'; payload: Partial<ConsentState> }
  | { type: 'ADD_RESULT'; result: QuestionnaireResult }
  | { type: 'TOGGLE_FAVOURITE'; kind: FavouriteKind; id: string }
  | { type: 'SET_SUBJECTS'; ids: string[] }
  | { type: 'COMPLETE_MILESTONE'; key: JourneyMilestone['key'] }
  | { type: 'RESET' };

function markMilestone(journey: JourneyMilestone[], key: JourneyMilestone['key']): JourneyMilestone[] {
  return journey.map((m) => (m.key === key && !m.completedAt ? { ...m, completedAt: new Date().toISOString() } : m));
}

function reducer(state: UserProfile, action: Action): UserProfile {
  switch (action.type) {
    case 'HYDRATE':
      return action.profile;
    case 'SET_BASICS':
      return { ...state, ...action.payload };
    case 'SET_CONSENT':
      return {
        ...state,
        consent: { ...state.consent, ...action.payload, updatedAt: new Date().toISOString() },
      };
    case 'ADD_RESULT': {
      const journeyKey = action.result.type === 'jobfit' ? 'jobfit_done' : 'careerchoice_done';
      return {
        ...state,
        results: [action.result, ...state.results].slice(0, 20),
        journey: markMilestone(state.journey, journeyKey),
      };
    }
    case 'TOGGLE_FAVOURITE': {
      const list = state.favourites[action.kind];
      const exists = list.includes(action.id);
      const nextList = exists ? list.filter((x) => x !== action.id) : [...list, action.id];
      let journey = state.journey;
      if (!exists && action.kind === 'careers') journey = markMilestone(journey, 'saved_career');
      if (!exists && action.kind === 'providers') journey = markMilestone(journey, 'saved_provider');
      return { ...state, favourites: { ...state.favourites, [action.kind]: nextList }, journey };
    }
    case 'SET_SUBJECTS':
      return {
        ...state,
        chosenSubjectIds: action.ids,
        journey: action.ids.length ? markMilestone(state.journey, 'subjects_chosen') : state.journey,
      };
    case 'COMPLETE_MILESTONE':
      return { ...state, journey: markMilestone(state.journey, action.key) };
    case 'RESET':
      return createEmptyProfile();
    default:
      return state;
  }
}

interface ProfileContextValue {
  profile: UserProfile;
  hydrated: boolean;
  setBasics: (p: Partial<Pick<UserProfile, 'displayName' | 'grade' | 'province' | 'language'>>) => void;
  setConsent: (p: Partial<ConsentState>) => void;
  addResult: (r: QuestionnaireResult) => void;
  toggleFavourite: (kind: FavouriteKind, id: string) => void;
  isFavourite: (kind: FavouriteKind, id: string) => boolean;
  setSubjects: (ids: string[]) => void;
  completeMilestone: (key: JourneyMilestone['key']) => void;
  resetProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, dispatch] = useReducer(reducer, undefined, createEmptyProfile);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted profile once on mount.
  useEffect(() => {
    (async () => {
      const saved = await getItem<UserProfile>(StorageKeys.profile);
      if (saved) dispatch({ type: 'HYDRATE', profile: { ...createEmptyProfile(), ...saved } });
      setHydrated(true);
    })();
  }, []);

  // Persist on every change once hydrated.
  useEffect(() => {
    if (hydrated) void setItem(StorageKeys.profile, profile);
  }, [profile, hydrated]);

  const value = useMemo<ProfileContextValue>(
    () => ({
      profile,
      hydrated,
      setBasics: (p) => dispatch({ type: 'SET_BASICS', payload: p }),
      setConsent: (p) => dispatch({ type: 'SET_CONSENT', payload: p }),
      addResult: (r) => dispatch({ type: 'ADD_RESULT', result: r }),
      toggleFavourite: (kind, id) => dispatch({ type: 'TOGGLE_FAVOURITE', kind, id }),
      isFavourite: (kind, id) => profile.favourites[kind].includes(id),
      setSubjects: (ids) => dispatch({ type: 'SET_SUBJECTS', ids }),
      completeMilestone: (key) => dispatch({ type: 'COMPLETE_MILESTONE', key }),
      resetProfile: async () => {
        await clearAll();
        dispatch({ type: 'RESET' });
      },
    }),
    [profile, hydrated]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within a ProfileProvider');
  return ctx;
}

// Re-export for convenience where only the language matters.
export type { SupportedLanguage, Province };
