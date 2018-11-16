<template>
  <div id="article">
    {{content}}
  </div>
</template>

<script>
import testData from '@/data/article.json'

let { date, author, subject, classs, keywords, content } = testData.article[0]

export default {
  data() {
    return {
      date,
      author,
      subject,
      classs,
      keywords,
      content
    }
  }
}
</script>
