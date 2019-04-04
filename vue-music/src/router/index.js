import Vue from 'vue'  //引入vue
import Router from 'vue-router' //引入vue-router
import Recommend from '@/views/recommend/'
import Rank from '@/views/rank'
import Search from '@/views/search'
import Singer from '@/views/singer'
import RecommendDetail from '@/views/recommend/detail'
import SingerDetail from '@/views/singer/detail'
import RankDetail from '@/views/rank/detail'

//vue全局使用Router
Vue.use(Router)

//输出模块
export default new Router({
  //配置路由，数组
  mode:"hash",
  routes: [
    //每一个链接都是一个对象
    {
      //重定向
      path: '/',
      redirect:"/recommend"
    },
    {
      path:"/recommend",
      component:Recommend,
      children:[
        {
          path:"/recommend/:id",
          component: RecommendDetail,
        }
      ]
    },
    {
      path:"/rank",
      component:Rank,
      children:[
        {
          path:"/rank/:id",
          component: RankDetail,
        }
      ]
    },
    {
      path:"/search",
      component:Search
    },
    {
      path:"/singer",
      component:Singer,
      children:[
        {
          path:"/singer/:id",
          component: SingerDetail,
        }
      ]
    },
  ]
})
