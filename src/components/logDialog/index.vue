<template>
	<base-dialog ref="dialog" v-model="_visible" :title="title" width="50%">
		<base-table ref="table" :api="api" :columns="columns" :searchModel="searchModel"></base-table>
	</base-dialog>
</template>

<script>
	export default {
		name: "circulation",
		props: {
			visible: {
				//是否可见
				type: Boolean,
				default: false
      },
      searchModel:{
        type: Object,
        default: () => {},
      }
		},
		model: {
			prop: "visible",
			event: "on-model-change"
		},
		computed: {
			_visible: {
				get() {
					return this.visible;
				},
				set() {
					this.$emit("on-model-change", false);
				}
			}
    },
		data() {
			return {
        api: "/log",
        title:"流转信息",
				columns: [
					{
						prop: "userName",
						label: "用户名"
					},
					{
						prop: "operationTime",
						label: "时间"
					},
					{
						prop: "description",
						label: "描述",
						formatter(row, column, cellValue) {
							return cellValue == "10" ? "通过" : "驳回";
						}
					},
					{
						prop: "opinion",
						label: "意见"
					}
				]
			}
		}
	};
</script>
