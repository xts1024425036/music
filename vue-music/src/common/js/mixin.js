import {mapGetters} from 'vuex'
export const listMixin = {
    computed: {
        ...mapGetters(["playList"])
    },
    mounted () {
        this.watchPlayList(this.playList)
    },
    activated () {
        this.watchPlayList(this.playList)
    },
    watch:{
        playList(val){
            this.watchPlayList(val)
        }
    },
    methods:{
        watchPlayList(){
            console.log("请添加watchPlayList事件")
        }
    }
}