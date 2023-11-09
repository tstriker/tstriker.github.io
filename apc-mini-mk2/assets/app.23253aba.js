var pt=Object.defineProperty;var ft=(s,n,t)=>n in s?pt(s,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[n]=t;var S=(s,n,t)=>(ft(s,typeof n!="symbol"?n+"":n,t),t);import{u as nt,o as mt,c as _t,a as Z,t as gt,d as kt,b as xt,m as U,e as wt,f as Ct,i as Mt,g as H,h as yt,R as St,j as bt,k as vt,C as Pt,l as At,s as Dt,n as Bt,p as Rt,q as Et,v as Ot,w as $t,x as jt,y as Nt,z as Tt,A as Ft,B as It,D as Vt}from"./chunks/framework.2d9ebef7.js";import{f as rt,B as ot,c as _,A as lt,b as qt}from"./chunks/APC.9ecbd7d2.js";class O{constructor(){S(this,"handlers",{})}render(){return[]}}function q(s){return Math.floor(Math.random()*s)}class zt extends O{constructor(){super();S(this,"handlers",{arrowUp:{toggled:!0,noteon:()=>this.setDirection(0,-1)},arrowDown:{toggled:!0,noteon:()=>this.setDirection(0,1)},arrowLeft:{toggled:!0,noteon:()=>this.setDirection(-1,0)},arrowRight:{toggled:!0,noteon:()=>this.setDirection(1,0)}});this.frame=0,this.direction=[1,0],this.snake=[[4,4]],this.head=[4,4],this.snakeLength=2,this.snakeColor="#ffffff",this.fruitColor=null,this.fruit=null,this.speed=.05,this.placeFruit()}placeFruit(){let[t,e]=this.head;[t,e]=[Math.trunc(t),Math.trunc(e)];let r=this.snake.map(([o,l])=>`${o}${l}`);for(;r.indexOf(`${t}${e}`)!=-1;)[t,e]=[q(8),q(8)];this.fruit=[t,e],this.fruitColor=q(127)+1}setDirection(t,e){(this.direction[0]+t!=0||this.direction[1]+e!=0)&&(this.direction=[t,e])}moveSnake(){let t=this.head[0]+this.direction[0]*this.speed,e=this.head[1]+this.direction[1]*this.speed,r=Math.round(t)!=Math.round(this.head[0])||Math.round(e)!=Math.round(this.head[1]);this.head=[(t+8)%8,(e+8)%8],r&&(t=(Math.round(t)+8)%8,e=(Math.round(e)+8)%8,this.snake.push([t,e]),t==this.fruit[0]&&e==this.fruit[1]&&(this.snakeLength=Math.min(this.snakeLength+.2,6),this.speed+=.003,this.snakeColor=this.fruitColor,this.placeFruit()),this.snake.length>this.snakeLength&&this.snake.splice(0,this.snake.length-Math.trunc(this.snakeLength)))}render(){let t=(r,o)=>`${Math.trunc(r)},${Math.trunc(o)}`,e=Object.fromEntries(rt(0,0,8,8,0).map(r=>[t(r.x,r.y),r]));this.moveSnake();for(let r of this.snake)e[t(...r)]={x:r[0],y:r[1],color:this.snakeColor};return e[t(...this.fruit)]={x:this.fruit[0],y:this.fruit[1],color:this.fruitColor},Object.values(e)}}class Lt extends O{constructor(t){super();S(this,"handlers",{noteon:t=>{t.button.type=="rgb"&&(this.mode=="colors"?this.mode=t.button.color:(this.mode="colors",this.selectedCallback(t.button.color,t)),this.renderPadColors())},noteoff:t=>{},volume:{toggled:!1}});this.selectedCallback=t,this.padColors=[],this.mode="colors",this.renderPadColors()}renderPadColors(){let t=[],e=64,r=this.mode=="colors"?null:_(this.mode).hsl()[0];for(let o=0;o<e;o++){let l;this.mode=="colors"?(r=360*o/e,l=_.hsl(r,1,.5)):l=_.hsl(r,1,o/e),t.push({idx:o,color:l.hex()})}this.padColors=t}render(){return this.padColors}}class Ut extends O{constructor(){super();S(this,"handlers",{noteon:t=>{if(t.button.type=="rgb"){let[e,r]=[t.button.x,t.button.y];if([e,r]=[e-this.x,r-this.y],t.shiftKey){console.log("Eeeeeeeeeeeeeeee we are here"),this.currentColor=this.pixelBoard(e,r).color||0;return}this.pixelBoard(e,r).color=this.currentColor}},volume:{toggled:!0,noteon:t=>{t.mk2.setState(this.colorPicker)}},arrowUp:{toggled:!0,noteon:()=>this.y+=1},arrowDown:{toggled:!0,noteon:()=>this.y-=1},arrowLeft:{toggled:!0,noteon:()=>this.x+=1},arrowRight:{toggled:!0,noteon:()=>this.x-=1}});this.currentColor="#ffffff",this.pixelBoard=ot(),this.x=0,this.y=0,this.colorPicker=new Lt((t,e)=>{this.currentColor=t||this.currentColor,e.mk2.setState(this)})}render(){var r;let t=[],e=_.hsl(_(this.currentColor).hsl()[0],1,.02).hex();for(let o=0;o<8;o++)for(let l=0;l<8;l++){let i=((r=this.pixelBoard(l-this.x,o-this.y))==null?void 0:r.color)||e;t.push({x:l,y:o,color:i})}return t}}function z(s){return .0031308>=s?12.92*s:1.055*Math.pow(s,.4166666666666667)-.055}function Ht(s){return .04045<s?Math.pow((s+.055)/1.055,2.4):s/12.92}function Gt(s,n,t){let e=.4122214708*s+.5363325363*n+.0514459929*t,r=.2119034982*s+.6806995451*n+.1073969566*t,o=.0883024619*s+.2817188376*n+.6299787005*t,l=Math.cbrt(e),i=Math.cbrt(r),a=Math.cbrt(o);return[.2104542553*l+.793617785*i-.0040720468*a,1.9779984951*l-2.428592205*i+.4505937099*a,.0259040371*l+.7827717662*i-.808675766*a]}function it(s,n,t){let e=s+.3963377774*n+.2158037573*t,r=s-.1055613458*n-.0638541728*t,o=s-.0894841775*n-1.291485548*t,l=e*e*e,i=r*r*r,a=o*o*o;return[4.0767416621*l-3.3077115913*i+.2309699292*a,-1.2684380046*l+2.6097574011*i-.3413193965*a,-.0041960863*l-.7034186147*i+1.707614701*a]}function Kt(s){const e=1.170873786407767;return(s*s+.206*s)/(e*(s+.03))}function Xt(s,n){let t,e,r,o,l,i,a,d;-1.88170328*s-.80936493*n>1?(t=1.19086277,e=1.76576728,r=.59662641,o=.75515197,l=.56771245,i=4.0767416621,a=-3.3077115913,d=.2309699292):1.81444104*s-1.19445276*n>1?(t=.73956515,e=-.45954404,r=.08285427,o=.1254107,l=.14503204,i=-1.2684380046,a=2.6097574011,d=-.3413193965):(t=1.35733652,e=-.00915799,r=-1.1513021,o=-.50559606,l=.00692167,i=-.0041960863,a=-.7034186147,d=1.707614701);let c=t+e*s+r*n+o*s*s+l*s*n,h=.3963377774*s+.2158037573*n,u=-.1055613458*s-.0638541728*n,p=-.0894841775*s-1.291485548*n;{let f=1+c*h,m=1+c*u,g=1+c*p,k=f*f*f,x=m*m*m,w=g*g*g,v=3*h*f*f,P=3*u*m*m,A=3*p*g*g,D=6*h*h*f,B=6*u*u*m,R=6*p*p*g,y=i*k+a*x+d*w,M=i*v+a*P+d*A,E=i*D+a*B+d*R;c=c-y*M/(M*M-.5*y*E)}return c}function G(s,n){let t=Xt(s,n),e=it(1,t*s,t*n),r=Math.cbrt(1/Math.max(Math.max(e[0],e[1]),e[2])),o=r*t;return[r,o]}function Yt(s,n,t,e,r,o=null){o||(o=G(s,n));let l;if((t-r)*o[1]-(o[0]-r)*e<=0)l=o[1]*r/(e*o[0]+o[1]*(r-t));else{l=o[1]*(r-1)/(e*(o[0]-1)+o[1]*(r-t));{let i=t-r,a=e,d=.3963377774*s+.2158037573*n,c=-.1055613458*s-.0638541728*n,h=-.0894841775*s-1.291485548*n,u=i+a*d,p=i+a*c,f=i+a*h;{let m=r*(1-l)+l*t,g=l*e,k=m+g*d,x=m+g*c,w=m+g*h,v=k*k*k,P=x*x*x,A=w*w*w,D=3*u*k*k,B=3*p*x*x,R=3*f*w*w,y=6*u*u*k,M=6*p*p*x,E=6*f*f*w,K=4.0767416621*v-3.3077115913*P+.2309699292*A-1,j=4.0767416621*D-3.3077115913*B+.2309699292*R,ut=4.0767416621*y-3.3077115913*M+.2309699292*E,X=j/(j*j-.5*K*ut),N=-K*X,Y=-1.2684380046*v+2.6097574011*P-.3413193965*A-1,T=-1.2684380046*D+2.6097574011*B-.3413193965*R,ct=-1.2684380046*y+2.6097574011*M-.3413193965*E,J=T/(T*T-.5*Y*ct),F=-Y*J,Q=-.0041960863*v-.7034186147*P+1.707614701*A-1,I=-.0041960863*D-.7034186147*B+1.707614701*R,dt=-.0041960863*y-.7034186147*M+1.707614701*E,W=I/(I*I-.5*Q*dt),V=-Q*W;N=X>=0?N:1e6,F=J>=0?F:1e6,V=W>=0?V:1e6,l+=Math.min(N,Math.min(F,V))}}}return l}function Jt(s,n,t){t||(t=G(s,n));let e=t[0],r=t[1];return[r/e,r/(1-e)]}function Qt(s,n,t){const e=G(n,t);let r=Yt(n,t,s,1,s,e),o=Jt(n,t,e),l=.11516993+1/(7.4477897+4.1590124*t+n*(-2.19557347+1.75198401*t+n*(-2.13704948-10.02301043*t+n*(-4.24894561+5.38770819*t+4.69891013*n)))),i=.11239642+1/(1.6132032-.68124379*t+n*(.40370612+.90148123*t+n*(-.27087943+.6122399*t+n*(.00299215-.45399568*t-.14661872*n)))),a=r/Math.min(s*o[0],(1-s)*o[1]),d;{let h=s*l,u=(1-s)*i;d=.9*a*Math.sqrt(Math.sqrt(1/(1/(h*h*h*h)+1/(u*u*u*u))))}let c;{let h=s*.4,u=(1-s)*.8;c=Math.sqrt(1/(1/(h*h)+1/(u*u)))}return[c,d,r]}function Wt(s,n,t){if(t==1)return[255,255,255];if(t==0)return[0,0,0];let e=Math.cos(2*Math.PI*s),r=Math.sin(2*Math.PI*s),o=Kt(t),l=Qt(o,e,r),i=l[0],a=l[1],d=l[2],c,h,u,p,f;n<.8?(h=1.25*n,u=0,p=.8*i,f=1-p/a):(h=5*(n-.8),u=a,p=.2*a*a*1.25*1.25/i,f=1-p/(d-a)),c=u+h*p/(1-f*h);let m=it(o,c*e,c*r);return[255*z(m[0]),255*z(m[1]),255*z(m[2])]}function L(s,n,t){let e=Zt(s/360,n/100,t/100);return _.oklab(...e).hex()}function Zt(s,n,t){if(t==1)return[1,0,0];if(t==0)return[0,0,0];const r=Wt(s,n,t).map(o=>Ht(o/255));return Gt(...r)}function te(s,n,t){return{hue:new Array(16).fill("").map((e,r)=>L(r/15*360,n,t)),lightness:new Array(16).fill("").map((e,r)=>L(s,n||1,r/15*100)),saturation:new Array(16).fill("").map((e,r)=>L(s,r/15*100,t))}}let C=null,tt="rainbow";function et(s,n){C=C||[{name:"rainbow",state:new at},{name:"ok-lab",state:new ee},{name:"radial",state:new se},{name:"diamond",state:new ne}];let e=(C.map(r=>r.name).indexOf(tt)+n+C.length)%C.length;tt=C[e].name,s.mk2.setState(C[e].state)}class $ extends O{constructor(){super();S(this,"handlers",{arrowLeft:{toggled:!0,noteon:t=>et(t,-1)},arrowRight:{toggled:!0,noteon:t=>et(t,1)}});this.currentState="rainbow"}nextState(t){C.map(e=>e.name)}}class at extends ${render(){let n=[],t=64;for(let e=0;e<t;e++){let r=360*e/t,o=_.hsl(r,1,.5);n.push({idx:e,color:o.hex()})}return n}}class ee extends ${constructor(){super();let n=te(0,100,55).hue;this.okLab=_.scale(n)}render(){let n=[],t=64;for(let e=0;e<t;e++){let r=this.okLab(e/t);n.push({idx:e,color:r.hex()})}return n}}class se extends ${constructor(){super(),this.angle=0}render(){let n=[],t=64,e=3.5,r=3.5,o=2;for(let l=0;l<t;l++){let i=l%8,a=7-Math.trunc(l/8),d=e-i,c=r-a,h=Math.atan2(d,c)*180/Math.PI;h=(h+this.angle)%360;let u=(d*d+c*c)/(Math.pow(3.7,2)*o),p=_.hsl(h,1,(1-Math.pow(u,.3))*.9);n.push({x:i,y:a,color:p.hex()})}return this.angle+=1,n}}class ne extends ${constructor(){super(),this.angle=0}render(n){let t=[],e=64,r=3.5,o=3.5,l=16;for(let i=0;i<e;i++){let a=i%8,d=7-Math.trunc(i/8),c=Math.abs(r-a),h=Math.abs(o-d),u=c+h+this.angle;u=u%l/l;let p=360-360/(e+1),f=_.hsl(u*p,1,.5-Math.max(n.fader8.value,.02)*.5);t.push({x:a,y:d,color:f.hex()})}return this.angle+=.05,t}}function re(s){return Math.floor(Math.random()*s)}class oe extends O{constructor(){super(),this.board=ot(rt(0,0,8,8,"#000000")),this.drops={},this.hue=50}render(){let n=()=>({pos:Math.random()*-3,tail:3+re(5),speed:.01+Math.random()*.1});for(let t=0;t<8;t++){this.drops[t]||(this.drops[t]=n());let e=this.drops[t];e.pos+=e.speed,e.pos>=7+e.tail+1&&(this.drops[t]=n());for(let r=0;r<=e.tail+1;r++){let o=Math.trunc(e.pos-r),l=(1-r/e.tail)*.3;r==0?l=e.pos%1*.4:r==e.tail.length-1?l=(1-e.pos%1)*.4:r==e.tail.length&&(l=0);let i=_.hsl(this.hue,1,l).hex();o>=0&&o<=7&&(this.board(t,o).color=i)}}return this.hue=(this.hue+.1)%360,this.board.pixels}}const le={class:"page-container"},ie={style:{display:"flex"}},ae={name:"LayoutBase",components:{APC:lt},data(){return{mk2:U(new qt),states:U({paint:new Ut,snake:new zt,rainbow:new at,rain:new oe}),pixels:[]}},methods:{onNote(s){let n={clipStop:()=>this.mk2.setState(this.states.paint),solo:()=>this.mk2.setState(this.states.snake),mute:()=>this.mk2.setState(this.states.rainbow),recArm:()=>this.mk2.setState(this.states.rain)};n[s.key]&&n[s.key]()}},async mounted(){window.addEventListener("noteon",this.onNote),await this.mk2.connect({sysex:!0,beforePaint:()=>{this.pixels=this.mk2.pixels}}),this.mk2.setState(this.states.paint),this.mk2.clipStopButton.toggled=!0,this.mk2.soloButton.toggled=!0,this.mk2.muteButton.toggled=!0},beforeUnmount(){window.removeEventListener("noteon",this.onNote),this.mk2.disconnect()}},he=Object.assign(ae,{setup(s){const{site:n,frontmatter:t}=nt();return(e,r)=>(mt(),_t("div",le,[Z("h1",null,gt(kt(n).title),1),Z("div",ie,[xt(lt,{pixels:e.pixels},null,8,["pixels"])])]))}});/*!
 * pinia v2.1.7
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */const ue=Symbol();var st;(function(s){s.direct="direct",s.patchObject="patch object",s.patchFunction="patch function"})(st||(st={}));function ce(){const s=wt(!0),n=s.run(()=>Ct({}));let t=[],e=[];const r=U({install(o){r._a=o,o.provide(ue,r),o.config.globalProperties.$pinia=r,e.forEach(l=>t.push(l)),e=[]},use(o){return!this._a&&!Mt?e.push(o):t.push(o),this},_p:t,_a:null,_e:s,_s:new Map,state:n});return r}const de={Layout:he,enhanceApp({app:s,router:n,siteData:t}){const e=ce();s.use(e)}};function ht(s){if(s.extends){const n=ht(s.extends);return{...n,...s,async enhanceApp(t){n.enhanceApp&&await n.enhanceApp(t),s.enhanceApp&&await s.enhanceApp(t)}}}return s}const b=ht(de),pe=$t({name:"VitePressApp",setup(){const{site:s}=nt();return jt(()=>{Nt(()=>{document.documentElement.lang=s.value.lang,document.documentElement.dir=s.value.dir})}),Tt(),Ft(),It(),b.setup&&b.setup(),()=>Vt(b.Layout)}});async function fe(){const s=_e(),n=me();n.provide(St,s);const t=bt(s.route);return n.provide(vt,t),n.component("Content",Pt),n.component("ClientOnly",At),Object.defineProperties(n.config.globalProperties,{$frontmatter:{get(){return t.frontmatter.value}},$params:{get(){return t.page.value.params}}}),b.enhanceApp&&await b.enhanceApp({app:n,router:s,siteData:Dt}),{app:n,router:s,data:t}}function me(){return Bt(pe)}function _e(){let s=H,n;return Rt(t=>{let e=Et(t),r=null;return e&&(s&&(n=e),(s||n===e)&&(e=e.replace(/\.js$/,".lean.js")),r=Ot(()=>import(e),[])),H&&(s=!1),r},b.NotFound)}H&&fe().then(({app:s,router:n,data:t})=>{n.go().then(()=>{yt(n.route,t.site),s.mount("#app")})});export{fe as createApp};
