export const UPDATE_PATHNAME = 'navigation/UPDATE_PATHNAME';

export const createUpdatePathname = pathname => {
  return {
    type: UPDATE_PATHNAME,
    payload: {
      pathname,
    },
  };
};
