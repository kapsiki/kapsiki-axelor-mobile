import React, {useCallback, useEffect} from 'react';

import {
  fetchActiveUser,
  useDispatch,
  useSelector,
} from '@axelor/aos-mobile-core';

import WelcomeHomeView from '../views/welcome-home-view';

export default () => {
  const dispatch = useDispatch();
  const {userId} = useSelector(state => state.auth);

  const fetchUser = useCallback(() => {
    dispatch(fetchActiveUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return <WelcomeHomeView />;
};
