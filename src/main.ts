import { createApp } from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
// 1. 引入你需要的组件
// import  Vant from 'vant';
// 2. 引入组件样式
import 'vant/lib/index.css';
import { 
  Button,
  NavBar,
  Search,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  Card,
  Icon,
  Form,
  Field,
  CellGroup,
  Cell,
  Image,
  Empty,
  Tabbar,
  TabbarItem,
  Uploader,
  Picker,
  Popup,
  Rate,
  Toast,
  Dialog,
  Tabs,
  Tab,
  List,
  Tag,
  Divider,
  PullRefresh,
  DropdownMenu,
  DropdownItem,
  DatePicker,
} from 'vant'

const app = createApp(App)

// 注册 Vant 组件
const vantComponents = [
  Button,
  NavBar,
  Search,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  Card,
  Icon,
  Form,
  Field,
  CellGroup,
  Cell,
  Image,
  Empty,
  Tabbar,
  TabbarItem,
  Uploader,
  Picker,
  Popup,
  Rate,
  Toast,
  Dialog,
  Tabs,
  Tab,
  List,
  Tag,
  Divider,
  PullRefresh,
  DropdownMenu,
  DropdownItem,
  DatePicker,
]

vantComponents.forEach(component => {
  app.use(component)
})

app.use(store).use(router).mount('#app')


