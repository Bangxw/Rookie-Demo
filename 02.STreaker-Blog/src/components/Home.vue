<template>
  <div id="container-wrap">
    <header>
      <div class="_container">
        <div class="page-header-logo"></div>
        <nav class="page-header-nav"></nav>
        <div class="page-header-operate"></div>
      </div>
    </header>

    <footer>
      <div class="_container">23</div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'container-wrap'
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}

header ._container,
footer ._container{
  position: relative;
  max-width: 1171px;
  margin: 0 auto;
}

header .container{
  background: #c7c7c7;
}

footer .container{
  background: #fbfbfb;
}
</style>
