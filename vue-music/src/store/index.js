import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        // 播放状态 Boolean
        playing: false,
        // 播放器全屏 Boolean
        fullScreen: false,
        // 当前歌曲播放列表 Array
        playList: [],
        // 当前播放歌曲索引
        currentIndex: -1,
        //播放模式（顺序0，随机1，单曲2）
        mode:0
    },
    getters:{
        playing:state => state.playing,
        fullScreen:state => state.fullScreen,
        playList:state => state.playList,
        currentIndex:state => state.currentIndex,
        mode:state => state.mode,
        currentSong:(state) => {
            return state.playList[state.currentIndex] || {}
        } ,
    },
    mutations:{
        changePlaying(state,playing){
            state.playing = playing
        },
        changeFullScreen(state,fullScreen){
            state.fullScreen = fullScreen
        },
        changePlayList(state,playList){
            state.playList = [...playList]
        },
        changeCurrentIndex(state,currentIndex){
            state.currentIndex = currentIndex
        },
        changeMode(state,mode){
            state.mode = mode
        }
    },
    actions:{
        //添加歌曲
        addPlayer({commit},{list,index}){
            commit("changePlaying",true)
            commit("changeFullScreen",true)
            commit("changePlayList",list)
            commit("changeCurrentIndex",index)
        },
        //删除歌曲
        delSong({commit,state},song){
            let index = 0;
            let playlist = state.playList;
            let currentIndex = state.currentIndex
            for(let i = 0; i < playlist.length;i++){
                if(playlist[i].id == song.id){
                    index = i
                }
            }
            playlist.splice(index,1)
            if(currentIndex == playlist.length){
                currentIndex--
            }
            commit("changePlaying",true)
            commit("changePlayList",playlist)
            commit("changeCurrentIndex",currentIndex)
        },
        //清空播放列表
        clear({commit}){
            commit("changePlaying",false)
            commit("changePlayList",[])
            commit("changeCurrentIndex",-1)
        }
    }
})