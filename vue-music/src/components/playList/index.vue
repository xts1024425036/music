<template>
  <transition name="list-fade">
    <div class="playlist" ref="playlist" v-show="isShow">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i class="icon"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="clearlist">
              <i class="icon-clear"></i>
            </span>
          </h1>
        </div>
        <scroll class="list-content" ref="listContent">
          <ul>
            <li class="item" ref="listItem" v-for="(a,index) in playList" :key="a.key" @click="changeSong(index)">
              <i class="current" :class="currentClass(a)"></i>
              <span class="text">{{a.name}}</span>
              <span class="like">
                <i></i>
              </span>
              <span class="delete" @click.stop="delone(a)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </scroll>
        <div class="list-close" @click="hide">
          <span>关闭</span>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import Scroll from '@/components/scroll'
  import {mapGetters,mapMutations,mapActions} from 'vuex'
  import { MessageBox } from 'mint-ui';
  export default{
      data(){
          return {
              
          }
      },
      props:{
          isShow:{
              type:Boolean,
              default:false
          }
      },
      updated() {
          this.$refs.listContent.refresh()
          let i;
            for(let j=0;j<this.playList.length;j++){
                if(this.playList[j].id == this.currentSong.id){
                    i = j
                }
            }
            this.$refs.listContent.scrollToElement(this.$refs.listItem[i], 300)
      },
      computed: {
          modeText(){
              return this.mode == 0 ? "顺序播放" : this.mode == 1 ? "随机播放" : "单曲循环"
          },
          ...mapGetters(["playList","currentSong","mode"])  
      },
      components:{
          Scroll
      },
      methods: {
          hide(){
              this.$emit('changeShow',false)
          },
          currentClass(item){
            return this.currentSong.id == item.id ? 'icon-play' : ""
          },
          changeSong(index){
              this.changeCurrentIndex(index)
          },
          delone(item){
              this.delSong(item)
          },
          clearlist(){
                MessageBox.confirm('确定清空播放列表?').then(() => {
                    this.clear()
                    this.$emit('changeShow',false)
                });
          },
          ...mapMutations(["changeCurrentIndex"]),
          ...mapActions(['delSong',"clear"])
      }
  }
</script>
<style scoped lang="less">
@import "~@/common/less/variable";
@import url("//unpkg.com/mint-ui/lib/style.css");
.playlist{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 200;
    background-color: @color-background-d;
    &.list-fade-enter-active, &.list-fade-leave-active{
      transition: opacity 0.3s;
      .list-wrapper{
        transition: all 0.3s;
      }
    }
    &.list-fade-enter, &.list-fade-leave-to{
      opacity: 0;
      .list-wrapper{
        transform: translate3d(0, 100%, 0);
      }
    }
    .list-wrapper{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        background-color: @color-highlight-background;
        .list-header{
            position: relative;
            padding: 20px 30px 10px 20px;
            .title{
            display: flex;
            align-items: center;
            .icon{
                margin-right: 10px;
                font-size: 30px;
                color: @color-theme-d;
            }
            .text{
                flex: 1;
                font-size: @font-size-medium;
                color: @color-text-l;
            }
            .clear{
                .icon-clear{
                font-size: @font-size-medium;
                color: @color-text-d;
                }
            }
            }
        }
        .list-content{
            max-height: 240px;
            overflow: hidden;
            .item{
            display: flex;
            align-items: center;
            height: 40px;
            padding: 0 30px 0 20px;
            overflow: hidden;
            &.list-enter-active, &.list-leave-active{
                transition: all 0.1s;
            }
            &.list-enter, &.list-leave-to{
                height: 0;
            }
            .current{
                flex: 0 0 20px;
                width: 20px;
                font-size: @font-size-small;
                color: @color-theme-d;
            }
            .text{
                flex: 1;
                font-size: @font-size-medium;
                color: @color-text-d;
            }
            .like{
                extend-click
                margin-right: 15px;
                font-size: @font-size-small;
                color: @color-theme;
                .icon-favorite{
                color: @color-sub-theme;
                }
            }
            .delete{
                font-size: @font-size-small;
                color: @color-theme;
            }
            }
        }
        .list-operate{
            width: 140px;
            margin: 20px auto 30px auto;
            .add{
            display: flex;
            align-items: center;
            padding: 8px 16px;
            border: 1px solid @color-text-l;
            border-radius: 100px;
            color: @color-text-l;
            .icon-add{
                margin-right: 5px;
                font-size: @font-size-small-s;
            }
            .text{
                font-size: @font-size-small;
            }
            }
        }
        .list-close{
            text-align: center;
            line-height: 50px;
            background: @color-background;
            font-size: @font-size-medium-x;
            color: @color-text-l;
        }
    }
}
</style>