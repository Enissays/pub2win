import { Influencer, User } from './types';

// Action Types
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';
export const FETCH_INFLUENCERS_REQUEST = 'FETCH_INFLUENCERS_REQUEST';
export const FETCH_INFLUENCERS_SUCCESS = 'FETCH_INFLUENCERS_SUCCESS';
export const FETCH_INFLUENCERS_FAILURE = 'FETCH_INFLUENCERS_FAILURE';

// Action Interfaces
interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: User;
}

interface LoginFailureAction {
  type: typeof LOGIN_FAILURE;
  payload: string;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

interface FetchInfluencersRequestAction {
  type: typeof FETCH_INFLUENCERS_REQUEST;
}

interface FetchInfluencersSuccessAction {
  type: typeof FETCH_INFLUENCERS_SUCCESS;
  payload: Influencer[];
}

interface FetchInfluencersFailureAction {
  type: typeof FETCH_INFLUENCERS_FAILURE;
  payload: string;
}

export type AppActionTypes =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailureAction
  | LogoutAction
  | FetchInfluencersRequestAction
  | FetchInfluencersSuccessAction
  | FetchInfluencersFailureAction;

// Action Creators
export const loginRequest = (): AppActionTypes => ({
  type: LOGIN_REQUEST,
});

export const loginSuccess = (user: User): AppActionTypes => ({
  type: LOGIN_SUCCESS,
  payload: user,
});

export const loginFailure = (error: string): AppActionTypes => ({
  type: LOGIN_FAILURE,
  payload: error,
});

export const logout = (): AppActionTypes => ({
  type: LOGOUT,
});

export const fetchInfluencersRequest = (): AppActionTypes => ({
  type: FETCH_INFLUENCERS_REQUEST,
});

export const fetchInfluencersSuccess = (influencers: Influencer[]): AppActionTypes => ({
  type: FETCH_INFLUENCERS_SUCCESS,
  payload: influencers,
});

export const fetchInfluencersFailure = (error: string): AppActionTypes => ({
  type: FETCH_INFLUENCERS_FAILURE,
  payload: error,
});