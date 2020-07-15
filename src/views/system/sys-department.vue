<template>
	<div>
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
		></base-table>

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
		></base-form>
	</div>
</template>
<script>
	export default {
		title: "部门管理",
		data() {
			return {
				search: {
					model: {},
					items: [
						{
							prop: "departmentId",
							label: "上级部门",
							tag: "tree-select",
							attrs: {
								api: "/departments/tree"
							}
						},
						{
							prop: "name",
							label: "部门名称"
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
							prop: "corpName",
							label: "公司名称"
						},
						{
							prop: "upperName",
							label: "上级部门名称"
						},
						{
							prop: "name",
							label: "部门名称"
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
						}
					]
				},
				form: {
					visible: false,
					api: "/department",
					event: "",
					title: "部门信息",
					model: {},
					items: [
						{
							prop: "corpId",
							label: "公司名称",
							tag: "select",
							attrs: {
								api: "/corps",
								defaultProps: {
									label: "corpName",
									value: "corpId"
								}
							}
						},
						{
							prop: "upperId",
							label: "上级部门",
							tag: "tree-select",
							attrs: {
								api: "/departments/tree"
							}
						},
						{
							prop: "name",
							label: "部门名称",
							rule: "required"
						}
					],
					operationList: []
				}
			};
		},
		methods: {
			clickSearch(value) {
				//点击搜索按钮
				this.table.searchModel = value;
			},
			add(row) {
				//新增
				this.form.model = {};
				this.form.event = "add";
				this.form.visible = true;
			},
			edit(row) {
				//编辑
				console.log(row);
				this.form.model = { ...row };
				this.form.event = "edit";
				this.form.visible = true;
			},
			view(row) {
				//查看
				console.log(row);
				this.form.model = { ...row };
				this.form.event = "view";
				this.form.visible = true;
			}
		},
		mounted() {}
	};
</script>
