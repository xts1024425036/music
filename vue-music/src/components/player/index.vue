<template>
    <div class="player" v-show="playList.length > 0">
        <!--播放页面全屏-->
        <transition name="normal">
            <div class="normal-player" v-show="fullScreen">
                <!--背景 模糊-->
                <div class="background">
                    <img alt="" width="100%" height="100%" :src="currentSong.img">
                </div>
                <!--顶部-->
                <div class="top">
                    <div class="back" @click="changeFull">
                        <i class="icon-back"></i>
                    </div>
                    <h1 class="title">{{currentSong.name}}</h1>
                    <h2 class="subtitle"><span v-for="a in currentSong.singer" :key="a.key">{{a.name}} </span></h2>
                </div>
                <!--中间cd部分-->
                <div class="middle swiper-container">
                    <div class="swiper-wrapper">
                        <div class="middle-l swiper-slide" ref="middleL">
                            <div class="cd-wrapper" ref="cdWrapper">
                                <div class="cd" :class="cdState">
                                    <img alt="" class="image" :src="currentSong.img">
                                </div>
                            </div>
                            <!-- 一条歌词滚动 -->
                            <div class="playing-lyric-wrapper">
                                <div class="playing-lyric">{{playingLyc}}</div>
                            </div>
                        </div>
                        <!-- 歌词滚动 -->
                        <scroll class="middle-r swiper-slide" ref="lyriclist">
                            <div class="lyric-wrapper">
                            <div>
                                <p ref="lyricLine" 
                                class="text" 
                                v-for="(line,index) in lyric.lines" 
                                :key="line.key"
                                :class="{'current': currentLineNum === index}"
                                >
                                {{line.txt}}
                                </p>
                            </div>
                            </div>
                        </scroll>
                    </div>
                </div>
                <div class="bottom">
                    <div class="dot-wrapper">
                        <span class="dot"></span>
                    </div>
                    <div class="progress-wrapper">
                        <span class="time time-l">{{formatTime}}</span>
                        <!--播放进度条-->
                        <div class="progress-bar-wrapper">
                            <progressBar :percent="percent" @percentChange="percentBarChange"></progressBar>
                        </div>
                        <span class="time time-r">{{songTime}}</span>
                    </div>
                    <div class="operators">
                        <div class="icon i-left">
                            <i :class="modeStyle" @click="onChangeMode"></i>
                        </div>
                        <div class="icon i-left">
                            <i class="icon-prev" @click="prev"></i>
                        </div>
                        <div class="icon i-center">
                            <i :class="btnState" @click="changeState"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon-next" @click="next"></i>
                        </div>
                        <div class="icon i-right">
                            <i class="icon-not-favorite">
                            </i>
                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="mini">
            <div class="mini-player" v-show="!fullScreen" @click="changeFull">
                <div class="icon">
                    <img alt="" :src="currentSong.img" width="40" height="40" :class="cdState">
                </div>
                <div class="text">
                    <h2 class="name">{{currentSong.name}}</h2>
                    <p class="desc"><span v-for="a in currentSong.singer" :key="a.key">{{a.name}} </span></p>
                </div>
                <div class="control">
                    <i @click.stop="changeState" :class="miniState"></i>
                </div>
                <div class="control">
                    <i class="icon-playlist" @click.stop="showPlayList"></i>
                </div>
            </div>
        </transition>

        <!-- h5音乐播放器 -->
        <audio :src="currentSong.url" ref="audio" @canplay="readyState" @error="readyState" @timeupdate="updateTime" @ended="ended"></audio>

        <playList v-show="isplayList" :isShow="isplayList" @changeShow="changeshow"></playList>
    </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import Scroll from '@/components/scroll'
