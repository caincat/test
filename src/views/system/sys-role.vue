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
		title: "角色管理",
		data() {
			return {
				search: {
					model: {},
					items: [
						{
							prop: "name",
							label: "角色名称"
						}
					]
				},
				table: {
					type: "checkbox",
					api: "/roles",
					rowKey: "id",
					searchModel: {},
					columns: [
						{
							prop: "id",
							label: "角色编号"
						},
						{
							prop: "name",
							label: "角色名称"
						},
						{
							prop: "lable",
							label: "标签"
						},
						{
							prop: "description",
							label: "角色说明",
							tag: "textarea",
							notsearch: true
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
					api: "/role",
					event: "",
					title: "角色信息",
					model: {},
					items: [
						{
							prop: "name",
							label: "角色名称",
							rule: "required"
						},
						{
							prop: "lable",
							label: "标签",
							rule: "required"
						},
						{
							prop: "description",
							label: "角色说明",
							tag: "textarea"
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
