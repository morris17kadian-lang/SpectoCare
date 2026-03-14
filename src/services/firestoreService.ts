// ─── Demo stubs – no Firebase needed ───────────────────────────────────────
// All functions return empty data or no-ops so the app renders without errors.
// Swap these out for real Firestore calls once Firebase credentials are added.
import { Child, Routine, BehaviorLog, JournalEntry, Post, Comment, Facility } from '../models';

export const addChild = async (_parentId: string, _data: any): Promise<string> => 'demo-child-1';
export const updateChild = async (_childId: string, _data: any): Promise<void> => {};
export const deleteChild = async (_childId: string): Promise<void> => {};
export const getChildren = async (_parentId: string): Promise<Child[]> => [];

export const addRoutine = async (_parentId: string, _childId: string, _data: any): Promise<string> => 'demo-routine-1';
export const updateRoutine = async (_routineId: string, _data: any): Promise<void> => {};
export const deleteRoutine = async (_routineId: string): Promise<void> => {};
export const getRoutines = async (_childId: string): Promise<Routine[]> => [];

export const addBehaviorLog = async (_parentId: string, _data: any): Promise<string> => 'demo-log-1';
export const getBehaviorLogs = async (_childId: string): Promise<BehaviorLog[]> => [];
export const deleteBehaviorLog = async (_logId: string): Promise<void> => {};

export const addJournalEntry = async (_parentId: string, _data: any): Promise<string> => 'demo-entry-1';
export const getJournalEntries = async (_childId: string): Promise<JournalEntry[]> => [];
export const deleteJournalEntry = async (_entryId: string): Promise<void> => {};

export const createPost = async (_data: any): Promise<string> => 'demo-post-1';
export const getPosts = async (): Promise<Post[]> => [];
export const addComment = async (_data: any): Promise<string> => 'demo-comment-1';
export const getComments = async (_postId: string): Promise<Comment[]> => [];

export const getFacilities = async (): Promise<Facility[]> => [];
export const getFacilitiesByType = async (_type: string): Promise<Facility[]> => [];
