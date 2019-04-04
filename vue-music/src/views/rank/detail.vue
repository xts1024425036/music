<template>
    <transition name="slide">
        <music-list :songslist="songsList" :title="title" :bgUrl="bgUrl"></music-list>
    </transition>
</template>

<script>
import MusicList from '@/components/musicList'
import {getRankInfo} from '@/api/api'
export default {
    data(){
        return{
            songsList:[],
            bgUrl:"",
            title:""
        }
    },
    components:{
        MusicList
    },
    created(){
        this.getRankInfo()
    },
    methods:{
        getRankInfo:function(){
            let rankId = this.$route.params.id
            getRankInfo(rankId).then(res => {
                this.songsList = this.editSongs(res.songlist)
                this.bgUrl = res.topinfo.pic_album
                this.title = res.topinfo.ListName
                console.log(res.songlist)
            })
        },
        //对歌曲列表进行处理，获取歌曲相关的东西
        editSongs(list){
            let nSongsList = [];
            for(var i=0;i<list.length;i++){
                let item = {
                    //歌曲ID
                    id:list[i].data.songid,
                    //mid
                    mid:list[i].data.songmid,
                    //歌曲名
                    name:list[i].data.songname,
                    //专辑名
                    album:list[i].data.albumname,
                    //歌曲时长
                    interval:list[i].data.interval,
                    //专辑封面
                    img:`https://y.gtimg.cn/music/photo_new/T002R300x300M000${list[i].data.albummid}.jpg?max_age=2592000`,
                    //歌曲链接
                    url:`http://dl.stream.qqmusic.qq.com/C400${list[i].data.songmid}/${list[i].data.songid}.m4a?guid=983915916&fromtag=66`,
                    //歌手
                    singer:list[i].data.singer
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
