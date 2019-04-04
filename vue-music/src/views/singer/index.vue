<template>
    <div class="singer" ref="singer">
        <singer-list :singers="singerList"></singer-list>
        <router-view></router-view>
    </div>
</template>

<script>
import {getSingerList} from '@/api/api'
import SingerList from '@/components/singerList'
import {listMixin} from '@/common/js/mixin.js'
export default {
    mixins:[listMixin],
    data(){
        return{
            singerList:[]
        }
    },
    created(){
        this.getSingerList()
    },
    methods:{
        watchPlayList(playList){
            if(playList.length > 0){
                this.$refs.singer.style.bottom = '60px'
            }
        },
        getSingerList(){
            getSingerList().then(res => {
                console.log(this.newSinger(res.data.list))
                this.singerList = this.newSinger(res.data.list)
            })
        },
        newSinger(list){
            let nList = {
                hot:{
                    title:"热门",
                    items:[]
                }
            }
            list.forEach((item,index) => {
                //取前十条数据作为热门
                if(index < 10){
                    nList.hot.items.push({
                        id:item.Fsinger_mid,
                        name:item.Fsinger_name,
                        img:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
                    })
                }
                //通过姓名首字母重定义数据
                let key = item.Findex
                //如果新的list中没A这个key就添加
                if(!nList[key]){
                    nList[key] = {
                        title:key,
                        items:[]
                    }
                }
                nList[key].items.push({
                    id:item.Fsinger_mid,
                    name:item.Fsinger_name,
                    img:`https://y.gtimg.cn/music/photo_new/T001R150x150M000${item.Fsinger_mid}.jpg?max_age=2592000`
                })
            });
            //把对象排序成有序数组
            let hot = []
            let other = []
            for(let m in nList){
                if(nList[m].title.match(/[a-zA-Z]/)){
                    other.push(nList[m])
                }else if(nList[m].title === "热门"){
                    hot.push(nList[m])
                }
            }
            other.sort((a,b)=>{
                return a.title.charCodeAt(0) - b.title.charCodeAt(0)
            })
            return hot.concat(other)
        }
    },
    components:{
        SingerList
    }
}
</script>

<style lang="less" scoped>
.singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
}
</style>
