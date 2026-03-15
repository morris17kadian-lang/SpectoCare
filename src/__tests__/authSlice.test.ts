import authReducer, { setUser, setToken, setLoading, reset } from '../stores/authSlice';

describe('authSlice', () => {
  const initialState = {
    user: null,
    token: null,
    loading: false,
  };

  it('returns initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('sets user', () => {
    const user = { uid: '1', email: 'a@b.com', role: 'parent' };
    expect(authReducer(initialState, setUser(user)).user).toEqual(user);
  });

  it('sets token', () => {
    expect(authReducer(initialState, setToken('tok')).token).toBe('tok');
  });

  it('sets loading', () => {
    expect(authReducer(initialState, setLoading(true)).loading).toBe(true);
  });

  it('reset clears user and token', () => {
    const state = authReducer(initialState, setUser({ uid: '1', email: 'a@b.com' }));
    expect(authReducer(state, reset())).toEqual(initialState);
  });
});
