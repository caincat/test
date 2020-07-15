<!--需要使用组件实例ref属性只能在父组件定义ref属性，使用this.$refs.<父组件ref属性名>.$children[0]获取-->
<template>
	<div class="base-table">
		<el-table
			size="mini"
			border
			highlight-current-row
			element-loading-text="Loading"
			:ref="tableRef"
			:row-key="rowKey"
			:data="data"
			:empty-text="emptyText"
			:header-cell-style="{background:'#fafafa',fontWeight:'normal',color:'#000'}"
			:max-height="maxHeight"
			:indent="24"
			:expand-row-keys="expandKeys"
			v-loading="listLoading"
			v-bind="$attrs"
			v-on="$listeners"
			@selection-change="selectionChange"
			@current-change="currentChange"
		>
			<!--过滤数据项，不能设置固定定位-->
			<!--如果是树形结构，则不设置，设置了会有问题-->
			<el-table-column v-if="!isTree" align="left" width="30" class-name="table-filter-cell">
				<template slot="header">
					<el-dropdown :hide-on-click="false" trigger="click" size="mini" placement="top-end">
						<span class="el-dropdown-link">
							<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item
								class="table-dropdown-item"
								v-for="(column, index) in _columns"
								:key="index"
							>
								<el-checkbox
									v-model="column.filterHidden"
									:checked="true"
									@change="changeHidden(column)"
								>{{column.label}}</el-checkbox>
							</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>

			<!--多选-->
			<el-table-column v-if="type==='checkbox'" type="selection" width="46" reserve-selection></el-table-column>

			<template v-for="(column, index) in _columns">
				<!--正常表头(不需要处理)-->
				<el-table-column
					v-if="isCommonTableColumn(column) && !column.hidden"
					:key="index"
					v-bind="column || {}"
					show-overflow-tooltip
				>
					<template slot="header">
						<span :title="column.label">{{column.label}}</span>
					</template>
					<!--处理二级表头-->
					<template v-if="column.children">
						<el-table-column
							v-for="(col, i) in column.children"
							:key="i"
							v-bind="col || {}"
							show-overflow-tooltip
						>
							<template slot="header">
								<span :title="col.label">{{col.label}}</span>
							</template>
						</el-table-column>
					</template>
				</el-table-column>

				<el-table-column v-else-if="!column.hidden" :key="index" v-bind="column || {}">
					<template slot="header">
						<span :title="column.label">{{column.label}}</span>
					</template>
					<template v-slot="scope">
						<!--插槽/作用域插槽(Vue2.6+)-->
						<!--eg.<template v-slot:testSlot="{scope}" >-->
						<span v-if="column.slotRow">
							<slot :name="column.prop" :scope="scope" />
						</span>

						<!--操作图标-->
						<div v-else-if="column.operations && column.operations.length" class="column-operations">
							<div
								class="operations-item"
								v-for="(operation,i) in column.operations.filter(item=>!item.hidden)"
								:key="operation.name"
							>
								<template>
									<el-button
										size="mini"
										type="text"
										@click.native="handleOperation(operation, scope.row)"
										:disabled="operation.disabled&&operation.disabled(operation, scope.row)"
									>{{operation.formatter?operation.formatter(operation, scope.row):operation.name}}</el-button>
								</template>

								<el-divider
									v-if="i<column.operations.filter(item=>!item.hidden).length-1"
									direction="vertical"
								></el-divider>
							</div>
						</div>

						<!--表单元素-->
						<div v-else-if="column.formRow">
							<ValidationObserver>
								<base-form-item
									:index="scope.$index"
									:item="{...column,label:null}"
									size="mini"
									v-model="scope.row[column.prop]"
								></base-form-item>
							</ValidationObserver>
						</div>
					</template>
				</el-table-column>
			</template>
		</el-table>

		<!--表格底部-->
		<div class="flex-x table-bottom">
			<!--分页组件-->
			<el-pagination
				v-if="api&&showPagination"
				:small="!pagLayout.match('sizes')"
				:current-page="pagination.currentPage"
				:page-sizes="pagination.pageSizes"
				:page-size="pagination.pageSize"
				:total="pagination.total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:layout="pagLayout"
			>
				<el-button ref="pagination-button" size="mini" type="primary" plain @click="jumpToPage">跳转</el-button>
			</el-pagination>

			<!--表格底部的操作按钮组-->
			<div v-if="operationList && operationList.length" class="operations">
				<template v-for="(operation,index) in operationList">
					<el-button
						v-if="!operation.hidden"
						size="mini"
						:key="index"
						:type="operation.type||''"
						@click.native="handleOperation(operation)"
					>{{operation.name}}</el-button>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
	const tableRef = Symbol("table"); //保证每个实例有独一无二的标志位
	export default {
		name: "base-table",
		props: {
			columns: {
				// 表格列
				type: Array,
				default: () => [],
				required: true
			},
			api: {
				//查询接口
				type: String,
				default: ""
			},
			type: {
				//checkbox-多选 默认不是多选
				type: String,
				default: ""
			},
			operationList: {
				// 操作按钮组
				type: Array
			},
			searchModel: {
				// 搜索条件
				type: Object,
				default: null
			},
			tableData: {
				//表格数据
				default: null
			},
			showPagination: {
				//是否显示分页
				type: Boolean,
				default: true
			},
			isTree: {
				//是否树形表格
				type: Boolean,
				default: false
			},
			delApi: {
				//批量删除时调用的api地址，如果不写，则默认使用查询接口的api地址
				type: String,
				default: ""
			},
			searchClear: {
				//查询条件改变时，是否清空已选择的行，默认清空
				type: Boolean,
				default: true
			},
			immediate: {
				//是否立即调接口
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				tableRef, //表格的ref
				data: [], //表格数据
				selectionRow: null, //多选选中的对象组
				radioRow: null, //单选选择的对象
				specialColumnList: ["slotRow", "operations", "formRow"], //特殊的列
				listLoading: false, //loading标识
				pagination: {
					//分页的配置项
					currentPage: 1, //当前页
					total: 0, //总条数
					pageSize: 20, //一页查询多少条
					pageSizes: [10, 20, 50, 100] //一页查询多少条的下拉框
				},
				paginationLayout: "total, sizes, prev, pager, next, jumper, slot", //分页展示的元素
				maxHeight: "auto", //表格的最大高度
				expandKeys: [] //如果是树形表格，默认展开的层
			};
		},
		watch: {
			searchModel: {
				//如果搜索条件改变，则重新调接口获取数据
				handler(val) {
					// console.log("searchModel:", val);
					this.pagination.currentPage = 1;
					if (this.searchClear) {
						this.clearSelectedRow();
					}
					this.$nextTick(() => {
						this.getTableData();
					});
				},
				deep: true
			},
			api: {
				//如果查询接口的api改变，则重新调接口获取数据
				handler(val) {
					// console.log("api:",val)
					if (val) {
						this.refreshTable();
					}
				},
				deep: true
			},
			tableData: {
				//可以在父组件中自定义设置data
				handler() {
					if (this.tableData) {
						this.data = this.tableData;
					}
				},
				deep: true,
				immediate: true
			}
		},
		mounted() {
			//如果是立即执行，则初始化调用接口
			if (this.immediate) {
				this.init();
			}

			//设置高度
			if (this.$attrs["max-height"]) {
				//如果传了最大高度，则设置为传进来的高度
				this.maxHeight = this.$attrs["max-height"];
			} else {
				this.$nextTick(() => {
					
					let limitH = document.querySelector("#app").clientHeight * 0.5;//最小的高度为整个页面的一半

					let parent =this.$refs[tableRef].$el.offsetParent;
					let contentH = parent.clientHeight;//父层的高度
					
					let topH = this.$refs[tableRef].$el.offsetTop;//距离父层顶部的高度
					let bottomH = 50;//底部分页的高度
					
					let maxHeight = contentH - topH - bottomH;//表格的高度= 父层的高度-距离顶部的高度-底部的高度
					
					this.maxHeight = Math.max(limitH, maxHeight);//在最小高度和表格高度中选一个较大值
				});
			}
		},
		computed: {
			emptyText() {
				return this.$attrs["empty-text"] || "暂无数据";
			},
			rowKey() {
				return this.$attrs["row-key"] || "index";
			},
			pagLayout() {
				return this.$attrs["pagLayout"] || this.paginationLayout;
			},
			_columns() {
				if (this.columns && this.columns.length) {
					this.columns.map(column => {
						Object.keys(column).map(key => {
							if (key === "operations") {
								if (column["fixed"] === undefined) {
									column["fixed"] = "right";
								}
							}
						});
					});
				}
				return this.columns || [];
			}
		},
		methods: {
			//初始化
			init() {
				this.getTableData();
			},
			// 判断是否是一个常规的table-column
			isCommonTableColumn(column) {
				return !this.specialColumnList.some(option => column[option]);
			},
			handleOperation(operation, row) {
				//点击操作按钮触发的事件
				let { event, isSelection, isRadio } = operation;

				//多选事件的判断
				if (isSelection && (!this.selectionRow || !this.selectionRow.length)) {
					this.TOOL.message("error", "请先选择数据!");
					return false;
				}

				//单选事件的判断
				if (isRadio && !this.radioRow) {
					this.TOOL.message("error", "请先选择一条数据!");
					return false;
				}

				if (event === "deleteRows") {
					//批量删除事件，可以统一处理
					if (this.selectionRow && this.selectionRow.length) {
						let ids = this.selectionRow.map(item => item[this.rowKey]);
						this.$confirm("确定删除选中数据吗?", "提示", {
							type: "warning"
						})
							.then(() => {
								this.API.del(this.delApi || this.api, ids).then(response => {
									if (response) {
										this.TOOL.message("success", "删除成功!");
										this.refreshTable();
									}
								});
							})
							.catch(() => {});
					}else{
						this.TOOL.message("error", "请先选择数据!");
					}
				} else {
					//如果是多选事件，则返回多选的行，如果是单选事件，则返回当前高度的行，默认返回当前高度的行
					let params = isSelection
						? this.selectionRow
						: isRadio
						? this.radioRow
						: row;
					this.$emit(event, params);
				}
			},
			handleSizeChange(val) {
				//当前查询条数改变
				this.pagination.pageSize = val;
				this.getTableData();
			},
			handleCurrentChange(val) {
				//当前页改变
				this.pagination.currentPage = val;
				this.getTableData();
			},
			jumpToPage() {
				//跳转
				this.$refs["pagination-button"].$el.blur();
			},
			getParams() {
				//处理查询参数
				let model = this.searchModel ? this.TOOL.clone(this.searchModel) : {};
				let params = model;
				let { currentPage, pageSize } = this.pagination;
				params.pageNum = currentPage;
				params.pageSize = pageSize;
				// console.log(params)
				return params;
			},
			getTableData() {
				//如果有api,则调用接口获取表格数据
				if (this.api) {
					let api = this.api;
					this.listLoading = true;
					this.API.get(api, this.getParams())
						.then(response => {
							this.listLoading = false;
							this.data =
								response.list !== undefined
									? response.list
									: response.records
									? response.records
									: response;
							this.pagination.total = response.total || response.rowCount;
							if (this.isTree) {
								this.expandKeys = this.data.map(item => item.value);
							}
							this.$emit("getData", this.data);
						})
						.catch(error => {
							this.listLoading = false;
						});
				}
			},
			clearSelectedRow() {
				//清空勾选和单选
				this.$refs[tableRef].clearSelection();
				this.$refs[tableRef].setCurrentRow();
			},
			refreshTable() {
				//刷新表格
				this.pagination.currentPage = 1;
				this.clearSelectedRow();
				// this.data = [];
				this.$nextTick(() => {
					this.getTableData();
				});
			},
			changeHidden(column) {
				//控制过滤的列隐藏
				column.hidden = !column.filterHidden;
			},
			setCurrentRow(row) {
				//设置单选的行
				this.$refs[tableRef].setCurrentRow(row);
			},
			toggleRowSelection(row, selected) {
				///设置该行是否选中
				this.$refs[tableRef].toggleRowSelection(row, selected);
			},
			selectionChange(rows) {
				//勾选的行改变事件
				this.selectionRow = rows;
				if (rows && rows.length) {
					this.setCurrentRow(rows[rows.length - 1]);
				}
			},
			currentChange(row) {
				//单选的行改变事件
				this.radioRow = row;
			}
		}
	};
