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

// In-memory post/comment store for demo mode
const _posts: Post[] = [];
const _comments: { [postId: string]: Comment[] } = {};

export const createPost = async (data: Omit<Post, 'id' | 'createdAt' | 'likesCount' | 'commentCount'>): Promise<string> => {
  const id = `post-${Date.now()}`;
  _posts.unshift({ ...data, id, createdAt: new Date(), likesCount: 0, commentCount: 0 });
  return id;
};
export const getPosts = async (): Promise<Post[]> => [..._posts];
export const addComment = async (data: Omit<Comment, 'id' | 'createdAt'>): Promise<string> => {
  const id = `comment-${Date.now()}`;
  const comment: Comment = { ...data, id, createdAt: new Date() };
  if (!_comments[data.postId]) _comments[data.postId] = [];
  _comments[data.postId].push(comment);
  const post = _posts.find(p => p.id === data.postId);
  if (post) post.commentCount += 1;
  return id;
};
export const getComments = async (postId: string): Promise<Comment[]> => [...(_comments[postId] ?? [])];

export const getFacilities = async (): Promise<Facility[]> => [];
export const getFacilitiesByType = async (_type: string): Promise<Facility[]> => [];
