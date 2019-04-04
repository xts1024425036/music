<template>
    <div class="music-list" ref="musiclist">
        <!--返回上一层-->
        <div class="back" @click="back">
            <i class="icon-back"></i>
        </div>
        <!--歌曲信息-->
        <h1 class="title">{{title}}</h1>
        <div class="bg-image" ref="bgImage" :style="bgImg">
            <div class="play-wrapper">
                <div ref="playBtn" class="play">
                <i class="icon-play"></i>
                <span class="text" @click="addplay">随机播放全部</span>
                </div>
            </div>
        </div>
        <!--滑动辅助层-->
        <div class="bg-layer" ref="layer"></div>
        <!--歌曲列表-->
        <scroll ref="scroll" :data="songslist" class="list" @scroll="scroll" :probe-type=3 :listen-scroll=true >
            <div class="song-list-wrapper">
                <div class="song-list">
                    <ul>
                        <li class="item" v-for="(item,index) in songslist" :key="item.key" @click="addplayer(index)">
                            <div class="rank">
                                <span class="text">{{index+1}}</span>
                            </div>
                            <div class="content">
                                <h2 class="name">{{item.name}}</h2>
                                <!-- <h2 class="name" v-else-if="item.musicData">{{item.musicData.songname}}</h2>
                                <h2 class="name" v-else>{{item.data.songname}}</h2> -->
                                <p class="desc"><span v-for="a in item.singer" :key="a.key">{{a.name}} . </span>{{item.album}}</p>
                                <!-- <p class="desc" v-else-if="item.musicData"><span v-for="a in item.musicData.singer" :key="a.key">{{a.name}} . </span>{{item.musicData.albumname}}</p>
                                <p class="desc" v-else><span v-for="a in item.data.singer" :key="a.key">{{a.name}} . </span>{{item.data.albumname}}</p> -->
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </scroll>
        <!--加载loading-->
        <div v-show="isloading" class="loading-container">
            <loading></loading>
        </div>
    </div>
</template>

<script>
import Scroll from '@/components/scroll'
import Loading from '@/components/loading'
import {mapActions,mapMutations} from 'vuex'
import {listMixin} from '@/common/js/mixin.js'
export default {
    mixins:[listMixin],
    props:{
        songslist:{
            type:Array,
            default:[]
        },
        bgUrl:{
            type:String,
            default:""
        },
        title:{
            type:String,
            default:""
        }
    },
    data(){
        return {
            isloading:true,
            scrollH:0,
        }
    },
    updated () {
        this.isloading = false
    },
    mounted () {
        this.bgHeight = this.$refs.bgImage.clientHeight
        this.ty = -this.bgHeight + 44
        this.$refs.scroll.$el.style.top = `${this.bgHeight}px`
    },
    methods:{
        watchPlayList(playList){
            if(playList.length > 0){
                this.$refs.musiclist.style.bottom = '60px'
                this.$refs.scroll.$el.style.bottom = '60px'
                this.$refs.scroll.refresh()
            }
        },
        scroll(pos){
            this.scrollH = pos.y
            console.log(pos.y)
        },
        back(){
            this.$router.back()
        },
        addplayer(index){
            this.addPlayer({
                list:this.songslist,
                index:index
            })
        },
        addplay(){
            let i = Math.floor(Math.random() * this.songslist.length)
            this.addPlayer({
                list:this.songslist,
                index:i
            })
            this.changeMode(1)
        },
        ...mapActions(["addPlayer"]),
        ...mapMutations(["changeMode"])
    },
    computed: {
        bgImg(){
            return `background-image:url(${this.bgUrl})`
        }
    },
    components:{
        Scroll,
        Loading
    },
    watch:{
        scrollH(v){
            let translateY = Math.max(this.ty, v)
            let scale = 1
            let zIndex = 0
            const percent = Math.abs(v / this.bgHeight)
            if (v > 0) {
                scale = 1 + percent
                zIndex = 10
            }
            this.$refs.layer.style['transform'] = `translate3d(0,${translateY}px,0)`
            if(v<this.ty){
                zIndex = 10
                this.$refs.bgImage.style.paddingTop = 0
                this.$refs.bgImage.style.height = `44px`
                this.$refs.playBtn.style.display = 'none'
            }else{
                this.$refs.bgImage.style.paddingTop = '70%'
                this.$refs.bgImage.style.height = 0
                this.$refs.playBtn.style.display = ''
            }
            this.$refs.bgImage.style['transform'] = `scale(${scale})`
            this.$refs.bgImage.style.zIndex = zIndex
        }
    }
}
</script>

<style lang="less" scoped>
@import '~@/common/less/variable.less';
.music-list{
    position: fixed;
    z-index: 100;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: @color-background;
    .back{
        position:absolute;
        top:0;
        left: 6px;
        z-index: 50;
        .icon-back{
            display: block;
            padding: 10px;
            font-size: @font-size-large-x;
            color: @color-theme;
        }
    }
    .title{
        position: absolute;
        top: 0;
        left: 10%;
        z-index: 40;
        width: 80%;
        text-align: center;
        line-height: 40px;
        font-size: @font-size-large;
        color: @color-text;
    }
    .bg-image{
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 70%;
        transform-origin: top;
        background-size: cover;
        .play-wrapper{
            position: absolute;
            bottom: 20px;
            z-index: 50;
            width: 100%;
            .play{
                box-sizing: border-box;
                width: 135px;
                padding: 7px 0;
                margin: 0 auto;
                text-align: center;
                border: 1px solid @color-theme;
                color: @color-theme;
                border-radius: 100px;
                font-size: 0;
                .icon-play{
                    display: inline-block;
                    vertical-align: middle;
                    margin-right: 6px;
                    font-size: @font-size-medium-x;
                }
                .text{
                    display: inline-block;
                    vertical-align: middle;
                    font-size: @font-size-small;
                }
            }
            .filter{
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(7, 17, 27, 0.4);
            }
        }
    }
    .bg-layer{
        position: relative;
        height: 100%;
        background: @color-background;
    }
    .list{
        position: fixed;
        top: 0;
        bottom: 0;
        width: 100%;
        background: @color-background;
        transition: all 0.5s;
        .song-list-wrapper{
            padding: 10px 20px;
        }
    }
    .loading-container{
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
        height: 100%;
        z-index: 99;
        background: #222;
    }
    .song-list{
        .item{
            display: flex;
            align-items: center;
            box-sizing: border-box;
            height: 64px;
            font-size: @font-size-medium;
            .rank{
                flex: 0 0 25px;
                width: 25px;
                margin-right: 20px;
                text-align: center;
                .text{
                    color: @color-theme;
                    font-size: @font-size-large;
                }
            }
            .content{
                flex: 1;
                line-height: 20px;
                overflow: hidden;
                .name{
                    color: @color-text;
                }
                .desc{
                    margin-top: 4px;
                    color: @color-text-d;
                }
            }
        }
    }
}
</style>

