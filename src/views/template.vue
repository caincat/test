<template>
	<div>
		<el-button size="small" type="primary" @click="dialog.visible=true">打开弹窗</el-button>

		<!--基础搜索组件-->
		<base-search ref="search" :model="search.model" :items="search.items" @clickSearch="clickSearch"></base-search>

		<!--基础表格组件-->
		<base-table
			ref="table"
			:row-key="table.rowKey"
			:api="table.api"
			:data="table.data"
			:type="table.type"
			:columns="table.columns"
			:operationList="table.operationList"
			:searchModel="table.searchModel"
			@add="add"
			@edit="edit"
			@view="view"
			@selectionEvent="selectionEvent"
			@radioEvent="radioEvent"
			@showlogDialog="showlogDialog"
		>
			<template v-slot:slotName="{scope}">
				<el-link type="primary">{{scope.row.name}}</el-link>
			</template>
		</base-table>

		<!--基础表单组件-->
		<base-form
			ref="form"
			v-model="form.visible"
			:api="form.api"
			:event="form.event"
			:title="form.title"
			:items="form.items"
			:model="form.model"
			:operationList="form.operationList"
			@validateEvent="validateEvent"
			@formEvent="formEvent"
		></base-form>

		<base-dialog
			ref="dialog"
			v-model="dialog.visible"
			:title="dialog.title"
			:operationList="dialog.operationList"
			:fullscreen="dialog.fullscreen"
			@dialogEvent="dialogEvent"
		>
			<p>弹窗自定义内容</p>
		</base-dialog>
		<!--流转信息-->
		<logDialog v-model="logDialog.visible" :searchModel="logDialog.searchModel"></logDialog>
	</div>
</template>
<script>
	import logDialog from "@/components/logDialog";
	export default {
		title: "演示页面",
		components: {
			logDialog
		},
		data() {
			return {
				search: {
					model: {},
					items: [
						{
							prop: "name",
							label: "输入框"
						},
						{
							prop: "select",
							label: "下拉选择",
							tag: "select",
							attrs: {
								options: [
									{
										label: "选项一",
										value: "1"
									},
									{
										label: "选项二",
										value: "2"
									},
									{
										label: "选项三",
										value: "3"
									}
								]
							}
						},
						{
							prop: "date",
							label: "日期",
							tag: "date"
						},
						{
							prop: "time",
							label: "时间",
							tag: "time"
						},
						// {
						// 	prop: "datetime",
						// 	label: "日期时间",
						// 	tag: "datetime"
						// },
						{
							prop: "startTime,endTime",
							label: "日期范围",
							tag: "daterange"
						},
						{
							prop: "departmentId",
							label: "树形选择",
							tag: "tree-select",
							attrs: {
								api: "/departments/tree"
							}
						},
						{
							prop: "id",
							label: "表格选择",
							tag: "table-select",
							attrs: {
								rowKey: "id",
								api: "/departments",
								getApi: "/department",
								defaultProps: {
									label: "name",
									value: "id"
								},
								searchItems: [
									{
										prop: "name",
										label: "名称"
									}
								],
								columns: [
									{
										prop: "id",
										label: "ID"
									},
									{
										prop: "name",
										label: "名称"
									}
								]
							},
							listeners: {
								rowchange: this.rowchange
							}
						}
					]
				},
				table: {
					type: "checkbox",
					api: "/departments",
					rowKey: "id",
					searchModel: {},
					columns: [
						{
							prop: "id",
							label: "ID"
						},
						{
							prop: "name",
							label: "名称"
						},
						{
							prop: "slotName", //插槽的自定义名称
							label: "slot列",
							slotRow: true //设置为true则开启插槽模式
						},
						{
							prop: "form",
							label: "表单列",
							formRow: true, //设置为true则开启表单模式
							tag: "input", //表单类型
							width: 150,
							attrs: {
								//表单的attrs
								disabled: false
							}
						},
						{
							label: "操作",
							width: 100,
							operations: [
								{
									name: "修改",
									event: "edit"
								},
								{
									name: "查看",
									event: "view"
								}
							]
						}
					],
					operationList: [
						{
							name: "新增",
							event: "add",
							type: "primary"
						},
						{
							name: "批量删除",
							event: "deleteRows", //批量删除事件
							type: "danger",
							isSelection: true
						},
						{
							name: "多选事件",
							event: "selectionEvent",
							type: "success",
							isSelection: true //设置为true则开启多选验证
						},
						{
							name: "单选事件",
							event: "radioEvent",
							type: "warning",
							isRadio: true //设置为true则开启单选验证
						},
						{
							name: "流转信息",
							event: "showlogDialog",
							type: "primary",
							isRadio: true
						}
					]
				},
				form: {
					visible: false,
					api: "/form",
					event: "",
					title: "表单信息",
					model: {},
					items: [
						{
							prop: "id",
							label: "id"
						},
						{
							prop: "name",
							label: "名称",
							rule: "required"
						},
						{
							prop: "no",
							label: "数字",
							tag: "number"
						},
						{
							prop: "description",
							label: "文本框",
							tag: "textarea"
						},
						{
							prop: "upperId",
							label: "树形选择",
							tag: "tree-select",
							attrs: {
								api: "/departments/tree"
							}
						},
						{
							prop: "select",
							label: "下拉选择",
							tag: "select",
							attrs: {
								options: [
									{
										label: "选项一",
										value: "1"
									},
									{
										label: "选项二",
										value: "2"
									},
									{
										label: "选项三",
										value: "3"
									}
								]
							}
						},
						{
							prop: "file",
							label: "文件",
							tag: "upload",
							rule: "required"
						}
					],
					operationList: [
						{
							name: "普通事件",
							event: "formEvent",
							type: ""
						},
						{
							name: "验证事件",
							event: "validateEvent",
							type: "success",
							isValidate: true //设置为true则开启表单验证
						}
					]
				},
				dialog: {
					visible: false,
					title: "弹窗",
					fullscreen: false,
					operationList: [
						{
							name: "弹窗事件",
							event: "dialogEvent"
						}
					]
				},
				logDialog: {
					visible: false,
					searchModel: {}
				}
			};
		},
		methods: {
			clickSearch(value) {
				console.log(value);
				this.table.searchModel = value;
			},
			add(row) {
				console.log(row);
				this.form.model = {};
				this.form.event = "add";
				this.form.visible = true;
			},
			edit(row) {
				console.log(row);
				this.form.model = { ...row };
				this.form.event = "edit";
				this.form.visible = true;
			},
			view(row) {
				console.log(row);
				this.form.model = { ...row };
				this.form.event = "view";
				this.form.visible = true;
			},
			radioEvent(row) {
				// console.log(row);
				this.TOOL.message("info", `${row.name}`);
			},
			selectionEvent(rows) {
				// console.log(rows);
				let names=rows.map(item=>item.name)
				this.TOOL.message("info", `${names}`);
			},
			showlogDialog(row) {
				console.log(row);
				//流转信息
				this.logDialog.searchModel = {
					masterId: row.id,
					type: "10"
				};
				this.logDialog.visible = true;
			},
			rowchange(value) {
				console.log(value);
			},
			validateEvent(model) {
				console.log(model);
				this.TOOL.message("info", "表单验证事件");
			},
			formEvent(model) {
				console.log(model);
				this.TOOL.message("info", "表单事件");
			},
			dialogEvent() {
				this.TOOL.message("info", "弹窗事件");
			}
		},
		mounted() {}
	};
</script>
