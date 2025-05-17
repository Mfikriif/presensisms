import{r as c}from"./app-BUGKuYZp.js";let T={data:""},F=e=>typeof window=="object"?((e?e.querySelector("#_goober"):window._goober)||Object.assign((e||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:e||T,_=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,H=/\/\*[^]*?\*\/|  +/g,A=/\n+/g,b=(e,t)=>{let a="",s="",o="";for(let r in e){let n=e[r];r[0]=="@"?r[1]=="i"?a=r+" "+n+";":s+=r[1]=="f"?b(n,r):r+"{"+b(n,r[1]=="k"?"":t)+"}":typeof n=="object"?s+=b(n,t?t.replace(/([^,])+/g,i=>r.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,l=>/&/.test(l)?l.replace(/&/g,i):i?i+" "+l:l)):r):n!=null&&(r=/^--/.test(r)?r:r.replace(/[A-Z]/g,"-$&").toLowerCase(),o+=b.p?b.p(r,n):r+":"+n+";")}return a+(t&&o?t+"{"+o+"}":o)+s},y={},P=e=>{if(typeof e=="object"){let t="";for(let a in e)t+=a+P(e[a]);return t}return e},L=(e,t,a,s,o)=>{let r=P(e),n=y[r]||(y[r]=(l=>{let d=0,u=11;for(;d<l.length;)u=101*u+l.charCodeAt(d++)>>>0;return"go"+u})(r));if(!y[n]){let l=r!==e?e:(d=>{let u,f,m=[{}];for(;u=_.exec(d.replace(H,""));)u[4]?m.shift():u[3]?(f=u[3].replace(A," ").trim(),m.unshift(m[0][f]=m[0][f]||{})):m[0][u[1]]=u[2].replace(A," ").trim();return m[0]})(e);y[n]=b(o?{["@keyframes "+n]:l}:l,a?"":"."+n)}let i=a&&y.g?y.g:null;return a&&(y.g=y[n]),((l,d,u,f)=>{f?d.data=d.data.replace(f,l):d.data.indexOf(l)===-1&&(d.data=u?l+d.data:d.data+l)})(y[n],t,s,i),n},U=(e,t,a)=>e.reduce((s,o,r)=>{let n=t[r];if(n&&n.call){let i=n(a),l=i&&i.props&&i.props.className||/^go/.test(i)&&i;n=l?"."+l:i&&typeof i=="object"?i.props?"":b(i,""):i===!1?"":i}return s+o+(n??"")},"");function j(e){let t=this||{},a=e.call?e(t.p):e;return L(a.unshift?a.raw?U(a,[].slice.call(arguments,1),t.p):a.reduce((s,o)=>Object.assign(s,o&&o.call?o(t.p):o),{}):a,F(t.target),t.g,t.o,t.k)}let I,N,z;j.bind({g:1});let h=j.bind({k:1});function q(e,t,a,s){b.p=t,I=e,N=a,z=s}function v(e,t){let a=this||{};return function(){let s=arguments;function o(r,n){let i=Object.assign({},r),l=i.className||o.className;a.p=Object.assign({theme:N&&N()},i),a.o=/ *go\d+/.test(l),i.className=j.apply(a,s)+(l?" "+l:"");let d=e;return e[0]&&(d=i.as||e,delete i.as),z&&d[0]&&z(i),I(d,i)}return t?t(o):o}}var R=e=>typeof e=="function",O=(e,t)=>R(e)?e(t):e,Y=(()=>{let e=0;return()=>(++e).toString()})(),M=(()=>{let e;return()=>{if(e===void 0&&typeof window<"u"){let t=matchMedia("(prefers-reduced-motion: reduce)");e=!t||t.matches}return e}})(),Z=20,S=(e,t)=>{switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,Z)};case 1:return{...e,toasts:e.toasts.map(r=>r.id===t.toast.id?{...r,...t.toast}:r)};case 2:let{toast:a}=t;return S(e,{type:e.toasts.find(r=>r.id===a.id)?1:0,toast:a});case 3:let{toastId:s}=t;return{...e,toasts:e.toasts.map(r=>r.id===s||s===void 0?{...r,dismissed:!0,visible:!1}:r)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(r=>r.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let o=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(r=>({...r,pauseDuration:r.pauseDuration+o}))}}},k=[],D={toasts:[],pausedAt:void 0},x=e=>{D=S(D,e),k.forEach(t=>{t(D)})},B={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},G=(e={})=>{let[t,a]=c.useState(D);c.useEffect(()=>(k.push(a),()=>{let o=k.indexOf(a);o>-1&&k.splice(o,1)}),[t]);let s=t.toasts.map(o=>{var r,n,i;return{...e,...e[o.type],...o,removeDelay:o.removeDelay||((r=e[o.type])==null?void 0:r.removeDelay)||(e==null?void 0:e.removeDelay),duration:o.duration||((n=e[o.type])==null?void 0:n.duration)||(e==null?void 0:e.duration)||B[o.type],style:{...e.style,...(i=e[o.type])==null?void 0:i.style,...o.style}}});return{...t,toasts:s}},J=(e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(a==null?void 0:a.id)||Y()}),E=e=>(t,a)=>{let s=J(t,e,a);return x({type:2,toast:s}),s.id},p=(e,t)=>E("blank")(e,t);p.error=E("error");p.success=E("success");p.loading=E("loading");p.custom=E("custom");p.dismiss=e=>{x({type:3,toastId:e})};p.remove=e=>x({type:4,toastId:e});p.promise=(e,t,a)=>{let s=p.loading(t.loading,{...a,...a==null?void 0:a.loading});return typeof e=="function"&&(e=e()),e.then(o=>{let r=t.success?O(t.success,o):void 0;return r?p.success(r,{id:s,...a,...a==null?void 0:a.success}):p.dismiss(s),o}).catch(o=>{let r=t.error?O(t.error,o):void 0;r?p.error(r,{id:s,...a,...a==null?void 0:a.error}):p.dismiss(s)}),e};var K=(e,t)=>{x({type:1,toast:{id:e,height:t}})},Q=()=>{x({type:5,time:Date.now()})},w=new Map,V=1e3,W=(e,t=V)=>{if(w.has(e))return;let a=setTimeout(()=>{w.delete(e),x({type:4,toastId:e})},t);w.set(e,a)},X=e=>{let{toasts:t,pausedAt:a}=G(e);c.useEffect(()=>{if(a)return;let r=Date.now(),n=t.map(i=>{if(i.duration===1/0)return;let l=(i.duration||0)+i.pauseDuration-(r-i.createdAt);if(l<0){i.visible&&p.dismiss(i.id);return}return setTimeout(()=>p.dismiss(i.id),l)});return()=>{n.forEach(i=>i&&clearTimeout(i))}},[t,a]);let s=c.useCallback(()=>{a&&x({type:6,time:Date.now()})},[a]),o=c.useCallback((r,n)=>{let{reverseOrder:i=!1,gutter:l=8,defaultPosition:d}=n||{},u=t.filter(g=>(g.position||d)===(r.position||d)&&g.height),f=u.findIndex(g=>g.id===r.id),m=u.filter((g,C)=>C<f&&g.visible).length;return u.filter(g=>g.visible).slice(...i?[m+1]:[0,m]).reduce((g,C)=>g+(C.height||0)+l,0)},[t]);return c.useEffect(()=>{t.forEach(r=>{if(r.dismissed)W(r.id,r.removeDelay);else{let n=w.get(r.id);n&&(clearTimeout(n),w.delete(r.id))}})},[t]),{toasts:t,handlers:{updateHeight:K,startPause:Q,endPause:s,calculateOffset:o}}},ee=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,te=h`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,ae=h`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,re=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${ee} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${te} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${ae} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,oe=h`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,ie=v("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${oe} 1s linear infinite;
`,se=h`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,ne=h`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,le=v("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${se} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${ne} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,de=v("div")`
  position: absolute;
`,ce=v("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,ue=h`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,pe=v("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${ue} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,me=({toast:e})=>{let{icon:t,type:a,iconTheme:s}=e;return t!==void 0?typeof t=="string"?c.createElement(pe,null,t):t:a==="blank"?null:c.createElement(ce,null,c.createElement(ie,{...s}),a!=="loading"&&c.createElement(de,null,a==="error"?c.createElement(re,{...s}):c.createElement(le,{...s})))},fe=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,ge=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,ye="0%{opacity:0;} 100%{opacity:1;}",he="0%{opacity:1;} 100%{opacity:0;}",be=v("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ve=v("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,xe=(e,t)=>{let a=e.includes("top")?1:-1,[s,o]=M()?[ye,he]:[fe(a),ge(a)];return{animation:t?`${h(s)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${h(o)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},we=c.memo(({toast:e,position:t,style:a,children:s})=>{let o=e.height?xe(e.position||t||"top-center",e.visible):{opacity:0},r=c.createElement(me,{toast:e}),n=c.createElement(ve,{...e.ariaProps},O(e.message,e));return c.createElement(be,{className:e.className,style:{...o,...a,...e.style}},typeof s=="function"?s({icon:r,message:n}):c.createElement(c.Fragment,null,r,n))});q(c.createElement);var Ee=({id:e,className:t,style:a,onHeightUpdate:s,children:o})=>{let r=c.useCallback(n=>{if(n){let i=()=>{let l=n.getBoundingClientRect().height;s(e,l)};i(),new MutationObserver(i).observe(n,{subtree:!0,childList:!0,characterData:!0})}},[e,s]);return c.createElement("div",{ref:r,className:t,style:a},o)},$e=(e,t)=>{let a=e.includes("top"),s=a?{top:0}:{bottom:0},o=e.includes("center")?{justifyContent:"center"}:e.includes("right")?{justifyContent:"flex-end"}:{};return{left:0,right:0,display:"flex",position:"absolute",transition:M()?void 0:"all 230ms cubic-bezier(.21,1.02,.73,1)",transform:`translateY(${t*(a?1:-1)}px)`,...s,...o}},ke=j`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,$=16,Oe=({reverseOrder:e,position:t="top-center",toastOptions:a,gutter:s,children:o,containerStyle:r,containerClassName:n})=>{let{toasts:i,handlers:l}=X(a);return c.createElement("div",{id:"_rht_toaster",style:{position:"fixed",zIndex:9999,top:$,left:$,right:$,bottom:$,pointerEvents:"none",...r},className:n,onMouseEnter:l.startPause,onMouseLeave:l.endPause},i.map(d=>{let u=d.position||t,f=l.calculateOffset(d,{reverseOrder:e,gutter:s,defaultPosition:t}),m=$e(u,f);return c.createElement(Ee,{id:d.id,key:d.id,onHeightUpdate:l.updateHeight,className:d.visible?ke:"",style:m},d.type==="custom"?O(d.message,d):o?o(d):c.createElement(we,{toast:d,position:u}))}))},je=p;export{Oe as D,je as k};
