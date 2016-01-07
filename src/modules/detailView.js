import Immutable from 'immutable';

const SET_HAS_SCROLLED = 'SET_HAS_SCROLLED';
const SET_TOOLBAR_STATUS = 'SET_TOOLBAR_STATUS';
const SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD';

const initialState = Immutable.Map({
  hasScrolled: false,
  toolbarOn: true,
  searchKeyword: ''
});

const actionsMap = {

  [SET_SEARCH_KEYWORD]: (state, action) => state.set('searchKeyword', action.searchKeyword),

  [SET_HAS_SCROLLED]: (state, action) => state.set('hasScrolled', action.hasScrolled),

  [SET_TOOLBAR_STATUS]: (state, action) => state.set('toolbarOn', action.toolbarOn)
};

export default function reducer(state = initialState, action) {
  const reduceFn = actionsMap[action.type];
  return reduceFn ? reduceFn(state, action) : state;
}

export function setHasScrolled(hasScrolled) {
  return {
    type: SET_HAS_SCROLLED,
    hasScrolled
  }
}

export function setToolbarStatus(toolbarOn) {
  return {
    type: SET_TOOLBAR_STATUS,
    toolbarOn
  };
}

export function setSearchKeyword(searchKeyword) {
  return {
    type: SET_SEARCH_KEYWORD,
    searchKeyword
  };
}
