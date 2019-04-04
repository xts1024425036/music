<template>
    <div class="recommend" ref="recommend">
        <Scroll class="recommend-content" :data="songList" ref="scroll">
            <div>
                <div class="swiper-container banner">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="item in slider" :key="item.key"><img :src="item.picUrl" width="100%"></div>
                    </div>
                    <div class="swiper-pagination"></div>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li v-for="item in songList" class="item" :key="item.key" @click="detail(item.id)">
                        <div class="icon">
                            <img :src="item.picUrl" width="60" height="60" alt="">
                        </div>
                        <div class="text">
                            <h2 class="name" v-html="item.songListAuthor"></h2>
                            <p class="desc" v-html="item.songListDesc"></p>
                        </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="loading-container" v-show="isLoading">
                <loading></loading>
            </div>
        </Scroll>
        <router-view></router-view>
    </div>
</template>

<script>
import Scroll from '@/components/scroll'
import {getRecommend} from '@/api/api'
import Swiper from "swiper"
import 'swiper/dist/css/swiper.min.css'
import Loading from '@/components/loading'
import {listMixin} from '@/common/js/mixin.js'
export default {
    mixins:[listMixin],
    data(){
        return{
            slider:[],
            songList:[],
            isLoading:true
        }
    },
    components:{
        Scroll,
        Loading
    },
    created(){
        this.getRecommendList();
    },
    methods:{
        watchPlayList(playList){
            if(playList.length > 0){
                this.$refs.recommend.style.bottom = '60px'
                this.$refs.scroll.refresh()
            }
        },
        getRecommendList:function(){
            getRecommend().then(res => {
                console.log(res)
                this.slider = res.data.slider
                this.songList = res.data.songList
                this.isLoading = false
            })
        },
        detail(id){
            this.$router.push({path:`/recommend/${id}`})
        }
    },
    mounted() {
        var banner = new Swiper(".banner",{
            pagination: {
                el: '.swiper-pagination',
            },
            observer:true, 
            observeParents:true
        });
    },
}
</script>

<style lang="less" scoped>
@import '~@/common/less/variable.less';
.recommend{
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .recommend-content{
      height: 100%;
      overflow: hidden;
      .slider-wrapper{
        position: relative;
        width: 100%;
        overflow: hidden;
      }
      .recommend-list{
        .list-title{
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-theme;
        }
        .item{
          display: flex;
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;
          .icon{
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          .text{
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: @font-size-medium;
          }
            .name{
              margin-bottom: 10px;
              color: @color-text;
            }
            .desc{
              color: @color-text-d;
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
}
</style>