import progressBar from '@/components/progressBar'
import {getLyric} from '@/api/api'
import {Base64} from 'js-base64';
import Lyric from 'lyric-parser'
import 'swiper/dist/css/swiper.min.css'
import Swiper from "swiper"
import playList from '@/components/playList'
export default {
    data(){
        return {
            isReady:false,
            currentTime:0,
            playingLyc:'',
            lyric:{},
            currentLineNum:0,
            isplayList:false
        }
    },
    mounted() {
        var banner = new Swiper(".middle",{
            pagination: {
                el: '.dot-wrapper',
                bulletClass : 'dot',
                bulletActiveClass:"active"
            },
            observer:true, 
            observeParents:true
        });
    },
    computed: {
        //根据播放状态来判断CD是否旋转
        cdState(){
            return this.playing ? 'play' : 'pause'
        },
        //根据播放状态来判断播放和暂停按钮样式
        btnState(){
            return this.playing ? 'icon-pause' : 'icon-play'
        },
        miniState(){
            return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
        },
        //播放时间格式转换
        formatTime(){
            let m = this.currentTime / 60 | 0
            let s = this.currentTime % 60 | 0
            if(s.toString().length < 2){
                s = "0" + s
            }
            return `${m}:${s}`
        },
        //歌曲时间格式转换
        songTime(){
            let m = this.currentSong.interval / 60 | 0
            let s = this.currentSong.interval % 60 | 0
            if(s.toString().length < 2){
                s = "0" + s
            }
            return `${m}:${s}`
        },
        //计算已播放歌曲时间和总时长的百分比
        percent(){
            return this.currentTime / this.currentSong.interval
        },
        //根据vuex模式值切换样式
        modeStyle(){
            switch(this.mode){
                case 0:
                    return 'icon-sequence'
                    break;
                case 1:
                    return 'icon-random'
                    break;
                case 2:
                    return 'icon-loop'
                    break;
            }
        },
        ...mapGetters(
            ['playing','fullScreen','playList','currentSong','currentIndex','mode']
        )
    },
    methods:{
        //改变全屏状态
        changeFull(){
            this.changeFullScreen(!this.fullScreen)
        },
        //改变音乐播放暂停状态
        changeState(){
            this.changePlaying(!this.playing)
            // 歌词随着歌曲播放暂停而滚动或暂停滚动
            if (this.currentLyric) {
                this.currentLyric.togglePlay()
            }
        },
        //上一首
        prev(){
            //播放器准备完毕时才能点击
            if(!this.isReady){
                return
            }
            let index = this.currentIndex - 1
            if(index == -1){
                index = this.playList.length - 1
            }
            this.changeCurrentIndex(index)
            this.isReady = false
            if(!this.playing){
                this.changeState()
            }
        },
        //下一首
        next(){
            //播放器准备完毕时才能点击
            if(!this.isReady){
                return
            }
            let index = this.currentIndex + 1
            if(index == this.playList.length){
                index = 0
            }
            this.changeCurrentIndex(index)
            this.isReady = false
            if(!this.playing){
                this.changeState()
            }
        },
        //歌曲加载改变播放器加载状态值
        readyState(){
            this.isReady = true
        },
        //获取当前播放时间
        updateTime(ev){
            this.currentTime = ev.target.currentTime
        },
        //获取从子组件传过来百分比
        percentBarChange(val){
            let currentTime = this.currentSong.interval * val
            this.$refs.audio.currentTime = currentTime
        },
        //改变mode值
        onChangeMode(){
            let mode = (this.mode + 1) % 3
            this.changeMode(mode)
        },
        //播放结束时
        ended(){
            if(this.mode == 0 ){
                this.next()
            }else if(this.mode == 2){
                this.loop()
            }if(this.mode == 1){
                this.next()
            }
        },
        //单曲循环方法
        loop(){
            this.$refs.audio.currentTime = 0
            this.$refs.audio.play()
            // 循环播放 歌词回到开始的时候
            if (this.currentLyric) {
                this.currentLyric.seek(0)
            }
        },
        //获取歌词
        getLyrics(){
            this.lyric = {}
            getLyric(this.currentSong.id).then(res => {
                console.log(new Lyric(Base64.decode(res.lyric)))
                //let lyric = new Lyric(Base64.decode(res.lyric))
                this.lyric = new Lyric(Base64.decode(res.lyric),this.handler)
                if (this.playing) {
                    this.lyric.play()
                }
            })
        },
        handler({lineNum, txt}){
            this.currentLineNum = lineNum
            if (lineNum > 5) {
                let lineEl = this.$refs.lyricLine[lineNum - 5]
                this.$refs.lyriclist.scrollToElement(lineEl, 1000)
            } else {
                this.$refs.lyriclist.scrollTo(0, 0, 1000)
            }
            this.playingLyc = txt
        },
        showPlayList(){
            this.isplayList = true
        },
        changeshow(){
            this.isplayList = false
        },
        ...mapMutations([
            'changeFullScreen',
            'changePlaying',
            'changeCurrentIndex',
            'changeMode'
        ])
    },
    watch:{
        //监听当前播放歌曲
        currentSong(newVal,oldVal){
            if(!newVal){
                return
            }
            if(newVal == oldVal){
                return
            }
            this.$nextTick(() => {
                this.getLyrics()
                this.$refs.audio.play()
            })
        },
        //监听playing状态，控制播放器的播放
        playing(val){
            this.$nextTick(() => {
                val ? this.$refs.audio.play() : this.$refs.audio.pause()
            })
        }
    },
    components:{
        progressBar,
        Scroll,
        playList
    }
}
</script>

