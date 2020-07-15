<template>
	<el-upload
		size="mini"
		ref="elUpload"
		class="base-upload"
		action
		:on-change="handleChange"
		:on-remove="handleRemove"
		:file-list="fileList"
		:auto-upload="false"
		:disabled="$attrs.disabled || $attrs.readonly"
		:accept="$attrs.accept"
	>
		<el-input
			style="vertical-align: baseline;"
			size="mini"
			slot="trigger"
			v-model="name"
			:placeholder="$attrs.placeholder"
			@input="inputchange"
		>
			<el-button slot="append" icon="el-icon-folder-opened"></el-button>
		</el-input>
	</el-upload>
</template>

<script>
	export default {
		name: "base-upload",
		props: {
			value: {
				default: ""
			},
			downloadUrl: {
				//下载文件的api
				default: ""
			},
			fileName: {
				//文件名称
				default: ""
			}
		},
		model: {
			prop: "value",
			event: "on-model-change"
		},
		data() {
			return {
				fileList: [],
				name: ""
			};
		},
		created() {
			//初始化时，如果有文件地址和文件名，则下载文件
			if (this.downloadUrl && this.fileName) {
				this.API.get(this.downloadUrl, null, {
					responseType: "blob"
				}).then(response => {
					let file = {
						name: this.fileName,
						size: response.size,
						raw: response
					};
					this.fileList = [file];
				});
			}
		},
		watch: {
			fileList: {
				handler(value) {
					if (this.fileList && this.fileList.length) {
						this.name = this.fileList[0].name;
						this.$emit("on-model-change", this.fileList[0]);
					} else {
						this.name = "";
						this.$emit("on-model-change", null);
					}
					// console.log(this.fileList[0])
				},
				deep: true
			}
		},
		methods: {
			handleRemove(file, fileList) {
				this.fileList = fileList;
			},
			handleChange(file, fileList) {
				if (fileList.length > 1) {
					this.fileList = fileList.slice(-1);
				} else {
					this.fileList = fileList;
				}
			},
			inputchange(value) {
				if (!value) {
					//如果清空了输入框，则清空文件
					this.fileList = [];
				}
			}
		}
	};
</script>

<style lang="scss">
	.base-upload {
		.el-upload {
			width: 100%;
		}
		.el-upload-list {
			.el-upload-list__item:first-child {
				margin-top: 0;
			}
		}
	}
</style>
