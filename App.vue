<template>
  <div class="wrap">
      <ellipsis
       :text="text"
       :line="4"
       :showUnfold="true"
       :showFold="true"
       unfoldText="展开"
       foldText="收起"
      ></ellipsis>
  </div>
</template>

<script>
import ellipsis from './src'
export default {
    name: 'App',
    components: {
      ellipsis
    },
    data () {
        return {
            text: "第四代魁拔迷麟扫六海，战事迅速蔓延到星移之海。夏季即将结束，冬眠将至。粼妖们必须做出一个决定：首先，她们完全可以集体进入冬眠，避开这次战争，魁拔的水军绝对不会找到连天神也无法发现的粼妖住地。然而一旦卷入战争，就意味着家园和冬眠的秘密都被发现的危险，而且单独面对魁拔，胜算极低。"
        }
    }
}
</script>
<style lang="less" scoped>
.wrap {
    line-height: 20px;
    font-size: 14px;
}
</style>