<style lang="less">
@import '~@/common/less/variable.less';
.player{
    .normal-player{
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: @color-background;
      .background{
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
      }
      .top{
        position: relative;
        margin-bottom: 25px;
        .back{
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
          .icon-back{
            display: block;
            padding: 9px;
            font-size: @font-size-large-x;;
            color: @color-theme;
            transform: rotate(-90deg);
          }
        }
        .title{
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          font-size: @font-size-large;
          color: @color-text;
        }
        .subtitle{
          line-height: 20px;
          text-align: center;
          font-size: @font-size-medium;
          color: @color-text;
        }
      }
      .middle{
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l{
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper{
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            height: 100%;
            .cd{
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border: 10px solid rgba(255, 255, 255, 0.1);
              border-radius: 50%;
              &.play{
                animation: rotate 20s linear infinite;
              }
              &.pause{
                animation-play-state: paused;
              }
              .image{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border-radius: 50%;
              }
            }
          }
          .playing-lyric-wrapper{
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric{
              height: 20px;
              line-height: 20px;
              font-size:@font-size-medium;
              color: @color-text-l;
            }
          }
        }
        .middle-r{
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper{
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text{
              line-height: 32px;
              color: @color-text-l;
              font-size: @font-size-medium;
              &.current{
                color: @color-text;
              }
            }
          }
        }
      }
      .bottom{
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper{
          text-align: center;
          font-size: 0;
          .dot{
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: @color-text-l;
            &.active{
              width: 20px;
              border-radius: 5px;
              background: @color-text-ll;
            }
          }
        }
        .progress-wrapper{
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time{
            color: @color-text;
            font-size: @font-size-small;
            flex: 0 0 30px;
            line-height: 30px;
            width: 30px;
            &.time-l{
              text-align: left;
            }
            &.time-r{
              text-align: right;
            }
          }
          .progress-bar-wrapper{
            flex: 1;
          }
        }
        .operators{
          display: flex;
          align-items: center;
          .icon{
            flex: 1;
            color: @color-theme;
            &.disable{
              color: @color-theme-d;
            }
            i{
              font-size: 30px;
            }
          }
          .i-left{
            text-align: right;
          }
          .i-center{
            padding: 0 20px;
            text-align: center;
            i{
              font-size: 40px;
            }
          }
          .i-right{
            text-align: left;
          }
          .icon-favorite{
            color: @color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active{
        transition: all 0.4s;
        .top, .bottom{
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
        }
      }
      &.normal-enter, &.normal-leave-to{
        opacity: 0;
        .top{
          transform: translate3d(0, -100px, 0);
        }
        .bottom{
          transform: translate3d(0, 100px, 0);
        }
      }
    }
    .mini-player{
      display: flex;
      align-items: center;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 180;
      width: 100%;
      height: 60px;
      background: @color-highlight-background;
      &.mini-enter-active, &.mini-leave-active{
        transition: all 0.4s;
      }
      &.mini-enter, &.mini-leave-to{
        opacity: 0;
      }
      .icon{
        flex: 0 0 40px;
        width: 40px;
        padding: 0 10px 0 20px;
        img{
          border-radius: 50%;
          &.play{
            animation: rotate 10s linear infinite;
          }
          &.pause{
            animation-play-state: paused;
          }
        }
      }
      .text{
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        .name{
          margin-bottom: 2px;
          font-size: @font-size-medium;
          color: @color-text;
        }
        .desc{
          font-size: @font-size-small;
          color: @color-text-d;
        }
      }
      .control{
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-play-mini, .icon-pause-mini, .icon-playlist{
          font-size: 30px;
          color: @color-theme-d;
        }
        .icon-mini{
          font-size: 32px;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
}
  @keyframes rotate{
    0%{
      transform: rotate(0);
    }
    100%{
      transform: rotate(360deg);
    }
  }
</style>

