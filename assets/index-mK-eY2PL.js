import{u}from"./useContextMenu-Bh0HeV2Y.js";import{C as i,a as m}from"./entry/index-CHn6ZzU4.js";import{P as d}from"./index-BA5_XCe3.js";import{d as b,a7 as f,Z as _,a8 as C,a9 as e,k as n,u as o,G as r}from"./vue-BjERyvPm.js";import"./antd-BmrhB3rb.js";import"./useContentViewHeight-Beswmh0e.js";import"./useWindowSizeFn-DgnuQ21I.js";import"./onMountedOrActivated-DcvTUt7V.js";const P=b({__name:"index",setup(x){const[l]=u(),{createMessage:a}=m();function c(t){l({event:t,items:[{label:"New",icon:"bi:plus",handler:()=>{a.success("click new")}},{label:"Open",icon:"bx:bxs-folder-open",handler:()=>{a.success("click open")}}]})}function p(t){l({event:t,items:[{label:"New",icon:"bi:plus",children:[{label:"New1-1",icon:"bi:plus",divider:!0,children:[{label:"New1-1-1",handler:()=>{a.success("click new")}},{label:"New1-2-1",disabled:!0}]},{label:"New1-2",icon:"bi:plus"}]}]})}return(t,h)=>{const s=f("a-button");return _(),C(o(d),{title:"右键菜单示例"},{default:e(()=>[n(o(i),{title:"Simple"},{default:e(()=>[n(s,{type:"primary",onContextmenu:c},{default:e(()=>[r(" Right Click on me ")]),_:1})]),_:1}),n(o(i),{title:"Multiple",class:"mt-4"},{default:e(()=>[n(s,{type:"primary",onContextmenu:p},{default:e(()=>[r(" Right Click on me ")]),_:1})]),_:1})]),_:1})}}});export{P as default};
