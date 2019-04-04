<template>
  <div id="app">
    <music-header></music-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MusicHeader from '@/components/musicHeader'
import Tab from '@/components/tabs'
import Player from '@/components/player'
export default {
  name: 'App',
  components: {
    MusicHeader,
    Tab,
    Player
  }
}
</script>

<style lang="less">
@import '~@/common/less/index.less';
</style>
