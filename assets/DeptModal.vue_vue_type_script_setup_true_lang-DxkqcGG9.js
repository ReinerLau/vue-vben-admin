var P=Object.defineProperty;var b=Object.getOwnPropertySymbols;var v=Object.prototype.hasOwnProperty,w=Object.prototype.propertyIsEnumerable;var g=(o,t,e)=>t in o?P(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e,h=(o,t)=>{for(var e in t||(t={}))v.call(t,e)&&g(o,e,t[e]);if(b)for(var e of b(t))w.call(t,e)&&g(o,e,t[e]);return o};var u=(o,t,e)=>new Promise((s,r)=>{var p=a=>{try{i(e.next(a))}catch(c){r(c)}},d=a=>{try{i(e.throw(a))}catch(c){r(c)}},i=a=>a.done?s(a.value):Promise.resolve(a.value).then(p,d);i((e=e.apply(o,t)).next())});import{a as x,B as D}from"./index-CZEGnDze.js";import{_ as M}from"./BasicForm.vue_vue_type_script_setup_true_lang-DjFyZLyL.js";import"./BasicForm.vue_vue_type_style_index_0_lang-Bt1fUfoo.js";import"./componentMap-9BLkLLoa.js";import{u as S}from"./useForm-CrIHx5sc.js";import{l as k,d as B,f as R,c as y,u as l,Z as F,a8 as T,a9 as q,k as C,ac as L}from"./vue-BjERyvPm.js";import{Q as V}from"./antd-BmrhB3rb.js";import{a as A}from"./system-Bw54GRMO.js";const H=[{title:"部门名称",dataIndex:"deptName",width:160,align:"left"},{title:"排序",dataIndex:"orderNo",width:50},{title:"状态",dataIndex:"status",width:80,customRender:({record:o})=>{const e=~~o.status===0,s=e?"green":"red",r=e?"启用":"停用";return k(V,{color:s},()=>r)}},{title:"创建时间",dataIndex:"createTime",width:180},{title:"备注",dataIndex:"remark"}],J=[{field:"deptName",label:"部门名称",component:"Input",colProps:{span:8}},{field:"status",label:"状态",component:"Select",componentProps:{options:[{label:"启用",value:"0"},{label:"停用",value:"1"}]},colProps:{span:8}}],G=[{field:"deptName",label:"部门名称",component:"Input",required:!0},{field:"parentDept",label:"上级部门",component:"TreeSelect",ifShow({values:o}){const{deptName:t,parentDept:e}=o;return e||!t&&!e},componentProps:{fieldNames:{label:"deptName",value:"id"},getPopupContainer:()=>document.body},required:!0},{field:"orderNo",label:"排序",component:"InputNumber",required:!0},{field:"status",label:"状态",component:"RadioButtonGroup",defaultValue:"0",componentProps:{options:[{label:"启用",value:"0"},{label:"停用",value:"1"}]},required:!0},{label:"备注",field:"remark",component:"InputTextArea"}],K=B({name:"DeptModal",__name:"DeptModal",emits:["success","register"],setup(o,{emit:t}){const e=t,s=R(!0),[r,{resetFields:p,setFieldsValue:d,updateSchema:i,validate:a}]=S({labelWidth:100,baseColProps:{span:24},schemas:G,showActionButtonGroup:!1}),[c,{setModalProps:m,closeModal:_}]=x(n=>u(this,null,function*(){p(),m({confirmLoading:!1}),s.value=!!(n!=null&&n.isUpdate),l(s)&&d(h({},n.record));const f=yield A();i({field:"parentDept",componentProps:{treeData:f}})})),I=y(()=>l(s)?"编辑部门":"新增部门");function N(){return u(this,null,function*(){try{const n=yield a();m({confirmLoading:!0}),_(),e("success")}finally{m({confirmLoading:!1})}})}return(n,f)=>(F(),T(l(D),L(n.$attrs,{onRegister:l(c),title:I.value,onOk:N}),{default:q(()=>[C(l(M),{onRegister:l(r)},null,8,["onRegister"])]),_:1},16,["onRegister","title"]))}});export{K as _,H as c,J as s};
