<template>
    <transition name="slide">
        <music-list :songslist="songsList" :title="title" :bgUrl="bgImg"></music-list>
    </transition>
</template>

<script>
import MusicList from '@/components/musicList'
import {getCdInfo} from '@/api/api'
export default {
    data(){
        return{
            songsList:[],
            bgImg:"",
            title:""
        }
    },
    components:{
        MusicList
    },
    created(){
        this.getCdInfoList()
    },
    methods:{
        getCdInfoList:function(){
            getCdInfo().then(res => {
                
                this.songsList = this.editSongs(res.data.cdlist[0].songlist)
                this.bgImg = res.data.cdlist[0].logo
                this.title = res.data.cdlist[0].dissname

                console.log(res.data.cdlist[0].songlist)
            })
        },
        //对歌曲列表进行处理，获取歌曲相关的东西
        editSongs(list){
            let nSongsList = [];
            for(var i=0;i<list.length;i++){
                let item = {
                    //歌曲ID
                    id:list[i].songid,
                    //mid
                    mid:list[i].songmid,
                    //歌曲名
                    name:list[i].songname,
                    //专辑名
                    album:list[i].albumname,
                    //歌曲时长
                    interval:list[i].interval,
                    //专辑封面
                    img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].albummid}.jpg?max_age=2592000`,
                    //歌曲链接
                    url:`http://dl.stream.qqmusic.qq.com/C400${list[i].songmid}/${list[i].songid}.m4a?guid=983915916&fromtag=66`,
                    //歌手
                    singer:list[i].singer
                }
                nSongsList.push(item)
            }
            return nSongsList
        }
    }
}
</script>

<style lang="less" scoped>
.slide-enter-active, .slide-leave-active{
    transition: all 0.3s;
}
.slide-enter, .slide-leave-to{
    transform: translate3d(100%, 0, 0);
}
</style>
