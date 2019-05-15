<template>
  <header>
    <div class="_container">
      <el-row :gutter="20">
        <el-col :xs="2" :md="2">
          <div class="page-header-logo">
            <img src="@/assets/img/logo.jpg" alt>
          </div>
        </el-col>
        <el-col :xs="19" :md="19">
          <nav class="page-header-nav">
            <ul class="clearfix">
              <li class="active">
                <a href="javascript:void(0)">主页</a>
              </li>
              <li>
                <a href="javascript:void(0)">技术博客</a>
              </li>
              <li>
                <a href="javascript:void(0)">网址收藏</a>
              </li>
              <li>
                <a href="javascript:void(0)">生活创作</a>
              </li>
              <li>
                <a href="javascript:void(0)">关于</a>
              </li>
            </ul>
          </nav>
        </el-col>
        <el-col :xs="3" :md="3" class="header-operate-col">
          <div class="page-header-operate clearfix">
            <a href>
              <span class="iconfont icon-search"></span>
            </a>
            <a href>
              <span class="iconfont icon-gouwudai"></span>
            </a>
            <a href>
              <span class="iconfont icon-user"></span>
            </a>
          </div>
        </el-col>
      </el-row>
    </div>
  </header>
</template>
