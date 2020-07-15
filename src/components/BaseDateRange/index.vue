<template>
	<div class="flex-x base-daterange">
		<!--开始时间-->
		<el-date-picker
			ref="date-picker-0"
			v-model="valueRange[0]"
			type="date"
			v-bind="$attrs"
			:placeholder="$attrs['start-placeholder']"
			prefix-icon="none"
			@change="handleChange0"
			@blur="handleBlur"
			@focus="handleFocus"
		></el-date-picker>
		<!--分隔符-->
		<span class="el-input__icon el-range__icon">-</span>
		<!--结束时间-->
		<el-date-picker
			ref="date-picker-1"
			v-model="valueRange[1]"
			type="date"
			v-bind="$attrs"
			:placeholder="$attrs['end-placeholder']"
			prefix-icon="none"
			@change="handleChange1"
			@blur="handleBlur"
			@focus="handleFocus"
		></el-date-picker>
	</div>
</template>

<script>
	export default {
		name: "base-daterange",
		props: {
			value: {
				default: ""
			}
		},
		model: {//双向绑定
			prop: "value",
			event: "on-model-change"
		},
		data() {
			return {
				valueRange: []
			};
		},
		mounted() {
			//处理初始值
			if (this.value && this.value.constructor == Array) {
				this.valueRange = [this.value[0], this.value[1]];
			}
		},
		watch: {
			value: {
				handler(val) {
					if (!val) {
						this.valueRange = [];
					} else {
						//父组件可改变值
						this.valueRange = val;
					}
				},
				deep: true
			}
		},
		methods: {
			handleChange0(value) {
				//开始时间改变事件
				this.valueRange[0] = value;
				//改变绑定值
				this.$emit("on-model-change", this.valueRange);
				//同步触发改变事件，返回值数组
				this.$emit("change", this.valueRange);
			},
			handleChange1(value) {
				//结束时间改变事件
				this.valueRange[1] = value;
				//改变绑定值
				this.$emit("on-model-change", this.valueRange);
				//同步触发改变事件，返回值数组
				this.$emit("change", this.valueRange);
			},
			handleBlur() {
				//失焦事件，返回该组件
				this.$emit("blur", this);
			},
			handleFocus() {
				//聚焦事件，返回该组件
				this.$emit("focus", this);
			}
		}
	};
</script>

<style lang="scss">
	.base-daterange {
		.el-input__inner {
			padding-left: 5px !important;
			padding-right: 10px !important;
		}

		.el-input__suffix {
			right: 0;
		}
	}
</style>
