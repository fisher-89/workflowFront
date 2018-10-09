export default {
  save(state, action) {
    const { store, id, data } = action.payload;
    if (id === undefined) {
      return {
        ...state,
        [store]: data,
      };
    } else {
      const originalStore = state[`${store}Details`];
      return {
        ...state,
        [`${store}Details`]: {
          ...originalStore,
          [id]: data,
        },
      };
    }
  },
  setTotal(state, action) {
    const { total, filtered } = action.payload;
    return {
      ...state,
      total,
      filtered,
    };
  },
  add(state, action) {
    const { store, data } = action.payload;
    let dataState = [];
    if (state[store]) {
      dataState = [...state[store]];
      dataState.push(data);
    }
    return {
      ...state,
      [store]: dataState,
    };
  },
  update(state, action) {
    const { store, id, data } = action.payload;
    const originalStore = { ...state[`${store}Details`] };
    Object.keys(originalStore).forEach((key) => {
      if (id === key) {
        delete originalStore[key];
      }
    });
    let updated = false;
    const newStore = state[store].map((item) => {
      if (parseInt(item.id, 0) === parseInt(id, 0)) {
        updated = true;
        return data;
      } else {
        return item;
      }
    });
    if (!updated) {
      newStore.push(data);
    }
    return {
      ...state,
      [store]: state[store] ? newStore : [],
      [`${store}Details`]: originalStore,
    };
  },
  delete(state, action) {
    const { store, id } = action.payload;
    const originalStore = { ...state[`${store}Details`] };
    Object.keys(originalStore).forEach((key) => {
      if (id === key) {
        delete originalStore[key];
      }
    });
    return {
      ...state,
      [store]: state[store].filter(item => item.id !== id),
      [`${store}Details`]: originalStore,
    };
  },
  updateModal(state) {
    return {
      ...state,
    };
  },
  saveCback(state, action) {
    const { cb, key } = action.payload;
    const { currentKey } = state;
    const current = { ...currentKey[key] || {} };
    current.cb = cb;
    return {
      ...state,
      currentKey: { ...currentKey, [key]: current },
    };
  },
};
