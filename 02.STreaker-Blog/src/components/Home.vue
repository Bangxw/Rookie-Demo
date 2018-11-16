<template>
  <div id="container-wrap">
    <header>
      <div class="_container">
        <el-row :gutter="20">
          <el-col :xs="2" :md="2">
            <div class="page-header-logo"><img src="@/assets/img/logo.jpg" alt=""></div>
          </el-col>
          <el-col :xs="19" :md="19">
            <nav class="page-header-nav">
              <ul class="clearfix">
                <li class="active"><a href="javascript:void(0)">Furniture</a></li>
                <li><a href="javascript:void(0)">Lighting</a></li>
                <li><a href="javascript:void(0)">Accessories</a></li>
                <li><a href="javascript:void(0)">Backpack</a></li>
                <li><a href="javascript:void(0)">Clothing</a></li>
                <li><a href="javascript:void(0)">Contact Us</a></li>
                <li><a href="javascript:void(0)">About Us</a></li>
              </ul>
            </nav>
          </el-col>
          <el-col :xs="3" :md="3" class="header-operate-col">
            <div class="page-header-operate clearfix">
              <a href=""><span class="iconfont icon-search"></span></a>
              <a href=""><span class="iconfont icon-gouwudai"></span></a>
              <a href=""><span class="iconfont icon-user"></span></a>
            </div>
          </el-col>
        </el-row>
      </div>
    </header>

    <section>
      <nav class="section-nav-bar">
        <div class="_container clearfix">
          <div class="location-href-link left">
            <a href="">Home</a>
            <span class="iconfont icon-right"></span>
            <a href="">Blog</a>
          </div>
          <div class="location-href-link right">
            <span class="iconfont icon-cc-left"></span><a href="">Back to Home</a>
          </div>
        </div>
      </nav>
    </section>

    <section>
      <div class="_container">
        <el-row>
          <el-col :xs="6" :md="6">
            <div class="left-aside">
              &nbsp;
            </div>
          </el-col>
          <el-col :xs="18" :md="18">
            <div class="main-container">
              <div class="article-banner"></div>
              <div class="article-subject">
                <p>Unboxing New BulBul Men <br>
                  Watch by Xenom</p>
              </div>
              <div class="article-author-info">
                Posted in <i>Technology</i> - Jul 13, 2017 By <i>Admin</i>
              </div>
              <blog-post></blog-post>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>

    <footer>
      <div class="_container"></div>
    </footer>
  </div>
</template>

<script>
import article from '@/components/article/blog.0.1.vue'

export default {
  name: 'home-comp',
  components: { 'blog-post': article }
}
</script>

<style>
header ._container,
footer ._container,
section ._container {
  position: relative;
  max-width: 1171px;
  margin: 0 auto;
}

header {
  border-bottom: 1px solid #c7c7c7;
}

.page-header-logo {
  padding: 30px 0;
}

.page-header-nav {
  padding: 34px 0;
}

.page-header-nav li {
  float: left;
  width: 14.28%;
  height: 40px;
  line-height: 40px;
}

.page-header-nav li a {
  display: block;
  width: 100%;
  height: 100%;
  color: #7e7e7e;
  text-decoration: none;
  text-align: center;
  border: 1px solid transparent;
}

.page-header-nav li.active a,
.page-header-nav li:hover a {
  border: 1px solid #c7c7c7;
}

.page-header-operate {
  vertical-align: middle;
  padding-top: 46px;
}

.page-header-operate a {
  text-decoration: none;
}

.page-header-operate a:first-child {
  float: left;
}

.page-header-operate a:last-child {
  float: right;
}

.section-nav-bar ._container {
  padding-top: 15px;
}

.section-nav-bar {
  background: #fbfbfb;
  height: 50px;
}

.location-href-link {
  font-size: 14px;
  font-weight: bold;
}

.article-banner {
  height: 400px;
  background: #c7c7c7;
}

.article-subject {
  position: relative;
  width: 700px;
  margin: 0 auto;
  background: #fff;
  height: 100px;
  margin-top: -100px;
  font-size: 1.5em;
}

.article-subject p {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
}

.article-author-info{
  color: #cfcfcf;
  font-size: 12px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.article-author-info i{
  color: #7e7e7e;
  font-size: 13px;
}
</style>
