<template>
	<el-popover
		placement="bottom-start"
		trigger="click"
		@show="show"
		:disabled="$attrs.disabled || $attrs.readonly"
		:popper-options="{'boundariesElement':'viewport'}"
		:transition="null"
		popper-class="select-pop"
	>
		<div class="table">
			<base-search
				v-if="searchItems&&searchItems.length"
				:model="searchModel"
				:items="searchItems"
				@clickSearch="clickSearch"
			></base-search>
			<base-table
				class="pop-table"
				size="small"
				ref="base-table"
				:columns="$attrs.columns"
				:api="$attrs.api"
				:type="$attrs.type"
				:row-key="$attrs.rowKey"
				:tableData="$attrs.tableData"
				:searchModel="tableSearchModel"
				:immediate="immediate"
				pagLayout="total, prev, pager, next, jumper"
				:max-height="300"
				:searchClear="false"
				@selection-change="selectionChange"
				@current-change="currentChange"
			></base-table>
		</div>
		<el-select
			ref="el-select"
			slot="reference"
			:value="value"
			v-bind="$attrs"
			v-on="$listeners"
			@clear="handleClear"
			popper-class="base-table-select"
			:disabled="$attrs.disabled || $attrs.readonly"
		>
			<el-option ref="el-option" :label="optionLabel" :value="optionValue" selected></el-option>
		</el-select>
	</el-popover>
</template>

<script>
	export default {
		name: "base-table-select",
		props: {
			value: {
				default: ""
			}
		},
		computed: {
			defaultPropsName() {
				//label和value的配置项
				return this.$attrs.defaultProps || this.defaultProps;
			},
			searchItems() {
				//搜索项
				return this.$attrs.searchItems || [];
			}
		},
		data() {
			return {
				immediate: false,//是否立即执行表格查询
				searchModel: {},//搜索绑定的值
				tableSearchModel: {},//表格的搜索项
				optionLabel: "",//选中的标签名称
				optionValue: "",//选中的标签值
				defaultProps: {//默认的label和value的配置项
					label: "name",
					value: "id"
				}
			};
		},
		created() {
			//初始化时获取标签名称
			this.getLabel();
		},
		methods: {
			show() {
				this.$emit("show");
				if (this.immediate === false) {
					this.clickSearch({});
					this.immediate = true;
				}
			},
			clickSearch(value) {
				this.tableSearchModel = value;
			},
			handleClear() {
				this.$refs["base-table"].clearSelectedRow();
				this.rowchange(null);
			},
			selectionChange(rows) {
				if (!rows) return;
				let values = rows.map(item => item[this.defaultPropsName.value]);
				let labels = rows.map(item => item[this.defaultPropsName.label]);
				this.optionLabel = labels.join(",");
				this.optionValue = values.join(",");
				this.$nextTick(() => {
					this.$refs["el-option"].$el.click();
					this.rowchange(rows);
				});
			},
			currentChange(row) {
				if (!row) return;
				if (this.$attrs.type !== "checkbox") {
					this.optionLabel = row[this.defaultPropsName.label];
					this.optionValue = row[this.defaultPropsName.value];
					this.$nextTick(() => {
						this.$refs["el-option"].$el.click();
						this.$refs["el-select"].$el.click();
						this.rowchange(row);
					});
				}
			},
			rowchange(value) {
				this.$nextTick(() => {
					this.$emit("rowchange", value);
				});
			},
			getLabel() {
				if (
					this.value !== null &&
					this.value !== ""
				) {
					let url = this.$attrs.getApi ? this.$attrs.getApi : this.$attrs.api;
					url = url.split("?")[0];
					let values = this.value.toString().split(",");
					let axiosArr = [];
					values.forEach(item => {
						axiosArr.push(this.API.get(url + "/" + item));
					});
					Promise.all(axiosArr).then(res => {
						let label;
						res.forEach(item => {
							if (label) {
								label = label + "," + item[this.defaultPropsName.label];
							} else {
								label = item[this.defaultPropsName.label];
							}
							if (this.$attrs.type === "checkbox") {
								this.$refs["base-table"].toggleRowSelection(item);
							}
						});
						this.optionLabel = label;
						this.optionValue = this.value;
					});
				}
			}
		}
	};
</script>

<style lang="scss">
	.base-table-select {
		display: none;
	}

	.el-popper.select-pop {
		max-width: 60%;
	}

	.pop-table {
		border: 0;
	}

	.el-popper.select-pop {
		padding: 0;
		max-width: 500px;

		.base-table {
			padding: 5px 5px 0 5px;
			margin: 0;

			.el-table--border {
				border: 0;
			}

			.el-table--border th,
			.el-table--border td {
				border-right: 0;
			}

			.el-pagination {
				padding: 5px;
				text-align: left;
			}
		}

		.base-search {
			.base-form {
				& > .base-form-item {
					flex: 1 1 50%;
					min-width: 200px;
				}
				.operations {
					flex: 1 1 50%;
					min-width: 200px;
				}
			}
		}
	}
</style>
