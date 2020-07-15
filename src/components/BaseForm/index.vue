<template>
	<div class="base-form">
		<el-dialog
			:visible.sync="_visible"
			:title="title"
			:fullscreen="fullscreen"
			:modal="!fullscreen"
			:show-close="showClose"
			:class="{'full-dialog':fullscreen}"
			:before-close="beforeClose"
			top="5vh"
			:close-on-click-modal="false"
			v-dialogDrag:[fullscreen]
		>
			<!--表单验证-->
			<ValidationObserver ref="observer">
				<div class="flex-x form-wrap">
					<template v-if="items&&items.length&&_visible">
						<div
							:class="['base-form-item',{'slot':item.slot ||item.line ||item.tag==='textarea'}]"
							v-show="!item.hidden && (item.slot||item.prop)"
							v-for="(item, index) in items"
							:key="index"
						>
							<!--自定义插槽-->
							<slot v-if="item.slot" :name="item.slot" :scope="model" />
							<!--表单组件-->
							<base-form-item
								v-else
								:item="item"
								v-model="model[item.prop]"
								:disabled="disabled"
								:readonly="readonly||item.readonly"
								:labelWidth="labelWidth"
							></base-form-item>
						</div>
					</template>
				</div>
			</ValidationObserver>
			<!--表单底部-->
			<div slot="footer" class="dialog-footer">
				<!--操作按钮组-->
				<template v-for="(operation,index) in operationList">
					<el-button
						size="small"
						v-show="!(operation.hidden&&operation.hidden($props))"
						:key="index"
						:type="operation.type||'primary'"
						@click="handleOperation(operation)"
						:disabled="operation.disabled&&operation.disabled($props)"
					>{{operation.name}}</el-button>
				</template>
				<!--保存按钮-->
				<el-button v-show="showSave" type="primary" @click="save" size="small">保 存</el-button>
				<!--关闭按钮-->
				<el-button v-show="showClose" @click="close" size="small">关 闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "base-form",
		props: {
			visible: {
				//是否可见
				type: Boolean,
				default: false
			},
			title: {
				//表单标题
				type: String,
				default: ""
			},
			api: {
				//请求接口
				type: String,
				default: ""
			},
			event: {
				//表单动作
				type: String,
				default: "add" // add-新增  edit-编辑 view-查看 
			},
			items: {
				//表单项
				type: Array,
				default: () => []
			},
			model: {
				//绑定值
				type: Object,
				default: () => {}
			},
			operationList: {
				//表单底部的操作按钮组
				type: Array,
				default: () => []
      },
      saveAndClose:{
        //保存之后是否关闭，默认关闭
        type: Boolean,
				default: true
      }
		},
		data() {
			return {};
		},
		//是否可见双向绑定
		model: {
			prop: "visible",
			event: "on-model-change"
		},
		watch: {
			visible(val) {
				if (!val) {
					//表单关闭后，清空表单
					this.clear();
				}
			}
		},
		computed: {
			disabled() {
				//是否不可用
				return !!this.$attrs.disabled;
			},
			readonly() {
				//是否只读
				return !!this.$attrs.readonly || this.event==='view';
      },
      labelWidth(){
        //标签宽度
        return this.$attrs.labelWidth;
      },
			fullscreen() {
				//是否全屏
				return !!this.$attrs["fullscreen"];
			},
			showClose() {
				//是否可关闭
				return this.$attrs["showClose"] !== false;
			},
			showSave() {
				//是否显示保存按钮
				return this.$attrs["showSave"] !== false && this.event!=='view';
			},
			_visible: {
				get() {
					return this.visible;
				},
				set() {
					this.close();
				}
			}
		},
		methods: {
			//表单关闭前的事件
			beforeClose(done) {
				if (this.$listeners.beforeClose) {
					//如果有beforeClose事件，则触发beforeClose事件
					this.$listeners.beforeClose(done);
				} else {
					done();
				}
			},
			//关闭表单
			close() {
				if (this.$listeners.close) {
					//如果有close事件，则触发close事件
					this.$listeners.close();
				}
				//关闭表单
				this.$emit("on-model-change", false);
				//重置表单验证
				this.resetValidate();
			},
			//清空表单
			clear() {
				Object.keys(this.model).map(prop => {
					this.model[prop] = "";
				});
				//重置表单验证
				this.resetValidate();
			},
			//重置表单验证
			resetValidate() {
				this.$refs.observer && this.$refs.observer.reset();
			},
			//点击操作按钮触发的回调事件
			async handleOperation(operation) {
				let { event, isValidate } = operation;
				let model = this.handleModel();
				if (event === "save") {
          //触发保存事件
					this.save();
				} else if (isValidate) {
          //判断该事件是否需要表单验证
					const isValid = await this.$refs.observer.validate();
					if (isValid) {
						this.$emit(event, model);
					}
				} else {
					this.$emit(event, model);
				}
			},
			//触发保存事件
			async save() {
				const isValid = await this.$refs.observer.validate();
				let model = this.handleModel();
				if (isValid) {
					//如果有api地址，则将保存操作统一处理
					if (this.api) {
						let method =
							this.event === "add"
								? "post"
								: this.event === "edit"
								? "patch"
								: "patch";

						this.API[method](this.api,model).then(response => {
							if (response) {
								this.TOOL.message("success", `保存成功！`);
								//保存成功回调事件
                this.$emit("afterSave", model);
                //判断保存之后是否关闭表单
                if(this.saveAndClose){
                  this.close();
                }
							}
						});
					} else {
						//如果没有api地址，则触发save事件，将表单的值返回给页面
						this.$emit("save", model);
					}
				}
			},
			handleModel() {//处理表单值
				let model = this.TOOL.clone(this.model);
				Object.keys(model).map(prop => {
					//将空字符串转为null
          if (model[prop] === "") model[prop] = null;
          
          //去除操作人操作时间等属性项
          if ( prop == 'creator' || prop == 'updateAt' || prop == 'updator') {
            delete model[prop];
          }

					//处理逗号分开的项
					if (prop.indexOf(",") != -1) {
						let props = prop.split(",");
						if (model[prop] && model[prop].length) {
							model[props[0]] = model[prop][0] || "";
							model[props[1]] = model[prop][1] || "";
						} else {
							model[props[0]] = "";
							model[props[1]] = "";
						}
						delete model[prop];
					}
				});
				return model;
			}
		}
	};
</script>

<style lang="scss">
	.base-form {
		.form-wrap {
			justify-content: flex-start;
			flex-wrap: wrap;

			.base-form-item {
				flex: 0 1 25%;
				// flex-shrink: 30%;
				min-width: 350px;
				max-width: 700px;
			}

			.slot {
				width: 100%;
				min-width: 100%;
				flex: none;
			}

			.operations {
				flex-basis: 200px;
				text-align: right;

				.btn {
					margin-bottom: 10px;
				}
			}
		}

		.el-dialog {
			min-width: 400px;
			overflow: auto;

			.el-dialog__body {
				padding: 10px 20px 0px 20px;
			}
		}

		.el-dialog__wrapper.full-dialog {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 1000 !important;
		}

		.el-input-group__append {
			padding: 0 8px;
		}
	}
</style>
