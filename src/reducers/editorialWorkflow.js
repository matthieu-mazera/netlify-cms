import { Map, List, fromJS } from 'immutable';
import {
  UNPUBLISHED_ENTRIES_REQUEST, UNPUBLISHED_ENTRIES_SUCCESS
} from '../actions/editorialWorkflow';

const unpublishedEntries = (state = Map({ entities: Map(), pages: Map() }), action) => {
  switch (action.type) {
    case UNPUBLISHED_ENTRIES_REQUEST:
      return state.setIn(['pages', 'isFetching'], true);

    case UNPUBLISHED_ENTRIES_SUCCESS:
      const { entries, pages } = action.payload;
      return state.withMutations((map) => {
        entries.forEach((entry) => (
          map.setIn(['entities', `${entry.metaData.status}.${entry.slug}`], fromJS(entry).set('isFetching', false))
        ));
        map.set('pages', Map({
          ...pages,
          ids: List(entries.map((entry) => entry.slug))
        }));
      });
    default:
      return state;
  }
};

export const selectUnpublishedEntry = (state, status, slug) => (
  state.getIn(['entities', `${status}.${slug}`], null)
);

export const selectUnpublishedEntries = (state, status) => {
  const slugs = state.getIn(['pages', 'ids']);
  return slugs && slugs.map((slug) => selectUnpublishedEntry(state, status, slug));
};


export default unpublishedEntries;
