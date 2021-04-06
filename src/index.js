import Ellipsis from './components/Ellipsis.vue'
import './components/index.less'
Ellipsis.install = function (Vue) {
    Vue.component(Ellipsis.name, Ellipsis);
};
export default Ellipsis