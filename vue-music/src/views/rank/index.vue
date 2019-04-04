<template>
    <div class="rank" ref="rank">
        <scroll class="toplist" ref="topList">
        <ul>
            <li class="item" v-for="item in rankList" :key="item.key" @click="detail(item.id)">
              <div class="icon">
                  <img :src="item.picUrl" alt="" width="100" height="100">
              </div>
              <ul class="songlist">
                  <li class="song" v-for="(b,index) in item.songList" :key="b.key">
                    <span>{{index+1}}</span>
                    <span>{{b.singername}}.{{b.songname}}</span>
                  </li>
              </ul>
            </li>
        </ul>
        <div class="loading-container" v-show="isLoading">
            <loading></loading>
        </div>
        </scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import Scroll from '@/components/scroll'
import {getRankList} from '@/api/api'
import Loading from '@/components/loading'
import {listMixin} from '@/common/js/mixin.js'
export default {
  mixins:[listMixin],
  data(){
    return{
      rankList:[],
      isLoading:true
    }
  },
  components:{
    Scroll,
    Loading
  },
  created() {
    this.getRankList()
  },
  methods:{
    watchPlayList(playList){
        if(playList.length > 0){
            this.$refs.rank.style.bottom = '60px'
            this.$refs.topList.refresh()
        }
    },
    getRankList(){
      getRankList().then(res => {
        console.log(res)
        this.rankList = res.data.topList
        this.isLoading = false
      })
    },
    detail(id){
      this.$router.push({path:`/rank/${id}`})
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/common/less/variable.less";
.rank{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .toplist{
      height: 100%;
      overflow: hidden;
      .item{
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;
        &:last-child{
          padding-bottom: 20px;
        }
        .icon{
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }
        .songlist{
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: @color-highlight-background;
          color: @color-text-d;
          font-size: @font-size-small;
          .song{
            line-height: 26px;
            overflow: hidden;
            height: 26px;
          }
        }
      }
    }
      .loading-container{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
        height: 100%;
        background: #222;
      }
}
</style>

