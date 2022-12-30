<template>
  <section>
    <div id="container">
      <p style="text-align: center;"><span style="font-size: 22px;font-weight: bold;">匆匆</span></p>
      <p style="text-align: center;"><span style="font-weight: bold;">朱自清</span></p>
      <p>
        燕子去了，有再来的时候杨柳枯了，有再青的时候桃花谢了，有再开的时候。但是聪明的你告诉我，我们的日子为什么一去不复返呢？是有人偷了他 们罢：那是谁？又藏在何处呢？是他们自己逃走了罢如今又到了哪里呢？
      </p>
      <p>
        我不知道他们给了我多少日子，但我的手<span style="font-size: 20px; color: #F56C6C;">确乎</span>是渐渐<span style="font-size: 20px; color: #F56C6C;">空虚</span>了。在默默里算着，八千多日子已经从我手中溜去，像针尖上一滴水滴在大海里，我的日子滴在时间的流里，没有声音，也没有影子。我不禁头<span style="font-size: 20px; color: #F56C6C;">涔涔</span>而泪<span style="font-size: 20px; color: #F56C6C;">潸潸</span>了。去的尽管去了，来的尽管来着，去来的中间，又怎样地匆匆呢？
      </p>
      <p>
        早上我起来的时候，小屋里射进两三方斜斜的太阳。太阳他有脚啊，轻轻悄悄地挪移了，我也茫茫然跟着旋转。于是洗手的时候，日子从水盆里过去，吃饭的时候，日子从饭碗里过去，默默时，便从凝然的双眼前过去。我觉察他去的匆匆了，伸出手遮挽时，他又从遮挽着的手边过去。
      </p>
      <p>
        天黑时，我躺在床上，他便<span style="font-size: 20px; color: #F56C6C;">伶伶俐俐</span>地从我身上跨过，从我脚边飞去了。等我睁开眼和太阳再见，这算又溜走了一日。我掩着面叹息。但是新来的日子的影儿又开始在叹息里闪过了。在逃去如飞的日子里，在千门万户的世界里的我能做些什么呢？
      </p>
      <p>
        只有<span style="font-size: 20px; color: #F56C6C;">徘徊罢了</span>，只有匆匆罢了，在八千多日的匆匆里，除徘徊外，又剩些什么呢？过去的日子如轻烟，被微风吹散了，如薄雾，被初阳蒸融了。我留着些什么痕迹呢？我何曾留着像<span style="font-size: 20px; color: #F56C6C;">游丝</span>样的痕迹呢？
      </p>
      <p>
        我赤裸裸来到这世界，转眼间也将赤裸裸的回去罢？但不能平的，为什么偏要白白走这一遭啊？你聪明的，告诉我，我们的日子为什么一去不复返呢？
      </p>
    </div>
    <el-button class="comment-btn" type="primary" :style="style" @click="comment">评论</el-button>
    <el-popover
      placement="top"
      title="评论"
      :width="200"
      :content="contentText"
      :visible="visible"
    >
      <template #reference>
        <div class="comment-content" :style="contentStyle"></div>
      </template>
    </el-popover>
  </section>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import CanvasHighlighter, { IRange } from './canvas-highlighter'

const list = ref<any[]>([])
const range = ref<IRange | null>(null)
const highlighter = ref<CanvasHighlighter | null>(null)
const style = ref({
  top: '0px',
  left: '0px',
  display: 'none'
})

function comment() {
  if (range.value) {
    ElMessageBox.prompt('请输入评论内容', '评论').then(({ value }) => {
      if (range.value) {
        list.value.push({
          id: range.value.id,
          range: range.value,
          text: value
        })
        highlighter.value!.addRange(range.value)
      }
    }).catch((err) => { throw(err) })
  }
  style.value.display = 'none'
}

const contentStyle = ref({
  top: '0px',
  left: '0px',
  display: 'inline-block'
})
const visible = ref(false)
const contentText = ref('')

onMounted(() => {
  const container = document.getElementById('container')
  if (container) {
    highlighter.value = new CanvasHighlighter(container)
    container.addEventListener('mouseup', () => {
      range.value = highlighter.value!.getSelectionRange()
      if (range.value) {
        const position = highlighter.value!.getSelectionPosition()
        if (position) {
          style.value = {
            top: (position.end.y - 35) + 'px',
            left: (position.end.x + 4) + 'px',
            display: 'inline-block'
          }
        }
      }
    })
  }

  document.addEventListener('click', (event) => {
    const data = highlighter.value!.geRangeIdByPointer(event.clientX, event.clientY)
    visible.value = false
    if (data) {
      contentText.value = list.value.find(i => i.id === data.id).text
      contentStyle.value = {
        top: data.position.y + data.position.height + 30 + 'px',
        left: data.position.x + data.position.width + 40 + 'px',
        display: 'inline-block'
      }
      visible.value = true
    }
  })
})

</script>

<style lang="scss">
body {
  padding: 20px;
}
#container {
  padding: 16px;
  border: 1px solid #999;
  border-radius: 4px;
  line-height: 2.4;
}
.comment-btn {
  position: absolute;
}
.comment-content {
  position: absolute;
  display: inline-block;
  width: 1px;
  height: 1px;
}
</style>
