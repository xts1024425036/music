<template>
    <scroll class="list-view" ref="listView" @scroll="scroll" :data="singers" :listenScroll=true :probeType=3>
        <ul>
          <li class="list-group" ref="listGroup" v-for="item in singers" :key="item.key">
              <h2 class="list-group-title">{{item.title}}</h2>
              <ul>
                <li class="list-group-item" v-for="x in item.items" :key="x.key" @click="singerDetail(x.id)">
                    <img alt="" class="avatar" :src="x.img">
                    <span class="name">{{x.name}}</span>
                </li>
              </ul>
          </li>
        </ul>
    
        <!--右侧快速定位列表-->
        <div class="list-shortcut" @touchstart="onTouchStart" @touchmove.stop.prevent="onTouchMove">
            <ul>
                <li class="item" v-for="(b,index) in touchList" :key="b.key" :data-index="index" :class="{'current': currentIndex == index}">{{b}}</li>
            </ul>
        </div>

        <div class="loading-container" v-show="isloading">
            <loading></loading>
        </div>
  </scroll>
</template>

<script>
import Scroll from '@/components/scroll'
import Loading from '@/components/loading'
import {listMixin} from '@/common/js/mixin.js'
export default {
  mixins:[listMixin],
  props:{
    singers:{
      type:Array,
      default:[]
    }
  },
  data(){
    return {
      currentIndex:0,
      isloading:true,
      //建立一个对象存储第一次点击的位置及index值
      touch:{},
      //scrollY
      scrollY:0,
      listHeight:[]
    }
  },
  computed: {
    touchList(){
      let arr = [];
      for(let a in this.singers){
        arr.push(this.singers[a].title.substring(0,1))
      }
      return arr
    }
  },
  updated () {
    this.isloading = false
    this.getLiHeight()
  },
  methods:{
    watchPlayList(playList){
        if(playList.length > 0){
            this.$refs.listView.refresh()
        }
    },
    onTouchStart(ev){
      console.log(ev)
      //获取当前点击的下标
      var cIndex = ev.target.attributes['data-index'].value
      //记录点击时的鼠标位置及index
      this.touch.y = ev.touches[0].pageY
      this.touch.index = cIndex
      //跳转到scroll
      this.scrollTo(cIndex)
    },
    onTouchMove(ev){
      //记录手指滑动时的位置
      this.touch.y2 = ev.touches[0].pageY
      //计算滑动的距离经过了几个li，向下取整  自行百度和Math.floor的区别
      let aIndex = (this.touch.y2 - this.touch.y) / 18 | 0
      let cIndex = parseInt(this.touch.index) + aIndex

      //跳转到scroll
      this.scrollTo(cIndex)
    },
    scroll(pos){
      this.scrollY = pos.y
    },
    //获取list所有li的单独的高度
    getLiHeight(){
      this.listHeight = []
      const list = this.$refs.listGroup
      let height = 0
      this.listHeight.push(height)
      for(var i=0;i<list.length;i++){
        height += list[i].clientHeight
        this.listHeight.push(height)
      }
    },
    scrollTo(index){
      this.scrollY = -this.listHeight[index]
      this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
    },
    singerDetail(id){
      this.$router.push({path:`/singer/${id}`})
    }
  },
  watch:{
    scrollY(v){
      //顶端
      if(v>0){
        this.currentIndex = 0
        return
      }
      //中间
      for(let i=0;i<this.listHeight.length;i++){
        let h1 = this.listHeight[i]
        let h2 = this.listHeight[i+1]
        //负数
        if(-v >= h1 && -v < h2){
          this.currentIndex = i
          return
        }
      }
      //底部
      this.currentIndex = this.listHeight - 1
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>

<style lang="less" scoped>
@import "~@/common/less/variable.less";
.list-view{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: @color-background;
    .list-group{
      padding-bottom: 30px;
      .list-group-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size:@font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
      .list-group-item{
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar{
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name{
          margin-left: 20px;
          color: @color-text-l;
          font-size: @font-size-medium;
        }
      }
    }
    .list-shortcut{
      position: absolute;
      z-index: 30;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: @color-background-d;
      font-family: Helvetica;
      .item{
        padding: 3px;
        line-height: 1;
        color: @color-text-l;
        font-size: @font-size-small;
        &.current{
          color: @color-theme;
        }
      }
    }
    .list-fixed{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: @font-size-small;
        color: @color-text-l;
        background: @color-highlight-background;
      }
    }
    .loading-container{
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
}
</style>

