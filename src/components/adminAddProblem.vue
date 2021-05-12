<template>
  <div v-if="reload">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>添加问题</span>
      </div>
      <div class="text item">
        <el-form label-position="top" label-width="70px"
                 :model="addProblem"  @submit.native.prevent>
          <el-row :gutter="20">
            <el-col :span="10">
              <el-form-item prop="displayId" label="显示ID(必填)">
                <el-input v-model="addProblem.displayId" @blur="isExit()"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item prop="title" label="题目名称(必填)"  >
                <el-input v-model="addProblem.title"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item prop="content" label="描述(必填)"  >
                <Simditor v-model="addProblem.content"></Simditor>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item prop="inputDesc" label="输入描述(必填)"  >
                <Simditor v-model="addProblem.inputDesc"></Simditor>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item prop="outputDesc" label="输出描述(必填)"  >
                <Simditor v-model="addProblem.outputDesc"></Simditor>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="时间限制ms(必填)" prop="maxCpuTime"  >
                <el-input type="Number" v-model="addProblem.maxCpuTime"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="内存限制MB(必填)" prop="maxMemory"  >
                <el-input type="Number" v-model="addProblem.maxMemory"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="难度(必填)"  prop="level">
                <el-select class="level-select" size="small" v-model="addProblem.level">
                  <el-option label="低" value="1"></el-option>
                  <el-option label="中" value="2"></el-option>
                  <el-option label="高" value="3"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="togetherCard">
            <h3 class="boderH3">标签(必填)</h3>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="选定标签区"  >
                  <div class="tagCard">
                    <el-tag
                      closable
                      :key="item.label"
                      v-for="item in addProblem.labelId"
                      :value="item.id"
                      :disable-transitions="false"
                      @close="closeTag(item.id)"
                    >
                      {{item.label}}
                    </el-tag>
                  </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="可选标签区">
                <div class="tagCard pointer">
                  <!--为自定义组件绑定原生事件必须使用.native修饰符，否则失效，button不需要-->
                  <el-tag
                    :key="item.label"
                    v-for="item in tagArr"
                    :value="item.id"
                    :disable-transitions="false"
                    @click.native="selectTag({label:item.label,id:item.id})"
                    >
                    {{item.label}}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增标签</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          </div>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="输入样例">
              <el-input
                :rows="5"
                type="textarea" v-model="addProblem.inputSample">
              </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="输出样例">
              <el-input
                :rows="5"
                type="textarea"
                v-model="addProblem.outputSample"
              >
              </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="提示">
            <Simditor v-model="addProblem.hint"></Simditor>
          </el-form-item>
          <el-form-item>
            <span class="label">代码模板</span>
            <el-switch
              @change="temSwitchChange"
              v-model="isTemplateSwitch"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <el-form-item v-if="isTemplateSwitch">
            <!--<el-select v-model="selectedTemLanguage" clearable @change="templateLanChange()" @clear="clearTemplateLan"-->
                       <!--placeholder="选择代码模板的编程语言" size="small" style="width: 200px;margin: 5px">-->
              <!--<el-option-->
                <!--v-for="item in templateLanguages"-->
                <!--:key="item"-->
                <!--:value="item">-->
              <!--</el-option>-->
            <!--</el-select>-->
            <el-checkbox-group @change="templateLanChange()" v-model="addProblem.language" :max="1">
              <el-checkbox label="C"></el-checkbox>
              <el-checkbox label="CPP"></el-checkbox>
              <el-checkbox label="JAVA"></el-checkbox>
              <el-checkbox label="Python"></el-checkbox>
            </el-checkbox-group>
            <codemirror :value.sync="codeValue" :options="options" ref="addProblemEditor1">
            </codemirror>
          </el-form-item>
          <el-row :gutter="20" v-else>
            <el-col :span="24">
              <el-form-item label="可选语言编程语言(必填)"  >
                <el-checkbox-group v-model="addProblem.language">
                  <el-checkbox label="C"></el-checkbox>
                  <el-checkbox label="CPP"></el-checkbox>
                  <el-checkbox label="JAVA"></el-checkbox>
                  <el-checkbox label="Python"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="测试用例(必填)"  prop="test">
                <el-upload
                  class="upload-demo"
                  action="#"
                  :http-request="onUploadChange"
                  accept=".zip"
                  :on-preview="handlePreview"
                  :file-list="fileList">
                  <el-button size="small" type="plain">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="footerToolBar">
           <el-button type="primary" size="medium" @click="save()" class="longButton">新增</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
  import Simditor from '../components/Simditor'
  import {getLabelData,addProblem,addLabelApi,isExitDisplayId,uploadTest} from '../../../api/oj'
  import store from '@/store'
  import { codemirror } from 'vue-codemirror'
  import {cTemplate,cppTemplate,others} from "../../../utils/codeTemplate"
  // theme
  import 'codemirror/theme/monokai.css'
  import 'codemirror/theme/solarized.css'
  import 'codemirror/theme/material.css'
  // mode
  import 'codemirror/mode/clike/clike.js'
  import 'codemirror/mode/python/python.js'
  // active-line.js
  import 'codemirror/addon/selection/active-line.js'
  // foldGutter
  import 'codemirror/addon/fold/foldgutter.css'
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/indent-fold.js'
  export default {
    name:'adminAddProblem',
    components:{
      Simditor,
      codemirror,
    },
    inject:['reload'],
    data(){
      return{
        addProblem: {
          acnum:0,
          displayId: null,
          title: null,
          editorId:store.getters.id,
          content: null,
          inputDesc: null,
          outputDesc: null,
          maxCpuTime: 1000,
          maxMemory: 250,
          level: null,
          status: 1,
          labelId:[],
          inputSample: null,
          language:[],
          outputSample: null,
          hint: null,
          type:1,
          template:null,
        },
        isTemplateSwitch:false,
        selectedTemLanguage:null,
        exitLanguages:['C','CPP','JAVA','Python'],
        fileList:[],
        required:true,
        inputVisible: false,
        inputValue: '',
        tagArr:[],
        options: {
          // codemirror options
          tabSize: 4,
          mode: 'text/x-csrc',
          theme: 'solarized',
          lineNumbers: true,
          // lineSeparator:'\\n',
          line: true,
          // 代码折叠
          foldGutter: true,
          gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
          // 选中文本自动高亮，及高亮方式
          styleSelectedText: true,
          lineWrapping: true,
          highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true}
        },
        codeValue:null,
      }
    },
    methods:{
      //displayId是否重复
      isExit(){
        isExitDisplayId({displayId:this.addProblem.displayId}).then(res=>{
          console.log(res);
          if(res.status==200){
            if(res.data){
                console.log('id重复');
            }
          }else{
            self.$message({
              message: '系统错误',
              type: 'error'
            });
          }
        }).catch(err=>{
          self.$message({
            message: '系统错误',
            type: 'error'
          });
        })
      },
      //文件上传方法
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      //文件上传
      onUploadChange(file){
        //console.log(file);
        let self=this;
        let fileData=new FormData();
        //传file会错误，应传file.file
        fileData.append('file',file.file);
        fileData.append('displayId',self.addProblem.displayId);
        uploadTest(fileData).then(res=>{
          if(res.status==200&&res.data.code==0){
            this.$notify({
              title: '成功',
              message: '文件上传成功',
              type: 'success',
              position:'bottom-left',
              duration:1500,
              showClose:false,
            });
          }else{
            self.$message({
              message: '系统错误，文件上传失败',
              type: 'error'
            });
          }
        }).catch(err=>{
          self.$message({
            message: '系统错误，文件上传失败',
            type: 'error'
          });
        })
      },

      changeCheck(){
        console.log(this);
        console.log(this.addProblem.language);
      },
      selectTag(e){
        this.addProblem.labelId.push(e);
      },
      //问题新增
      save(){
              let self=this;
              //将labelId数组处理成字符串给后台
              if(self.addProblem.labelId) {
                let containerArr = [];
                containerArr[0] = "";
                for (let i = 0; i < self.addProblem.labelId.length; i++) {
                  containerArr[i + 1] = self.addProblem.labelId[i].id;
                }
                containerArr[containerArr.length] = '';
                self.addProblem.labelId = containerArr.toString();
              }
              //将选择的language数组处理成字符串
              self.addProblem.language[self.addProblem.language.length] = '';
              self.addProblem.language = self.addProblem.language.toString();

              if(self.addProblem.type==1){
                self.addProblem.template=null;
              }else{
                self.addProblem.template=self.$refs.addProblemEditor1.content;
              }

              addProblem(self.addProblem).then(res=>{
                if(res.status==200&&res.data.code==0){
                  self.$message({
                    message: '增加题目成功',
                    type: 'success',
                    duration:2000,
                  });
                  self.reload();
                }else{
                  self.$message({
                    message: '系统错误，增加题目失败',
                    type: 'error'
                  });
                }
              }).catch(err=>{
                self.$message({
                  message: '系统错误，增加题目失败',
                  type: 'error'
                });
              });
      },
      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        let self=this;
        if (inputValue) {
          this.tagArr.push({label:inputValue,id:0});
          //终于被我遇到回调地狱了！！！以下被注释的两个异步请求就是回调地狱，因为你不知道是哪个异步请求先完成。
          // this.addLabel({label:inputValue,id:0});
          // this.getLabel();

          //使用promise解决
          let promise=new Promise(function (resolve,reject) {
             self.inputVisible = false;
              self.inputValue = '';
              self.addLabel({label:inputValue,id:0});
              resolve();
              //console.log(1);
          }).then(function (value) {
              self.getLabel();
              //console.log(2);
          });
        }
        //先执行了下面的同步执行，再执行上面的异步执行this.addLabel
        //console.log('同步执行');
        // this.inputVisible = false;
        // this.inputValue = '';
      },
      getLabel(){
        let self=this;
        getLabelData().then(res=>{
          if(res.status==200&&res.data.code==0){
            // console.log('获取标签数据');
            // console.log(res);
            self.tagArr=[...res.data.data];
          }else{
            self.$message({
              message: '系统错误,标签数据空',
              type: 'error'
            });
          }
        }).catch(err=>{
          self.$message({
            message: '系统错误,标签数据空',
            type: 'error'
          });
        });
      },
       addLabel(label){
         addLabelApi(label).then(res=>{
           if(res.status==200&&res.data.code==0){
             //console.log(res);
           }else{
             self.$message({
               message: '系统错误，添加标签失败',
               type: 'error'
             });
           }

        }).catch(err=>{
           self.$message({
             message: '系统错误，添加标签失败',
             type: 'error'
           });
        })
      },
      closeTag(id){
          let index,self=this;
          for( let i=0;i<self.addProblem.labelId.length;i++){
              if(self.addProblem.labelId[i].id==id){
                  index=i;
                  break;
              }
          }
          self.addProblem.labelId.splice(index,1);
      },
      templateLanChange(){
          if(!this.isTemplateSwitch){
              this.addProblem.type=1;
          }else{
            this.addProblem.type=2;
            if(this.addProblem.language[0]=='C'){
              // console.log(this.cTemplate);this.cTemplate为undefined，import进来的变量直接用，不属于当前的实体
              this.codeValue=cTemplate;
            }else if(this.addProblem.language[0]=='CPP'){
              this.codeValue=cppTemplate;
            }else{
              //this.codeValue=null报错
              this.codeValue=others;
            }
            //特别奇怪的是this.$refs.addProblemEditor1.content无效都表示为空值，但在save函数里面就有效
            // this.addProblem.template=this.$refs.addProblemEditor1.content;
            // console.log(this.addProblem.template);
          }
      },
      temSwitchChange(){
        this.problemDetail.language=[];
      },
      clearTemplateLan(){
        this.codeValue='';
        this.addProblem.type=1;
      }
    },
    created(){
      this.getLabel();
    },
  }
</script>
<style scoped>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 96%;
    margin: 0 auto;
    margin-bottom: 10px;
  }
  .tagCard{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border: 1px solid #EBEEF5;
    margin: 0 10px;
    padding: 20px 10px;
  }
  .togetherCard{
    border: 1px solid #EBEEF5;
    padding:0px 15px;
  }
  .boderH3{
    border-bottom: 1px solid #EBEEF5;
  }
  .tagButton{
    background-color: #ecf5ff;
    height: 32px;
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    color: #409eff;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    margin: 3px;
    outline:none;
    cursor: pointer;
  }
  .pointer{
    cursor: pointer;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .footerToolBar{
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .longButton{
    width: 300px;
  }
  .label{
    font-size: 14px;
    color: #606266;
    font-weight: 700;
  }
</style>
