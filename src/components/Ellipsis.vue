<template>
    <div class="m-ellipsis-wrapper">
        <div class="m-ellipsis-text" ref="dom">
            {{text}}
        </div>
        <span class="m-ellipsis-subfix" v-if="canUnfold && !showUnfold">{{ subfix }}</span>
        <span @click='toogleFold' v-if='showSlot' class="m-ellipsis-unfold">
            <slot>
                {{ computedFoldText }}
            </slot>
        </span>
    </div>
</template>

<script>
    function throttle(fn, wait) {
        let timer = null;
        return function () {
            let context = this;
            let args = arguments;
            if (!timer) {
                timer = setTimeout(function () {
                    fn.apply(context, args);
                    timer = null;
                }, wait)
            }
        }
    }

    function insertAfter(newElement, targetElement) {
        var parent = targetElement.parentNode;
        if (parent.lastChild == targetElement) {
            // 如果最后的节点是目标元素，则直接添加。因为默认是最后
            parent.appendChild(newElement);
        } else {
            //如果不是，则插入在目标元素的下一个兄弟节点的前面。也就是目标元素的后面
            parent.insertBefore(newElement, targetElement.nextSibling);
        }
    }
    export default {
        name: "mEllipsis",
        props: {
            text: {
                default: "",
                type: String
            },
            line: {
                default: 2,
                type: Number
            },
            subfix: {
                default: "...",
                type: String
            },
            showUnfold: {
                default: true,
                type: Boolean
            },
            showFold: {
                default: true,
                type: Boolean
            },
            unfoldText: {
                default: "展开",
                type: String
            },
            foldText: {
                default: "收起",
                type: String
            }
        },
        data() {
            return {
                dom: null,
                targetHeight: 0,
                unFolded: false,
                canUnfold: false
            };
        },
        mounted() {
            this.dom = this.$refs.dom;
            this.computed();
            //监听窗口缩放事件
            window && window.addEventListener('resize', throttle(() => {
                this.computed();
            }, 200))
        },
        computed: {
            isSupportWebkitLineClamp() {
                return !document.createElement('div').style.webkitLineClamp !== undefined;
                // return false;
            },
            computedFoldText() {
                let {
                    unfoldText,
                    foldText,
                    unFolded
                } = this
                return unFolded ? foldText : unfoldText
            },
            showSlot() {
                let {
                    canUnfold,
                    showUnfold,
                    showFold,
                    unFolded
                } = this
                let is = false
                if (canUnfold && showUnfold) {
                    if (unFolded && showFold) {
                        is = true
                    } else if (!unFolded) {
                        is = true
                    }
                }
                return is
            }
        },
        methods: {
            toogleFold() {
                let {
                    unFolded
                } = this
                if (!unFolded) {
                    this.setUnFlod();
                    this.$emit("unflod")
                } else {
                    this.setFlod();
                    this.$emit("flod")
                }
            },
            setFlod() {
                const {
                    dom,
                    isSupportWebkitLineClamp,
                } = this;
                if (isSupportWebkitLineClamp) {
                    this.setFlodStyles();
                } else {
                    dom.style.height = this.targetHeight + "px";
                    dom.style.overflow = "hidden";
                }
                dom.classList.add("mu-flod");
                this.unFolded = false;
                this.canUnfold = true;
            },
            setUnFlod() {
                const {
                    isSupportWebkitLineClamp,
                    dom
                } = this;
                if (isSupportWebkitLineClamp) {
                    let styles = {
                        'overflow': 'visible',
                        'textOverflow': 'inherit',
                        'display': 'inherit',
                        'webkitLineClamp': 'unset',
                        'webkitBoxOrient': 'unset',
                    }
                    Object.keys(styles).forEach((key) => {
                        dom.style[key] = styles[key]
                    })
                } else {
                    dom.style.overflow = "visible";
                    dom.style.height = "auto";
                }
                this.unFolded = true;
            },
            setFlodStyles() {
                const {
                    dom
                } = this;
                let styles = {
                    'overflow': 'hidden',
                    'textOverflow': 'ellipsis',
                    'display': '-webkit-box',
                    'webkitLineClamp': this.line,
                    'webkitBoxOrient': 'vertical',
                }
                Object.keys(styles).forEach((key) => {
                    dom.style[key] = styles[key]
                })
            },
            notSupportHandler() {
                const {
                    dom,
                    text,
                    line
                } = this;
                let lineHeight = getComputedStyle(dom, null).lineHeight;
                this.targetHeight = line * parseFloat(lineHeight);
                let tempstr = text;
                dom.innerHTML = tempstr;
                if (dom.offsetHeight <= this.targetHeight) {
                    dom.innerHTML = tempstr;
                } else {
                    setTimeout(() => {
                        this.setFlod();
                    }, 1000);
                }
            },
            supportHandler() {
                const { dom, line } = this;
                let cloneNode = dom.parentNode.cloneNode(true)
                this.setFlodStyles();
                insertAfter(cloneNode, dom.parentNode)
                let realHeight = cloneNode.offsetHeight
                console.log(dom.offsetHeight)
                console.log(realHeight)
                cloneNode.remove();
                let lineHeight = getComputedStyle(dom, null).lineHeight;
                this.targetHeight = line * parseFloat(lineHeight);
                if (realHeight > this.targetHeight) {
                    this.canUnfold = true;
                }
            },
            computed() {
                const {
                    isSupportWebkitLineClamp,
                    text
                } = this;
                // 无值则不处理
                if (text === undefined || text === "") {
                    return;
                }
                // 先设置样式 若已经显示省略号 则完全不用js计算
                if (!isSupportWebkitLineClamp) {
                    this.notSupportHandler()
                } else {
                    this.supportHandler();
                }
            }
        },
        watch: {
            "text"() {
                this.computed();
            }
        }
    };
</script>