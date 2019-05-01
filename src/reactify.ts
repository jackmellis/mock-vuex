import Vue from 'vue';

const reactify = <T>(obj: T) => {
  const reactive = new Vue({
    data: { data: obj },
  });

  return reactive.data;
};

export default reactify;
