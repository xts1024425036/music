<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="touchStart" @touchmove.prevent="touchMove" @touchend="touchEnd">
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        percent:{
            type:Number,
            default:0
        }
    },
    data(){
        return{
            touch:{}
        }
    },
    watch:{
        percent(val){
            if(val >=0 && !this.touch.initiated){
                let w = this.$refs.progressBar.clientWidth - 16
                let offset = val * w
                this._offset(offset)
            }
        }
    },
    methods:{
        //设置已完成进度条宽度及按钮位置
        _offset(offset){
            this.$refs.progress.style.width = `${offset}px`
            this.$refs.progressBtn.style.transform = `translate3d(${offset}px,0,0)` 
        },
        //单击进度获取当前位置
        progressClick(ev){
            console.log(this.$refs.progressBar.offsetLeft)
            let w = ev.pageX - this.$refs.progressBar.offsetLeft
            this._offset(w)
            this._sendPercent()
        },
        _sendPercent(){
            //重新计算百分比并回传给父组件
            let barw = this.$refs.progressBar.clientWidth - 16
            let newPercent = this.$refs.progress.clientWidth / barw

            this.$emit("percentChange",newPercent)
        },
        //进度条拖动效果
        touchStart(ev){
            this.touch.initiated = true
            //记录手指初始位置
            this.touch.x1 = ev.touches[0].pageX
            //progress的当前宽度
            this.touch.w = this.$refs.progress.clientWidth
        },
        touchMove(ev){
            if(!this.touch.initiated){
                return
            }
            this.touch.x2 = ev.touches[0].pageX
            let offset = Math.min(Math.max(0,this.touch.x2 - this.touch.x1 + this.touch.w),this.$refs.progressBar.clientWidth - 16)
            this._offset(offset)
        },
        touchEnd(){
            this.touch.initiated = false
            this._sendPercent()
        }

    }
}
</script>

<style lang="less" scoped>
@import "~@/common/less/variable";

.progress-bar{
    height: 30px;
    .bar-inner{
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress{
        position: absolute;
        height: 100%;
        background: @color-theme;
      }
      .progress-btn-wrapper{
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn{
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid @color-text;
          border-radius: 50%;
          background:@color-theme;
        }
      }
    }
}
</style>