</script>

<style lang="scss" scoped>
	.base-table {
		.column-operations {
			z-index: 999;
			position: relative;
			.operations-item {
				display: inline;
			}

			.el-dropdown-link {
				cursor: pointer;
				color: #409eff;
			}

			.el-icon-arrow-down {
				font-size: 12px;
			}
		}

		.table-bottom {
			white-space: nowrap;
			overflow-x: auto;
			justify-content: space-between;
			margin: 3px;
			.operations {
				padding: 3px;
			}

			.el-pagination {
				padding: 5px 0 3px 0;
				text-align: right;

				.el-button {
					margin-left: 5px;
					padding: 0 2px;
				}
			}
		}
	}
</style><style lang="scss">
	.el-tooltip__popper.is-dark {
		max-width: 200px;
	}

	.el-table__row {
		.base-form-item.el-form-item {
			min-width: 100%;
			margin-bottom: 0;
		}
	}
	.table-filter-cell {
		background: #fafafa;
		.cell {
			padding: 0 !important;
			.el-dropdown {
				padding-left: 0;
				padding-right: 0;
				line-height: 16px;
				.el-dropdown-link {
					padding: 10px 6px 10px 3px;
					i {
						cursor: pointer;
					}
				}
			}
		}
	}
	.base-table {
		.el-form-item__content {
			line-height: 30px;
			.el-input--mini .el-input__inner {
				height: 23px;
				line-height: 23px;
			}
		}
		.table-bottom {
			.el-pagination {
				.el-pagination__total {
					margin-right: 0px;
				}
				.el-pagination__sizes {
					margin: 0;
				}
				.el-select .el-input {
					width: 88px !important;
					.el-input__inner {
						padding-right: 18px;
					}
				}
				.btn-prev,
				.btn-next {
					padding-right: 5px !important;
					padding-left: 5px !important;
				}
				.el-pager li {
					min-width: 18px;
				}
				.el-pagination__jump {
					margin-left: 5px;
				}
			}
		}
	}
</style>
