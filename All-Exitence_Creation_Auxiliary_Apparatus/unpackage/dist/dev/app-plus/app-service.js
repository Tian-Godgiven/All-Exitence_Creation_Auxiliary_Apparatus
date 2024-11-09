if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const screenWidth = uni.getSystemInfoSync().screenWidth;
  function rpxToPx(rpx) {
    return rpx / 750 * screenWidth;
  }
  let ifMask = vue.ref(false);
  let maskAlpha = vue.ref(0.6);
  const maskAlphaMax = 0.6;
  let clickMaskFunction = () => {
  };
  function showMask(click) {
    ifMask.value = true;
    if (click) {
      clickMaskFunction = click;
    }
  }
  function hideMask() {
    ifMask.value = false;
  }
  function changeMaskAlpha(newAlpha) {
    newAlpha.toFixed(2);
    maskAlpha.value = newAlpha;
  }
  function clickMask() {
    clickMaskFunction();
  }
  let leftShowWidth = vue.ref(0);
  const leftMaxWidth = rpxToPx(650);
  let leftShowing = false;
  let rightShowWidth = vue.ref(0);
  const rightMaxWidth = rpxToPx(150);
  let rightShowing = false;
  function switchRight() {
    if (rightShowing) {
      hidePage("right");
    } else {
      showPage("right");
    }
  }
  function showLeft() {
    showPage("left");
    leftPageMask();
  }
  const rpxShow = rpxToPx(200);
  const rpxHide = rpxToPx(300);
  const rpxSpeed = rpxToPx(2);
  let touchStartTime = 0;
  let startX;
  let startY;
  let moveStartX;
  let moveStartY;
  let distantX;
  let ifVertical = false;
  let ifHorizontal = false;
  function touchStart(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    moveStartX = startX;
    touchStartTime = Date.now();
  }
  function touchMove(e) {
    if (ifVertical) {
      return false;
    }
    e.preventDefault();
    let movingX = moveStartX - e.touches[0].clientX;
    moveStartX = e.touches[0].clientX;
    moveStartY = e.touches[0].clientY;
    distantX = startX - moveStartX;
    const angle = getLineAngle(startX, startY, moveStartX, moveStartY);
    if (!ifHorizontal && (angle > 20 && angle < 160 || angle > 200 && angle < 340)) {
      ifVertical = true;
      return false;
    } else {
      ifHorizontal = true;
    }
    if (distantX > 0) {
      if (leftShowing) {
        leftShowWidth.value = Math.max(leftShowWidth.value - movingX, 0);
        leftPageMask();
      } else if (!rightShowing) {
        rightShowWidth.value = Math.min(rightShowWidth.value + movingX, rightMaxWidth);
      }
    } else if (distantX < 0) {
      if (!leftShowing) {
        leftShowWidth.value = Math.min(leftShowWidth.value - movingX, leftMaxWidth);
        leftPageMask();
      }
    }
  }
  function touchEnd(e) {
    let touchEndTime = Date.now();
    let moveDistant = distantX;
    let moveTime = touchEndTime - touchStartTime;
    startX = 0;
    distantX = 0;
    ifVertical = false;
    ifHorizontal = false;
    let slideSpeed = Math.abs(moveDistant) / moveTime;
    if (moveDistant > 0) {
      if (leftShowing) {
        if (Math.abs(moveDistant) > rpxHide || slideSpeed > rpxSpeed) {
          hidePage("left");
        } else {
          showPage("left");
        }
      } else if (!rightShowing) {
        if (moveDistant > rightMaxWidth / 2 || slideSpeed > rpxShow) {
          showPage("right");
        } else {
          hidePage("right");
        }
      }
    } else if (moveDistant < 0) {
      if (!leftShowing && (Math.abs(moveDistant) > rpxShow || slideSpeed > rpxSpeed)) {
        showPage("left");
      } else {
        hidePage("left");
      }
    }
  }
  const hideAnimateTime = 15;
  const showAnimateTime = 10;
  function hidePage(pageName) {
    const showWidth = pageName == "left" ? leftShowWidth : rightShowWidth;
    const maxWidth = pageName == "left" ? leftMaxWidth : rightMaxWidth;
    const speed = Math.abs(maxWidth) / hideAnimateTime;
    const reduce = () => {
      if (showWidth.value > 0) {
        if (showWidth.value - speed <= 0) {
          showWidth.value = 0;
          if (pageName == "left") {
            leftShowing = false;
            hideMask();
          } else {
            rightShowing = false;
          }
        } else {
          showWidth.value -= speed;
          if (pageName == "left") {
            leftPageMask();
          }
          requestAnimationFrame(reduce);
        }
      }
    };
    reduce();
  }
  function showPage(pageName) {
    if (pageName == "left") {
      leftShowing = true;
    } else {
      rightShowing = true;
    }
    const showWidth = pageName == "left" ? leftShowWidth : rightShowWidth;
    const maxWidth = pageName == "left" ? leftMaxWidth : rightMaxWidth;
    const speed = maxWidth / showAnimateTime;
    const reduce = () => {
      if (showWidth.value < maxWidth) {
        if (showWidth.value + speed >= maxWidth) {
          showWidth.value = maxWidth;
        } else {
          showWidth.value += speed;
          if (pageName == "left") {
            leftPageMask();
          }
          requestAnimationFrame(reduce);
        }
      }
    };
    reduce();
  }
  function leftPageMask() {
    if (!ifMask.value) {
      showMask(() => {
        hidePage("left");
      });
    }
    const maskAlpha2 = maskAlphaMax * (leftShowWidth.value / leftMaxWidth);
    changeMaskAlpha(maskAlpha2);
  }
  function getLineAngle(x1, y1, x2, y2) {
    var x = x1 - x2, y = y1 - y2;
    if (!x && !y) {
      return 0;
    }
    var angle = (180 + Math.atan2(-y, -x) * 180 / Math.PI + 360) % 360;
    return 360 - angle;
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$d = {};
  function _sfc_render$c(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "exitence" }, [
      vue.createElementVNode("view", { class: "name" }, "事物名"),
      vue.createElementVNode("view", { class: "tags" }, [
        vue.createElementVNode("view", null, "[标签A]"),
        vue.createElementVNode("view", null, "[标签B]")
      ])
    ]);
  }
  const exitenceVue = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", _sfc_render$c], ["__scopeId", "data-v-caaa1a3c"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/leftPage/all-exitence/exitence.vue"]]);
  const _sfc_main$c = /* @__PURE__ */ vue.defineComponent({
    __name: "group",
    setup(__props, { expose: __expose }) {
      __expose();
      let group = ["1", "2", "3"];
      const __returned__ = { get group() {
        return group;
      }, set group(v) {
        group = v;
      }, exitenceVue };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "group" }, [
      vue.createElementVNode("view", { class: "titleBar" }, [
        vue.createElementVNode("view", { class: "titleName" }, "分组名")
      ]),
      vue.createElementVNode("view", { class: "inner" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.group, (exitence, index) => {
            return vue.openBlock(), vue.createElementBlock("view", null, [
              vue.createVNode($setup["exitenceVue"], { exitence }, null, 8, ["exitence"]),
              index < $setup.group.length - 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "separator"
              })) : vue.createCommentVNode("v-if", true)
            ]);
          }),
          256
          /* UNKEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const groupVue = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", _sfc_render$b], ["__scopeId", "data-v-d360e721"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/leftPage/all-exitence/group.vue"]]);
  const _sfc_main$b = /* @__PURE__ */ vue.defineComponent({
    __name: "type",
    setup(__props, { expose: __expose }) {
      __expose();
      let groups = [9];
      let noGroupExitence = [1, 2, 3];
      const __returned__ = { get groups() {
        return groups;
      }, set groups(v) {
        groups = v;
      }, get noGroupExitence() {
        return noGroupExitence;
      }, set noGroupExitence(v) {
        noGroupExitence = v;
      }, groupVue, exitenceVue };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "type" }, [
      vue.createElementVNode("view", { class: "titleBar" }, [
        vue.createElementVNode("view", { class: "titleName" }, "分类名"),
        vue.createElementVNode("view", { class: "titleButtons" }, [
          vue.createElementVNode("view", null, "按键B")
        ])
      ]),
      vue.createElementVNode("view", { class: "inner" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.groups, (group, index) => {
            return vue.openBlock(), vue.createElementBlock("view", null, [
              vue.createVNode($setup["groupVue"], { group }, null, 8, ["group"])
            ]);
          }),
          256
          /* UNKEYED_FRAGMENT */
        )),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.noGroupExitence, (exitence, index) => {
            return vue.openBlock(), vue.createElementBlock("view", null, [
              vue.createVNode($setup["exitenceVue"], { exitence }, null, 8, ["exitence"]),
              index < $setup.noGroupExitence.length - 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "separator"
              })) : vue.createCommentVNode("v-if", true)
            ]);
          }),
          256
          /* UNKEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const typeVue = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$a], ["__scopeId", "data-v-a3a35eb7"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/leftPage/all-exitence/type.vue"]]);
  const _sfc_main$a = /* @__PURE__ */ vue.defineComponent({
    __name: "all-exitence",
    setup(__props, { expose: __expose }) {
      __expose();
      const __returned__ = { typeVue };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "all-exitence" }, [
      vue.createElementVNode("view", { class: "titleBar" }, [
        vue.createElementVNode("view", { class: "titleName" }, "万物"),
        vue.createElementVNode("view", { class: "titleButtons" }, [
          vue.createElementVNode("view", null, "按键A")
        ])
      ]),
      vue.createElementVNode("view", { class: "inner" }, [
        vue.createVNode($setup["typeVue"])
      ])
    ]);
  }
  const allExitenceVue = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$9], ["__scopeId", "data-v-39a4e909"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/leftPage/all-exitence/all-exitence.vue"]]);
  const _sfc_main$9 = /* @__PURE__ */ vue.defineComponent({
    __name: "article",
    setup(__props, { expose: __expose }) {
      __expose();
      const 文章内容 = "文章内容".repeat(100);
      const 预览内容 = 文章内容.slice(0, 100);
      let articleName = vue.ref("文章名");
      let articlePreview = vue.ref(预览内容);
      const __returned__ = { 文章内容, 预览内容, get articleName() {
        return articleName;
      }, set articleName(v) {
        articleName = v;
      }, get articlePreview() {
        return articlePreview;
      }, set articlePreview(v) {
        articlePreview = v;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "article" }, [
      vue.createElementVNode(
        "view",
        { class: "name" },
        vue.toDisplayString($setup.articleName),
        1
        /* TEXT */
      ),
      vue.createElementVNode(
        "view",
        { class: "preview" },
        vue.toDisplayString($setup.articlePreview),
        1
        /* TEXT */
      )
    ]);
  }
  const articleVue = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$8], ["__scopeId", "data-v-7ffe42d9"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/leftPage/all-articles/article.vue"]]);
  const _sfc_main$8 = /* @__PURE__ */ vue.defineComponent({
    __name: "chapter",
    props: ["chapter"],
    setup(__props, { expose: __expose }) {
      __expose();
      let articles = vue.ref([1]);
      let chapters = vue.ref([1]);
      const __returned__ = { get articles() {
        return articles;
      }, set articles(v) {
        articles = v;
      }, get chapters() {
        return chapters;
      }, set chapters(v) {
        chapters = v;
      }, articleVue };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chapter" }, [
      vue.createElementVNode("view", { class: "titleBar" }, [
        vue.createElementVNode("view", { class: "titleName" }, "章节名")
      ]),
      vue.createElementVNode("view", { class: "inner" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.articles, (article, index) => {
            return vue.openBlock(), vue.createElementBlock("view", null, [
              vue.createVNode($setup["articleVue"], { article }, null, 8, ["article"]),
              index < $setup.articles.length - 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "separator"
              })) : vue.createCommentVNode("v-if", true)
            ]);
          }),
          256
          /* UNKEYED_FRAGMENT */
        )),
        vue.createCommentVNode(' 			<view v-for="(chapter,index) in chapters">\r\n				<chapterVue :chapter="chapter"></chapterVue>\r\n			</view> ')
      ])
    ]);
  }
  const chapterVue = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$7], ["__scopeId", "data-v-84dca8d2"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/leftPage/all-articles/chapter.vue"]]);
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function readFileToJSON(shortPath) {
    return new Promise((resovle, reject) => {
      plus.io.requestFileSystem(
        plus.io.PUBLIC_DOCUMENTS,
        // 成功访问文件系统
        function(fs) {
          fs.root.getFile(
            `/data/${shortPath}`,
            { create: false },
            // 成功获取文件，开始读取文件内容
            function(fileEntry) {
              fileEntry.file(
                // 读取成功
                (file) => {
                  formatAppLog("log", "at hooks/dataFile.ts:76", file);
                },
                // 读取失败
                (error) => {
                  formatAppLog("error", "at hooks/dataFile.ts:102", "读取文件失败:", error);
                  reject("访问失败");
                }
              );
            },
            //获取文件失败
            (error) => {
              formatAppLog("error", "at hooks/dataFile.ts:109", "获取文件失败:", error);
              reject("访问失败");
            }
          );
        },
        // 访问文件系统失败
        function(error) {
          formatAppLog("error", "at hooks/dataFile.ts:116", "无法访问文件系统:", error);
          reject("访问失败");
        }
      );
    });
  }
  const filePath = "/projects/项目1/all-articles.json";
  const _sfc_main$7 = /* @__PURE__ */ vue.defineComponent({
    __name: "all-articles",
    setup(__props, { expose: __expose }) {
      __expose();
      let chapters = vue.ref([]);
      let articles = vue.ref([]);
      const loading = async () => {
        let allArticls = readFileToJSON(filePath);
        if (allArticls) {
          chapters = vue.ref(allArticls.chapter);
          articles = vue.ref(allArticls.articles);
        }
      };
      loading();
      const __returned__ = { get chapters() {
        return chapters;
      }, set chapters(v) {
        chapters = v;
      }, get articles() {
        return articles;
      }, set articles(v) {
        articles = v;
      }, filePath, loading, chapterVue, articleVue };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "articles" }, [
      vue.createElementVNode("view", { class: "titleBar" }, [
        vue.createElementVNode("view", { class: "titleName" }, "文本")
      ]),
      vue.createElementVNode("view", { class: "inner" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.articles, (article, index) => {
            return vue.openBlock(), vue.createElementBlock("view", null, [
              vue.createVNode($setup["articleVue"], { article }, null, 8, ["article"]),
              index < $setup.articles.length - 1 ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "separator"
              })) : vue.createCommentVNode("v-if", true)
            ]);
          }),
          256
          /* UNKEYED_FRAGMENT */
        )),
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.chapters, (chapter, index) => {
            return vue.openBlock(), vue.createElementBlock("view", null, [
              vue.createVNode($setup["chapterVue"], { chapter }, null, 8, ["chapter"])
            ]);
          }),
          256
          /* UNKEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const allArticlesVue = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$6], ["__scopeId", "data-v-f80ab652"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/leftPage/all-articles/all-articles.vue"]]);
  const _sfc_main$6 = /* @__PURE__ */ vue.defineComponent({
    __name: "leftPage",
    props: ["showWidth"],
    setup(__props, { expose: __expose }) {
      __expose();
      let maxWidth = leftMaxWidth;
      let titleName = vue.ref("项目名称");
      const __returned__ = { get maxWidth() {
        return maxWidth;
      }, set maxWidth(v) {
        maxWidth = v;
      }, get titleName() {
        return titleName;
      }, set titleName(v) {
        titleName = v;
      }, allExitenceVue, allArticlesVue };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "leftPage",
        style: vue.normalizeStyle({ left: $props.showWidth - $setup.maxWidth + "px" })
      },
      [
        vue.createElementVNode("view", { class: "titleBar" }, [
          vue.createElementVNode(
            "view",
            { class: "titleName" },
            vue.toDisplayString($setup.titleName),
            1
            /* TEXT */
          ),
          vue.createElementVNode("view", { class: "titleButtons" }, [
            vue.createElementVNode("view", { class: "titleButton" }, "搜索"),
            vue.createElementVNode("view", { class: "titleButton" }, "导入导出"),
            vue.createElementVNode("view", { class: "titleButton" }, "切换项目"),
            vue.createElementVNode("view", { class: "titleButton" }, "展开收起")
          ])
        ]),
        vue.createElementVNode("view", { class: "inner" }, [
          vue.createElementVNode("scroll-view", { "scroll-y": "" }, [
            vue.createCommentVNode(" 万物区 "),
            vue.createVNode($setup["allExitenceVue"]),
            vue.createCommentVNode(" 文本区 "),
            vue.createVNode($setup["allArticlesVue"]),
            vue.createCommentVNode(" 底部填充区 "),
            vue.createElementVNode("view", { class: "scrollBottom" })
          ])
        ])
      ],
      4
      /* STYLE */
    );
  }
  const leftPageVue = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-7b92fc5e"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/leftPage/leftPage.vue"]]);
  const _sfc_main$5 = /* @__PURE__ */ vue.defineComponent({
    __name: "rightPage",
    props: ["showWidth", "maxWidth"],
    setup(__props, { expose: __expose }) {
      __expose();
      const maxWidth = rightMaxWidth;
      let abilities = ["1", "2", "3"];
      let rightPageHeight = uni.getSystemInfoSync().screenHeight - rpxToPx(550);
      let rightPageButtonNum = rightPageHeight / 150;
      const __returned__ = { maxWidth, get abilities() {
        return abilities;
      }, set abilities(v) {
        abilities = v;
      }, get rightPageHeight() {
        return rightPageHeight;
      }, set rightPageHeight(v) {
        rightPageHeight = v;
      }, get rightPageButtonNum() {
        return rightPageButtonNum;
      }, set rightPageButtonNum(v) {
        rightPageButtonNum = v;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "rightPage",
        style: vue.normalizeStyle({ right: $props.showWidth - $setup.maxWidth + "px" })
      },
      [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.abilities, (ability, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "rightPageButton",
              key: index
            }, [
              vue.createElementVNode(
                "view",
                null,
                vue.toDisplayString(ability),
                1
                /* TEXT */
              )
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ],
      4
      /* STYLE */
    );
  }
  const rightPageVue = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-c19cb633"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/rightPage/rightPage.vue"]]);
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "exitenceInner",
    props: ["exitence"],
    setup(__props, { expose: __expose }) {
      __expose();
      const __returned__ = {};
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      null,
      vue.toDisplayString($props.exitence),
      1
      /* TEXT */
    );
  }
  const exitenceInnerVue = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/mainPage/exitenceInner.vue"]]);
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "mask",
    setup(__props, { expose: __expose }) {
      __expose();
      const __returned__ = { get ifMask() {
        return ifMask;
      }, get maskAlpha() {
        return maskAlpha;
      }, get clickMask() {
        return clickMask;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.withDirectives((vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "mask",
        style: vue.normalizeStyle({ backgroundColor: `rgba(0, 0, 0, ${$setup.maskAlpha})` }),
        onClick: _cache[0] || (_cache[0] = (...args) => $setup.clickMask && $setup.clickMask(...args))
      },
      null,
      4
      /* STYLE */
    )), [
      [vue.vShow, $setup.ifMask]
    ]);
  }
  const maskVue = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-31ff313d"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/mainPage/mask.vue"]]);
  let inputSupportShowing = vue.ref(false);
  function showInputSupport() {
    inputSupportShowing.value = true;
  }
  function hideInputSupport() {
    inputSupportShowing.value = false;
  }
  const _sfc_main$2 = {};
  function _sfc_render$1(_ctx, _cache) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "inputSupport" }, [
      vue.createElementVNode("view", { class: "autoComplete" }, "联想输入"),
      vue.createElementVNode("view", { class: "buttons" }, " 按键列表 ")
    ]);
  }
  const inputSupportVue = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-2e43516c"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/components/mainPage/inputSupport.vue"]]);
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const rpx150 = rpxToPx(150);
      let rightPageHeight = uni.getSystemInfoSync().screenHeight - rpxToPx(550);
      let rightPageButtonNum = rightPageHeight / rpx150 - 1;
      let rightPageSwitchButtonTop = rpxToPx(350) + rightPageButtonNum * rpx150;
      let textNum = vue.ref(0);
      const 大量内容测试 = "内容".repeat(1e3);
      const 大量标题测试 = "标题".repeat(100);
      let textInner = vue.ref(大量内容测试);
      let textTitle = vue.ref("标题测试");
      textNum.value = textInner.value.length;
      let innerType = "article";
      const __returned__ = { rpx150, get rightPageHeight() {
        return rightPageHeight;
      }, set rightPageHeight(v) {
        rightPageHeight = v;
      }, get rightPageButtonNum() {
        return rightPageButtonNum;
      }, set rightPageButtonNum(v) {
        rightPageButtonNum = v;
      }, get rightPageSwitchButtonTop() {
        return rightPageSwitchButtonTop;
      }, set rightPageSwitchButtonTop(v) {
        rightPageSwitchButtonTop = v;
      }, get textNum() {
        return textNum;
      }, set textNum(v) {
        textNum = v;
      }, 大量内容测试, 大量标题测试, get textInner() {
        return textInner;
      }, set textInner(v) {
        textInner = v;
      }, get textTitle() {
        return textTitle;
      }, set textTitle(v) {
        textTitle = v;
      }, get innerType() {
        return innerType;
      }, set innerType(v) {
        innerType = v;
      }, get rightShowWidth() {
        return rightShowWidth;
      }, get leftShowWidth() {
        return leftShowWidth;
      }, get touchStart() {
        return touchStart;
      }, get touchMove() {
        return touchMove;
      }, get touchEnd() {
        return touchEnd;
      }, get showLeft() {
        return showLeft;
      }, get switchRight() {
        return switchRight;
      }, leftPageVue, rightPageVue, exitenceInnerVue, maskVue, get hideInputSupport() {
        return hideInputSupport;
      }, get inputSupportShowing() {
        return inputSupportShowing;
      }, get showInputSupport() {
        return showInputSupport;
      }, inputSupportVue };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  });
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock(
      "view",
      {
        class: "mainPage",
        onTouchstart: _cache[6] || (_cache[6] = (...args) => $setup.touchStart && $setup.touchStart(...args)),
        onTouchmove: _cache[7] || (_cache[7] = (...args) => $setup.touchMove && $setup.touchMove(...args)),
        onTouchend: _cache[8] || (_cache[8] = (...args) => $setup.touchEnd && $setup.touchEnd(...args))
      },
      [
        vue.createCommentVNode(" 首页顶部 "),
        vue.createElementVNode("view", { class: "titleBar" }, [
          vue.createElementVNode("view", {
            class: "leftPageShowButton",
            onClick: _cache[0] || (_cache[0] = ($event) => $setup.showLeft())
          }, "左侧按键"),
          vue.createElementVNode("view", { class: "titleName" }, "项目名"),
          vue.createElementVNode("view", { class: "titleButtons" }, [
            vue.createElementVNode("view", null, "任务"),
            vue.createElementVNode("view", null, "日历"),
            vue.createElementVNode("view", null, "设置")
          ])
        ]),
        vue.createCommentVNode(" 首页内容 "),
        vue.createElementVNode("view", { class: "inner" }, [
          vue.createElementVNode("scroll-view", { "scroll-y": "" }, [
            vue.createElementVNode("view", { class: "innerTitle" }, [
              vue.createElementVNode("textarea", {
                onFocus: _cache[1] || (_cache[1] = (...args) => $setup.showInputSupport && $setup.showInputSupport(...args)),
                onBlur: _cache[2] || (_cache[2] = (...args) => $setup.hideInputSupport && $setup.hideInputSupport(...args)),
                "auto-height": "",
                value: $setup.textTitle,
                maxlength: "-1",
                "hold-keyboard": ""
              }, "\r\n				", 40, ["value"])
            ]),
            vue.createElementVNode("view", { class: "innerText" }, [
              $setup.innerType == "article" ? (vue.openBlock(), vue.createElementBlock("textarea", {
                key: 0,
                onFocus: _cache[3] || (_cache[3] = (...args) => $setup.showInputSupport && $setup.showInputSupport(...args)),
                onBlur: _cache[4] || (_cache[4] = (...args) => $setup.hideInputSupport && $setup.hideInputSupport(...args)),
                "auto-height": "",
                value: $setup.textInner,
                maxlength: "-1",
                "hold-keyboard": ""
              }, "\r\n				", 40, ["value"])) : vue.createCommentVNode("v-if", true),
              $setup.innerType == "exitence" ? (vue.openBlock(), vue.createBlock($setup["exitenceInnerVue"], {
                key: 1,
                exitence: $setup.textInner
              }, null, 8, ["exitence"])) : vue.createCommentVNode("v-if", true)
            ])
          ]),
          vue.createElementVNode(
            "view",
            { class: "textNum" },
            "字数: " + vue.toDisplayString($setup.textNum),
            1
            /* TEXT */
          )
        ]),
        vue.createCommentVNode(" 右侧切换键 "),
        vue.createElementVNode(
          "view",
          {
            class: "rightPageSwitchButton",
            style: vue.normalizeStyle({ top: $setup.rightPageSwitchButtonTop + "px" }),
            onClick: _cache[5] || (_cache[5] = ($event) => $setup.switchRight())
          },
          null,
          4
          /* STYLE */
        ),
        vue.createCommentVNode(" 左侧页面"),
        vue.createVNode($setup["leftPageVue"], { showWidth: $setup.leftShowWidth }, null, 8, ["showWidth"]),
        vue.createCommentVNode(" 右滑页面 "),
        vue.createVNode($setup["rightPageVue"], { showWidth: $setup.rightShowWidth }, null, 8, ["showWidth"]),
        vue.createCommentVNode(" 创作辅助栏 "),
        vue.withDirectives(vue.createVNode(
          $setup["inputSupportVue"],
          null,
          null,
          512
          /* NEED_PATCH */
        ), [
          [vue.vShow, $setup.inputSupportShowing]
        ]),
        vue.createCommentVNode(" 遮罩层 "),
        vue.createVNode($setup["maskVue"])
      ],
      32
      /* NEED_HYDRATION */
    );
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"], ["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "F:/MyWork/All-Exitence_Creation_Auxiliary_Apparatus/All-Exitence_Creation_Auxiliary_Apparatus/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
