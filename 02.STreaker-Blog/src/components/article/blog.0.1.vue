<template>
  <div id="article-content">
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

<style>
#article-content{
  text-align: justify;
  color: #818181;
  line-height: 24px;
  padding: 15px 30px;
}
</style>

