<template>
  <div id="container-wrap">
    <layout-header></layout-header>

    <section>
      <nav class="section-nav-bar">
        <div class="_container clearfix">
          <div class="location-href-link left">
            <a href>Home</a>
            <span class="iconfont icon-right"></span>
            <a href>Blog</a>
          </div>
          <div class="location-href-link right">
            <span class="iconfont icon-cc-left"></span>
            <a href>Back to Home</a>
          </div>
        </div>
      </nav>
    </section>

    <section>
      <div class="_container">
        <el-row>
          <el-col :xs="6" :md="6">
            <div class="left-aside">
              <div id="txt-search-box">
                <el-input
                  placeholder="Search Something"
                  prefix-icon="el-icon-search"
                  v-model="txtSearch"
                ></el-input>
              </div>
              <div class="left-post-part">
                <header class="post-title">Post Categories</header>
                <section class="post-categories">
                  <ul>
                    <li>
                      <i class="el-icon-arrow-right">&nbsp;&nbsp;&nbsp;</i>
                      <a href>ALL POSTS</a>
                    </li>
                    <li>
                      <i class="el-icon-arrow-right">&nbsp;&nbsp;&nbsp;</i>
                      <a href>TIPS & TRICK</a>
                    </li>
                    <li>
                      <i class="el-icon-arrow-right">&nbsp;&nbsp;&nbsp;</i>
                      <a href>TRENDING</a>
                    </li>
                    <li>
                      <i class="el-icon-arrow-right">&nbsp;&nbsp;&nbsp;</i>
                      <a href>HOW TO</a>
                    </li>
                    <li>
                      <i class="el-icon-arrow-right">&nbsp;&nbsp;&nbsp;</i>
                      <a href>POPULAR NEWS</a>
                    </li>
                    <li>
                      <i class="el-icon-arrow-right">&nbsp;&nbsp;&nbsp;</i>
                      <a href>VIEDO</a>
                    </li>
                    <li>
                      <i class="el-icon-arrow-right">&nbsp;&nbsp;&nbsp;</i>
                      <a href>QUOTE</a>
                    </li>
                  </ul>
                </section>
              </div>

              <div class="left-post-part">
                <header class="post-title">Popular Posts</header>
                <section class="post-popular">
                  <div class="post-popular-item clearfix">
                    <div class="left popular-item-logo"></div>
                    <div class="left popular-item-produ">
                      <h5>Black Friday Sale! What's Popular?</h5>
                      <p>Aug 20</p>
                    </div>
                  </div>
                  <div class="post-popular-item clearfix">
                    <div class="left popular-item-logo"></div>
                    <div class="left popular-item-produ">
                      <h5>Customer's Favorite Hand Watch</h5>
                      <p>Aug 20</p>
                    </div>
                  </div>
                  <div class="post-popular-item clearfix">
                    <div class="left popular-item-logo"></div>
                    <div class="left popular-item-produ">
                      <h5>Black Friday Sale! What's Popular?</h5>
                      <p>Aug 20</p>
                    </div>
                  </div>
                  <div class="post-popular-item clearfix">
                    <div class="left popular-item-logo"></div>
                    <div class="left popular-item-produ">
                      <h5>Customer's Favorite Handsfree</h5>
                      <p>Aug 20</p>
                    </div>
                  </div>
                </section>
              </div>

              <div class="left-post-part">
                <header class="post-title">Popular Tags</header>
                <section>
                  <span class="tags-item">Furniture</span>
                  <span class="tags-item">Chair</span>
                  <span class="tags-item">Men Watch</span>
                  <span class="tags-item">Clothing</span>
                  <span class="tags-item">Table</span>
                  <span class="tags-item">Clock</span>
                </section>
              </div>
            </div>
          </el-col>
          <el-col :xs="18" :md="18">
            <div class="main-container">
              <div class="article-banner"></div>
              <div class="article-subject">
                <p>Unboxing New BulBul Men
                  <br>Watch by Xenom
                </p>
              </div>
              <div class="article-author-info">
                Posted in
                <i>Technology</i> - Jul 13, 2017 By
                <i>Admin</i>
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
import bolgHeader from '@/components/layout/header.vue/'
import article from "@/components/article/blog.0.1.vue";

export default {
  name: "home-comp",
  components: { "blog-post": article ,'layout-header': bolgHeader},
  data() {
    return {
      txtSearch: "",
      input21: ""
    };
  }
};
</script>

<style>
header ._container,
footer ._container,
section ._container {
  position: relative;
  max-width: 1171px;
  margin: 0 auto;
}

#container-wrap > header {
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

.article-author-info {
  color: #cfcfcf;
  font-size: 12px;
  margin-top: 15px;
  margin-bottom: 15px;
}

.article-author-info i {
  color: #7e7e7e;
  font-size: 13px;
}

#txt-search-box {
  margin-top: 60px;
}

#txt-search-box input {
  height: 54px;
}

.left-aside {
  padding-right: 40px;
}

.post-title {
  margin-top: 60px;
  height: 54px;
  background: #f5f5f5;
  text-align: left;
  text-indent: 10px;
  line-height: 54px;
}

.post-categories li {
  text-align: left;
  line-height: 32px;
}

.post-popular-item {
  margin-top: 22px;
}

.post-popular-item:first-child {
  margin-top: 0;
}

.popular-item-logo {
  width: 92px;
  height: 75px;
  background: #818181;
}

.popular-item-produ {
  box-sizing: border-box;
  width: 160px;
  text-align: left;
  padding-left: 10px;
}

.popular-item-produ p {
  color: #bababa;
  margin-top: 10px;
  font-size: 12px;
}

.left-post-part > section {
  padding-top: 27px;
}

.tags-item {
  float: left;
  color: #8d8d8d;
  font-size: 13px;
  padding: 7px 15px;
  border: 1px solid #bababa;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
