<template>
  <div>
    <transition name="slide-fade">
      <router-view></router-view>
    </transition>
    <loading v-model="isLoading">...</loading>
  </div>
</template>

<script>
import { Loading } from 'vux'
import { mapState } from 'vuex'
export default {
  // name: 'app',
  data(){
    return {
      transitionName:''
    }
  },
  components: {
    Loading
  },
  computed: {...mapState({
      isLoading: state => state.vux.isLoading
    })},
  watch: {
  '$route' (to, from) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
  },
  transitionName(){
    console.log(this.transitionName)
  }
}
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #f2f2f2;
  // >div:first-child{
  //   height: 100%;
  // }
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  opacity: 0;
  
}
</style>
