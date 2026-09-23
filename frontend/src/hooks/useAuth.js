import { useSelector, useDispatch } from "react-redux";
import {
  selectCurrentUser,
  selectCurrentToken,
  selectAuthLoading,
  setCredentials,
  logout,
} from "../redux/features/authSlice";
import {
  useLoginMutation,
  useSignupMutation,
  useGetMeQuery,
} from "../redux/api/authApi";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);
  const loading = useSelector(selectAuthLoading);

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signupMutation, { isLoading: isSignupLoading }] = useSignupMutation();

  // If token exists but user state isn't populated, fetch /me
  const { data: meData, isLoading: isMeLoading } = useGetMeQuery(undefined, {
    skip: !token || !!user,
  });

  useEffect(() => {
    if (meData && !user) {
      dispatch(setCredentials({ user: meData, token }));
    }
  }, [meData, user, token, dispatch]);

  const signIn = async (email, password) => {
    const res = await loginMutation({ email, password }).unwrap();
    dispatch(setCredentials({ user: res.user, token: res.token }));
    return res;
  };

  const signUp = async (name, email, password) => {
    const res = await signupMutation({ name, email, password }).unwrap();
    dispatch(setCredentials({ user: res.user, token: res.token }));
    return res;
  };

  const signOut = () => {
    dispatch(logout());
  };

  const isCheckingAuth = !!token && !user;

  return {
    user,
    token,
    isAuthenticated: !!token,
    isLoading: loading || isLoginLoading || isSignupLoading || isCheckingAuth || isMeLoading,
    signIn,
    signUp,
    signOut,
  };
};

export default useAuth;
