export default {
  resetGridDefault(state) {
    const { startflow } = state;
    const grid = [...startflow.fields.grid];
    const gridDefault = [];
    grid.forEach((item) => { // 最外层key
      const fieldDefault = item.field_default_value;
      const obj = {
        key: item.key,
      };
      gridDefault.push({ ...obj, fieldDefault });
    });
    return {
      ...state,
      gridDefault,
    };
  },
  saveFlow(state, action) {
    const newFormData = {
      ...action.payload.form_data,
    };
    const gridDefault = [];
    const grid = [...action.payload.fields.grid];
    const availableGrid = grid.filter(item =>
      action.payload.step.available_fields.indexOf(item.key) !== -1);

    const gridformdata = availableGrid.map((item) => { // 最外层key
      const gridItem = newFormData[item.key];
      const fieldDefault = item.field_default_value;
      const obj = {
        key: item.key,
      };
      gridDefault.push({ ...obj, fieldDefault });
      // let fields = []
      const fields = gridItem.map((its) => { // 最外层key所对应的数组值，值是一个数组
        const keyArr = Object.keys(its); // 数组由对象构成
        const newArr = keyArr.map((it) => {
          const newObj = {};
          newObj.key = it;
          newObj.value = its[it];
          newObj.msg = '';
          return newObj;
        });
        return newArr;
      });
      obj.fields = [...fields];
      return obj;
    });
    return {
      ...state,
      startflow: action.payload,
      form_data: action.payload.form_data,
      gridformdata: [...gridformdata],
      gridDefault,
    };
  },
};

