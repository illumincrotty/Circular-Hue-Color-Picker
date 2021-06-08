var e={primary:"var(--_1qbbvv70)",secondary:"var(--_1qbbvv71)",accent:"var(--_1qbbvv72)",secondaryAccent:"var(--_1qbbvv73)",text:"var(--_1qbbvv74)",width:"var(--_1qbbvv75)",themeLightness:"var(--_1qbbvv76)"};const t=e=>`hsl(${Math.floor(e.hue)},${Math.floor(e.saturation)}%,${Math.floor(e.lightness)}%)`;const s=(e,t)=>{let s=-1;return(...i)=>{s&&window.clearTimeout(s),s=window.setTimeout((()=>{e(...i)}),t)}},i=(e,t)=>{let s,i=!0,n=!1;const o=()=>{e(...s)},l=()=>{window.setTimeout((()=>{o(),n?(n=!1,l()):i=!0}),t)};return(...e)=>{if(s=e,i)return i=!1,o(),void l();n||(n=!0)}},n=class{constructor(s,o,l){this.state=l,this.name="handle",this.active=!1,this.locked={hue:!1,saturation:!1,lightness:!1},this.color={hue:0,saturation:0,lightness:50},this.dimensions={offset:-1,functionalRad:-1,touchOffsetX:-1,touchOffsetY:-1},this.remove=()=>{this.handle.remove()},this.up=()=>{this.active=!1},this.down=(e,t)=>{this.setDimensions(e),this.active=!0,this.click(t)},this.click=e=>{this.updateFromPosition(e instanceof MouseEvent?this.calcPosMouse(e):this.calcPosTouch(e))},this.unthrottledMove=e=>{this.active&&this.click(e)},this.moving=i(this.unthrottledMove,30),this.unthrottledTouchMove=e=>{if(e.preventDefault(),this.active){const t=e.targetTouches[0].clientX-this.dimensions.touchOffsetX,s=e.targetTouches[0].clientY-this.dimensions.touchOffsetY;this.updateFromPosition({x:t-this.dimensions.offset,y:s-this.dimensions.offset})}},this.touchMoving=i(this.unthrottledTouchMove,30),this.select=()=>{console.log("selecting"),console.log(this),this.handle.focus(),this.handle.style.setProperty("--scaleFactor","1.2"),this.handle.style.setProperty("--borderColor",`${e.text}`)},this.deselect=()=>{console.log("deselecting"),console.log(this),this.handle.style.removeProperty("--scale"),this.handle.style.setProperty("--scaleFactor","1"),this.handle.style.removeProperty("--borderColor")},this.updateFromColor=e=>{this.updateHelper(this.colorToPoints(e))},this.updateFromPosition=e=>{this.update(this.colorToPoints(n.polarToColor((e=>({theta:Math.atan2(e.y,e.x),radius:Math.hypot(e.x,e.y)}))(e),this.dimensions.functionalRad,this.color.lightness)))},this.colorToPoints=e=>{this.locked.hue&&(e.hue=this.color.hue),this.locked.saturation&&(e.saturation=this.color.saturation),this.locked.lightness&&(e.lightness=this.color.lightness);return[(e=>({x:e.radius*Math.cos(e.theta),y:e.radius*Math.sin(e.theta)}))(n.colorToPolarCoordinates(e,this.dimensions.functionalRad)),e]},this.updateColor=e=>{this.color=e,this.handle.style.backgroundColor=t(e)},this.updatePosition=e=>{this.handle.style.setProperty("--handleXOffset",`${e.x}`),this.handle.style.setProperty("--handleYOffset",`${e.y}`)},this.handle=document.createElement("div"),this.handle.classList.add("_1qbbvv7i"),this.id=o,this.select(),s.appendChild(this.handle),this.updateColor(this.color)}logState(){console.log(this)}setDimensions(e){const t=this.handle.getBoundingClientRect().width/2,s=parseFloat(getComputedStyle(this.handle).borderTopWidth.slice(0,-2)),i=e.getBoundingClientRect(),n=parseFloat(getComputedStyle(e).borderTopWidth.slice(0,-2));this.dimensions.offset=i.width/2,this.dimensions.functionalRad=this.dimensions.offset-n-t+s,this.dimensions.touchOffsetX=i.x,this.dimensions.touchOffsetY=i.y}calcPosMouse(e){return{x:e.clientX-this.dimensions.touchOffsetX-this.dimensions.offset,y:e.clientY-this.dimensions.touchOffsetY-this.dimensions.offset}}calcPosTouch(e){return{x:e.targetTouches[0].clientX-this.dimensions.touchOffsetX-this.dimensions.offset,y:e.targetTouches[0].clientY-this.dimensions.touchOffsetY-this.dimensions.offset}}update(e){this.state.color={type:"full",value:this.updateHelper(e),source:"wheel"}}updateHelper(e){return this.updateColor(e[1]),this.updatePosition(e[0]),e[1]}};let o=n;o.colorToPolarCoordinates=(e,t)=>{var s,i,n;return{theta:null!=(n=e.hue-90,s=n*(Math.PI/180))?s:0,radius:null!=(i=Math.min(e.saturation/100*t,t))?i:0}},o.polarToColor=(e,t,s)=>{return{hue:(i=e.theta,(180*i/Math.PI+360+90)%360),saturation:Math.min(e.radius,t)/t*100,lightness:s};var i};class l{constructor(e,t){this.state=t,this.children=[],this.touchEnabled=!0,this.name="wheel",this.maxColors=5,this.selectedHandle=-1,this.addAndRemoveColorButton=()=>{this.addColor=document.createElement("button"),this.addColor.innerHTML='<svg role="img" viewBox="0 0 24 24" style="fill-rule: evenodd; clip-rule: evenodd;" class="colorPicker-svg-button"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12S0 18.623 0 12 5.377 0 12 0zm0 2.767c5.096 0 9.233 4.137 9.233 9.233 0 5.096-4.137 9.233-9.233 9.233-5.096 0-9.233-4.137-9.233-9.233 0-5.096 4.137-9.233 9.233-9.233z"></path><path d="M10.5 10.5V6.9a1.5 1.5 0 013 0v.01-.01 3.6h3.6a1.5 1.5 0 010 3h-.01.01-3.6v3.6a1.5 1.5 0 01-3 0v-.01.01-3.6H6.9a1.5 1.5 0 010-3h.01-.01 3.6z"></path></svg>',this.addColor.classList.add("_1qbbvv79","_1qbbvv7a","_1qbbvv7j"),this.addColor.style.right="0",this.remColor=document.createElement("button"),this.remColor.classList.add("_1qbbvv79","_1qbbvv7a","_1qbbvv7j"),this.remColor.innerHTML='<svg role="img" viewBox="0 0 24 24" style="fill-rule: evenodd; clip-rule: evenodd;" class="colorPicker-svg-button"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12S0 18.623 0 12 5.377 0 12 0zm0 2.767c5.096 0 9.233 4.137 9.233 9.233 0 5.096-4.137 9.233-9.233 9.233-5.096 0-9.233-4.137-9.233-9.233 0-5.096 4.137-9.233 9.233-9.233zM6.9 10.5h10.2c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5h-.01.01H6.9c-.828 0-1.5-.672-1.5-1.5s.672-1.5 1.5-1.5h.01-.01z"></path></svg>',this.remColor.style.left="0",this.remColor.style.transform="translate(-25%,25%)",this.remColor.disabled=!0,this.wheel.appendChild(this.remColor),this.wheel.appendChild(this.addColor)},this.down=e=>{if(e.stopImmediatePropagation(),!(e.target instanceof SVGElement)){if(e.target!==this.wheel&&e.target!==this.children[this.selectedHandle].handle){const t=this.findHandle(e.target);this.state.selected=t,-1===t&&console.error("Selected element Not found")}this.children[this.selectedHandle].down(this.wheel,e)}},this.up=()=>{this.children[this.selectedHandle].up()},this.out=()=>{this.children[this.selectedHandle].active&&this.children[this.selectedHandle].up()},this.moving=e=>{e.preventDefault(),e.stopPropagation(),this.children[this.selectedHandle].moving(e)},this.throttledMove=i(this.moving,16),this.click=e=>{if(e.target instanceof SVGElement||e.target instanceof HTMLButtonElement){const t=e.target.closest("button");return t===this.addColor?void this.state.addColor():t===this.remColor?void this.state.removeColor():void 0}this.children[this.selectedHandle].click(e)},this.touchMoving=e=>{e.preventDefault(),this.children[this.selectedHandle].touchMoving(e)},this.deselectHandle=e=>{console.log(`deselecting handle #${e}`),void 0!==this.children[this.selectedHandle]&&(this.children[e].deselect(),this.children[e].handle.style.zIndex=this.children[e].id.toString())},this.selectHandle=e=>{console.log(`selecting handle #${e}`),this.children[e].select(),this.children[e].handle.style.zIndex=(this.children.length+5).toString()},this.findHandle=e=>{if(e instanceof o){return this.children.indexOf(e)}if(e instanceof HTMLElement){return this.children.reduce(((t,s,i)=>s.handle===e?i:t),-1)}return-1},this.wheel=document.createElement("div"),this.wheel.classList.add("_1qbbvv7h"),t.subscribe(this),this.wheel.addEventListener("mouseup",this.up),this.wheel.addEventListener("mouseleave",this.out),this.wheel.addEventListener("mousemove",this.moving),this.wheel.addEventListener("mousedown",this.down),this.wheel.addEventListener("click",this.click),this.addAndRemoveColorButton(),this.touchEnabled&&(this.wheel.addEventListener("touchstart",this.down),this.wheel.addEventListener("touchmove",this.touchMoving),this.wheel.addEventListener("touchend",this.up)),e.appendChild(this.wheel)}logState(){console.info("Logging state of Wheel"),console.info(this),console.group("logging handles"),console.info(this.children),console.groupEnd()}selectedChangeHandler(e){if("number"==typeof e)e!==this.selectedHandle&&(this.deselectHandle(this.selectedHandle),this.selectedHandle=e,this.selectHandle(e));else{if("new"===e)return void this.addHandle();if("delete"===e)return void this.removeHandle(this.selectedHandle)}}addHandle(){this.children.push(new o(this.wheel,this.children.length,this.state)),this.children.length>=2&&(this.remColor.disabled=!1),this.children.length>=this.maxColors&&(this.addColor.disabled=!0)}removeHandle(e){var t;this.children.length>1&&(null==(t=this.children[e])||t.remove(),this.children.splice(e,1),this.children.slice(e).forEach((e=>{e.id-=1})),this.children.length<=1&&(this.remColor.disabled=!0),this.children.length<=this.maxColors-1&&(this.addColor.disabled=!1))}colorChangeHandler(e){this.selectedHandle>=0&&this.children[this.selectedHandle].setDimensions(this.wheel),"wheel"!==(null==e?void 0:e.source)&&(this.wheel.style.setProperty(`${"var(--_1qbbvv7g)".slice(4,-1)}`,`${e.color.lightness}%`),this.children[this.selectedHandle].updateFromColor(e.color))}resizeHandler(){this.children.forEach((e=>{e.setDimensions(this.wheel)}))}maxColorChangeHandler(e){this.maxColors=e}}class h{constructor(e,t,s){this.name="slider",this.createRanges=(e,t)=>{this.ranges={hue:new r(this.sliderWrapper,e,t,{name:"hue",min:0,max:360,default:0}),saturation:new r(this.sliderWrapper,e,t,{name:"saturation",min:0,max:100,default:0}),lightness:new r(this.sliderWrapper,e,t,{name:"lightness",min:0,max:100,default:50})},this.ranges.hue.input.classList.add("_1c5ktpm3"),this.ranges.saturation.input.classList.add("_1c5ktpm4"),this.ranges.lightness.input.classList.add("_1c5ktpm5")},this.sliderWrapper=document.createElement("div"),this.sliderWrapper.classList.add("_1qbbvv78","_1c5ktpm1"),e.appendChild(this.sliderWrapper),s.subscribe(this),this.createRanges(t,s)}colorChangeHandler(e){if("slider"!==e.source)return this.ranges.hue.update(e.color.hue),this.ranges.saturation.input.style.setProperty("--hue",`${e.color.hue}`),this.ranges.lightness.input.style.setProperty("--hue",`${e.color.hue}`),this.ranges.saturation.update(e.color.saturation),this.ranges.hue.input.style.setProperty("--saturation",`${e.color.saturation}%`),this.ranges.lightness.input.style.setProperty("--saturation",`${e.color.saturation}%`),this.ranges.lightness.update(e.color.lightness),this.ranges.hue.input.style.setProperty("--lightness",`${e.color.lightness}%`),void this.ranges.saturation.input.style.setProperty("--lightness",`${e.color.lightness}%`)}logState(){console.info(this),console.group("ranges"),console.info(this.ranges),console.groupEnd()}}class r{constructor(e,t,s,i){this.reset=()=>{this.input.value=this.default.toString()},this.default=i.default;const n=document.createElement("div");n.classList.add("_1qbbvv7m");const o=document.createElement("label"),l=i.name[0].toUpperCase()+i.name.slice(1);o.textContent=l,o.setAttribute("for",`colorPicker-${l}-slider-${t}`),n.appendChild(o),this.input=document.createElement("input"),this.input.setAttribute("type","range"),this.input.classList.add("_1c5ktpm2"),this.input.setAttribute("min",`${i.min}`),this.input.setAttribute("max",`${i.max}`),this.input.setAttribute("value",`${i.default}`),this.input.id=`colorPicker-${l}-slider-${t}`,this.input.style.width="100%",this.input.classList.add("colorPicker-slider"),this.input.addEventListener("input",(()=>{s.color={type:"subtype",value:{type:i.name,value:parseFloat(this.input.value)},source:"slider"}})),n.appendChild(this.input),e.appendChild(n)}update(e){this.input.value=`${e}`}}class a{constructor(e,t){this.name="text",this.colorText="",this.createNumberInput=e=>{var t,s,i,n;const o=document.createElement("input");return o.setAttribute("type","text"),o.setAttribute("inputmode","numeric"),o.setAttribute("pattern","[0-9]*"),o.setAttribute("min",`${null!=(t=null==e?void 0:e.min)?t:0}`),o.setAttribute("max",`${null!=(s=null==e?void 0:e.max)?s:100}`),o.setAttribute("step",`${null!=(i=null==e?void 0:e.step)?i:1}`),o.setAttribute("placeholder",`${null!=(n=null==e?void 0:e.placeholder)?n:50}`),o.classList.add("_1qbbvv7p"),o},t.subscribe(this),this.fullSpan=document.createElement("div"),this.fullSpan.classList.add("_1qbbvv7o"),this.numberInputs={hue:this.createNumberInput({max:360,placeholder:0}),saturation:this.createNumberInput({placeholder:0}),lightness:this.createNumberInput({placeholder:50})},this.fullSpan.append(document.createTextNode("hsl(")),this.fullSpan.append(this.numberInputs.hue),this.fullSpan.append(document.createTextNode(",")),this.fullSpan.append(this.numberInputs.saturation),this.fullSpan.append(document.createTextNode("%,")),this.fullSpan.append(this.numberInputs.lightness),this.fullSpan.append(document.createTextNode("%) ")),this.createCopyButton();const s=(e,t)=>({type:"subtype",value:{type:e,value:parseInt(this.numberInputs[e].value,10)%t||0},source:"text"});this.fullSpan.addEventListener("change",(e=>{const{target:i}=e;i instanceof HTMLInputElement&&(i===this.numberInputs.hue&&(t.color=s("hue",360)),i===this.numberInputs.saturation&&(t.color=s("saturation",100)),i===this.numberInputs.lightness&&(t.color=s("lightness",100)))})),e.appendChild(this.fullSpan)}createCopyButton(){this.copy=document.createElement("button"),this.copy.classList.add("_1qbbvv7a","_1qbbvv7q"),this.copy.addEventListener("click",(()=>{navigator.clipboard.writeText(this.colorText).then((()=>{})).catch((e=>{console.error(`Copy failed! ${e.message}`)}))})),this.copy.append(this.colorText),this.copy.innerHTML='<svg role="img" viewBox="2.5 0 20 24" style="fill-rule: evenodd; clip-rule: evenodd;" class="_1qbbvv7b"><path d="M6.8 19v3.1c0 1 .9 1.9 1.9 1.9h11.7c1 0 1.9-.8 1.9-1.9V7c0-1-.8-1.9-1.9-1.9h-2.3V1.9c0-1-.9-1.9-1.9-1.9H4.5c-1 0-1.9.8-1.9 1.9V17c0 1 .8 1.9 1.9 1.9h2.3zM20.1 7.8H9v13.4h11V7.8zM15.8 5V2.8h-11v13.4h2V7c0-1 .9-1.9 1.9-1.9h7.1z"></path></svg>',this.fullSpan.append(this.copy)}logState(){console.log(this)}colorChangeHandler(e){this.colorText=t(e.color),"text"!==e.source&&(this.numberInputs.hue.value=`${Math.round(e.color.hue)}`,this.numberInputs.saturation.value=`${Math.round(e.color.saturation)}`,this.numberInputs.lightness.value=`${Math.round(e.color.lightness)}`)}}class d{constructor(s,i){this.state=i,this.name="color-circle",this.selected=-1,this.circleList=[],this.addClickEventDelegation=()=>{this.wrapper.addEventListener("click",(e=>{e.target!==this.wrapper&&this.circleList.forEach(((t,s)=>{e.target.closest("button")===t&&(this.state.selected=s)}))}))},this.addCircle=()=>{const e=document.createElement("button");e.classList.add("_1qbbvv79","_1qbbvv7l"),this.circleList.push(e),this.wrapper.append(e)},this.removeCircle=()=>(this.circleList[this.selected].remove(),this.circleList.length<=6&&(this.circleList[this.circleList.length-1].style.display="block"),this.circleList.splice(this.selected,1)),this.deselect=t=>{t>=0&&t<this.circleList.length&&(this.circleList[t].style.borderColor=`${e.secondary}`)},this.select=t=>{this.selected=t,this.circleList[this.selected].style.borderColor=`${e.text}`},this.colorChangeHandler=e=>{e.source!==this.name&&this.circleList[this.selected].style.setProperty("--circle-color",t(e.color))},this.selectedChangeHandler=e=>{"new"!==e?"delete"!==e?e>=0&&e<this.circleList.length&&(this.deselect(this.selected),this.select(e)):this.removeCircle():this.addCircle()},this.wrapper=document.createElement("div"),this.wrapper.classList.add("_1qbbvv78"),this.wrapper.style.flexDirection="row",this.wrapper.style.width="100%",this.wrapper.style.flexWrap="wrap",this.addClickEventDelegation(),i.subscribe(this),s.appendChild(this.wrapper)}logState(){console.info(this),console.info(this.circleList)}}const c=class{constructor(e,t,i){var n,o;this.name="component",this.children=[],this.visible=!1,this.logState=()=>{console.info("Logging State Of Component"),console.info(this),this.children.forEach((e=>{e.name?(console.group(`Logging ${e.name}`),e.logState(),console.groupEnd()):e.logState()})),this.element.focus()},this.undebouncedResize=()=>{console.debug("resize")},this.resizeHandler=s(this.undebouncedResize,125),c.componentCount+=1,this.id=c.componentCount,this.element=document.createElement("div"),this.element.classList.add("_1qbbvv78","_1qbbvv7e"),this.width=null!=(n=null==i?void 0:i.width)?n:"15rem",(null==(o=null==i?void 0:i.standAlone)||o)&&(this.hidden=!1),window.addEventListener("resize",s(t.resize,125)),new Promise((()=>{var s;if(this.children.push(new l(this.element,t)),this.children.push(new d(this.element,t)),this.children.push(new h(this.element,this.id,t)),this.children.push(new a(this.element,t)),c.debug){const e=document.createElement("button");e.classList.add("qmpo2r0"),e.textContent="Add",e.addEventListener("click",(()=>{t.addColor()}));const s=document.createElement("button");s.classList.add("qmpo2r0"),s.textContent="Remove",s.addEventListener("click",(()=>t.removeColor()));const i=document.createElement("button");i.classList.add("qmpo2r0"),i.textContent="Log State",i.addEventListener("mousedown",this.logState),this.element.appendChild(i),this.element.appendChild(e),this.element.appendChild(s)}e.appendChild(this.element),t.subscribe(this),t.addColor(),t.maxColors=parseInt(null!=(s=null==i?void 0:i.maxColors)?s:"5",10)})),this.element.onclick=e=>{e.stopPropagation(),e.preventDefault()}}get width(){return this.element.style.getPropertyValue(`${e.width}`)}set width(t){this.element.style.setProperty(`${e.width.slice(4,-1)}`,null!=t?t:"15rem"),this.resizeHandler()}get hidden(){return this.visible}set hidden(e){e&&(this.visible=!1,this.element.classList.remove("_1qbbvv7f")),e||(this.visible=!0,this.element.classList.add("_1qbbvv7f"))}};let u=c;u.componentCount=-1,u.debug=!1;class p{constructor(){this.eventSet=new Set}subscribe(e){this.eventSet.add(e)}unsubscribe(e){this.eventSet.delete(e)}notify(e){this.eventSet.forEach((t=>t(e)))}}class m{constructor(){this.colors=[],this.currentSelectedIndex=-1,this._maxColors=5,this.colorState=new p,this.selectedState=new p,this.resizeAlert=new p,this.MaxColorsState=new p,this.resize=()=>{this.resizeAlert.notify()},this.changeSelected=e=>{e<this.colors.length&&(this.currentSelectedIndex=e),this.selectedState.notify(this.currentSelectedIndex),this.commonNotify()},this.commonNotify=()=>{this.colorState.notify({color:this.colors[this.currentSelectedIndex],source:"component"})}}get color(){return{type:"full",value:this.colors[this.currentSelectedIndex]}}set color(e){this.changeColor(e)}get selected(){return this.currentSelectedIndex}set selected(e){this.changeSelected(e)}get maxColors(){return this._maxColors}set maxColors(e){this._maxColors=e,this.MaxColorsState.notify(e)}subscribe(e){e.colorChangeHandler&&this.colorState.subscribe(e.colorChangeHandler.bind(e)),e.selectedChangeHandler&&this.selectedState.subscribe(e.selectedChangeHandler.bind(e)),e.maxColorChangeHandler&&this.MaxColorsState.subscribe(e.maxColorChangeHandler.bind(e)),e.resizeHandler&&this.resizeAlert.subscribe(e.resizeHandler.bind(e))}addColor(){this.colors.length<this.maxColors&&(this.currentSelectedIndex=this.colors.push({hue:0,saturation:0,lightness:50})-1,this.selectedState.notify("new"),this.selectedState.notify(this.colors.length-1)),this.commonNotify()}removeColor(){this.colors.length>1?(this.colors.splice(this.currentSelectedIndex,1),this.currentSelectedIndex=this.colors.length-1,this.selectedState.notify("delete"),this.selectedState.notify(this.currentSelectedIndex)):console.warn("attempting to remove only color"),this.commonNotify()}changeColor(e){"full"===e.type&&(this.colors[this.currentSelectedIndex]=e.value),"subtype"===e.type&&(this.colors[this.currentSelectedIndex][e.value.type]=e.value.value),this.commonNotify()}}class v extends HTMLElement{constructor(){super(),this.state=new m,this.clickEventListener=e=>{e.target instanceof HTMLElement&&(e.target!==this.openButton||this.standalone?this.pickerElement.hidden=!0:this.pickerElement.hidden=!1)},this.classList.add("_1qbbvv7c"),this.style.display="block",this.openButton=document.createElement("button"),this.openButton.setAttribute("aria-label","open color picker"),this.openButton.classList.add("_1qbbvv7d")}connectedCallback(){var e,t,s,i;return this.standalone?this.pickerElement=new u(this,this.state,{standAlone:!0,width:null!=(e=this.width)?e:"15rem",maxColors:null!=(t=this.maxcolors)?t:"5"}):(this.appendChild(this.openButton),this.pickerElement=new u(this.openButton,this.state,{standAlone:!1,width:null!=(s=this.width)?s:"15rem",maxColors:null!=(i=this.maxcolors)?i:"5"}),document.addEventListener("click",this.clickEventListener.bind(this))),this}disconnectedCallback(){window.removeEventListener("click",this.clickEventListener.bind(this))}static get observedAttributes(){return["width"]}attributeChangedCallback(e,t,s){if(t!==s)switch(console.log(e),e){case"width":this.pickerElement.width=s}}get width(){var e;return null!=(e=this.getAttribute("width"))?e:void 0}set width(e){e&&this.setAttribute("width",e)}get standalone(){return this.hasAttribute("standalone")}set standalone(e){e?this.setAttribute("standalone",""):this.removeAttribute("standalone")}get maxcolors(){var e;return null!=(e=this.getAttribute("maxcolors"))?e:void 0}set maxcolors(e){e&&this.setAttribute("maxcolors",e)}}customElements.define("color-picker",v);export{v as colorPicker};

function styleInject(id, css) {
	if (!css || typeof document === 'undefined') { return; }

	var element;
	var head = document.head || document.getElementsByTagName('head')[0];
	var styleElements  = head.getElementsByTagName('style');

	// To prevent dublicate of the style code during the script reload
	for (var i = 0; i < styleElements.length; i++) {
		if (styleElements[i] && styleElements[i].innerText && styleElements[i].innerText.startsWith('/*for=' + id)) {
			element = styleElements[i];
		}
	}

	if (!element) {
		element = document.createElement('style');
		element.type = 'text/css';
		head.insertBefore(element, styleElements[0] || head.firstChild);
	}

	if (element.styleSheet) {
		element.styleSheet.cssText = css;
	} else {
		var text = document.createTextNode('/*for=' + id + '*/' + css);
		element.innerHTML = "";
		element.appendChild(text);
	}
};
styleInject("color-picker", "._1qbbvv7a:active,._1qbbvv7a:disabled{fill:var(--_1qbbvv71)}._1qbbvv79,._1qbbvv7h{border-radius:50%;cursor:pointer}._1qbbvv7m,._1qbbvv7n{outline:var(--_1qbbvv72)}._1c5ktpm1,._1qbbvv78{-webkit-box-orient:vertical;-webkit-box-direction:normal}@font-face{src:url(https://fonts.gstatic.com/s/ibmplexsans/v8/zYXgKVElMYYaJe8bpLHnCwDKhdHeFQ.woff2) format('woff2');font-display:swap;font-weight:400;font-style:normal;unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;font-family:\"_1qbbvv77\"}color-picker *{-webkit-box-sizing:border-box;box-sizing:border-box;font-size:100%;margin:0;padding:0;line-height:1.15}._1qbbvv79,._1qbbvv7c{-webkit-box-sizing:border-box}._1qbbvv78{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:distribute;justify-content:space-around;-webkit-box-align:center;-ms-flex-align:center;align-items:center}._1qbbvv79{--circle-color:hsl(0, 0%, 50%);box-sizing:border-box;-webkit-transform:translateZ(1px);transform:translateZ(1px);border:none;background:0 0;-webkit-box-shadow:0rem 0rem 1rem hsla(0,0%,0%,.3);box-shadow:0rem 0rem 1rem hsla(0,0%,0%,.3)}._1qbbvv7a{border:none;background:0 0;fill:var(--_1qbbvv72)}._1qbbvv7a:disabled{cursor:default;background:hsla(0,0%,0%,0)!important}._1qbbvv7b{fill:inherit;position:absolute;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:inherit}._1qbbvv7c{--_1qbbvv70:hsl(270, 1%, 13%);--_1qbbvv71:hsl(270, 7%, 24%);--_1qbbvv72:hsl(337, 71%, 60%);--_1qbbvv73:hsl(46, 75%, 55%);--_1qbbvv74:hsl(53, 20%, 80%);--_1qbbvv75:15rem;--_1qbbvv76:0;box-sizing:border-box}._1qbbvv7d{position:relative;-webkit-transform:translateZ(1px);transform:translateZ(1px);width:100%;height:100%;border-radius:25%;border:.2rem solid hsla(0,0%,20%,1);-webkit-box-shadow:0 0 0 hsla(0,0%,0%,.3);box-shadow:0 0 0 hsla(0,0%,0%,.3);background:radial-gradient(circle closest-side,hsla(0,0%,50%,1),hsla(0,0%,50%,0)),conic-gradient(hsl(0,100%,50%),hsl(30,100%,50%),hsl(60,100%,50%),hsl(90,100%,50%),hsl(120,100%,50%),hsl(150,100%,50%),hsl(180,100%,50%),hsl(210,100%,50%),hsl(240,100%,50%),hsl(270,100%,50%),hsl(300,100%,50%),hsl(330,100%,50%),hsl(360,100%,50%))}._1qbbvv7e{position:absolute;left:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);width:-webkit-min-content;width:-moz-min-content;width:min-content;padding:1rem;border-radius:calc(var(--_1qbbvv75)*.1);color:var(--_1qbbvv74);background-color:var(--_1qbbvv70);-webkit-box-shadow:0rem 0rem 1.5rem -.5rem hsl(270,1%,13%),inset 0 0 calc(var(--_1qbbvv75)/ 10) calc(var(--_1qbbvv75)/ 100) hsla(0,0%,calc(var(--_1qbbvv76) * 1%),.1);box-shadow:0rem 0rem 1.5rem -.5rem hsl(270,1%,13%),inset 0 0 calc(var(--_1qbbvv75)/ 10) calc(var(--_1qbbvv75)/ 100) hsla(0,0%,calc(var(--_1qbbvv76) * 1%),.1);font-family:\"_1qbbvv77\";visibility:hidden;opacity:0;-webkit-transition:visibility .3s,opacity .3s;transition:visibility .3s,opacity .3s;gap:calc(var(--_1qbbvv75)/30)}._1qbbvv7f{visibility:unset;opacity:1}._1qbbvv7h{--_1qbbvv7g:50%;position:relative;-webkit-transform:translateZ(1px);transform:translateZ(1px);width:calc(var(--_1qbbvv75)*.9);height:calc(var(--_1qbbvv75)*.9);border:calc(var(--_1qbbvv75)* .9 * .05) solid var(--_1qbbvv71);-webkit-box-shadow:0rem 0rem 1rem hsla(0,0%,0%,.3);box-shadow:0rem 0rem 1rem hsla(0,0%,0%,.3);background:radial-gradient(circle closest-side,hsla(0,0%,var(--_1qbbvv7g),100%),hsla(0,0%,50%,0%)),conic-gradient(hsl(0,100%,var(--_1qbbvv7g)),hsl(30,100%,var(--_1qbbvv7g)),hsl(60,100%,var(--_1qbbvv7g)),hsl(90,100%,var(--_1qbbvv7g)),hsl(120,100%,var(--_1qbbvv7g)),hsl(150,100%,var(--_1qbbvv7g)),hsl(180,100%,var(--_1qbbvv7g)),hsl(210,100%,var(--_1qbbvv7g)),hsl(240,100%,var(--_1qbbvv7g)),hsl(270,100%,var(--_1qbbvv7g)),hsl(300,100%,var(--_1qbbvv7g)),hsl(330,100%,var(--_1qbbvv7g)),hsl(360,100%,var(--_1qbbvv7g)));-webkit-filter:brightness(100%);filter:brightness(100%)}._1qbbvv7i{--handleXOffset:0;--handleYOffset:0;--scaleFactor:1;--borderColor:var(--_1qbbvv71);--colorPickerHandleSize:calc(var(--_1qbbvv75)*.9 * 0.15);position:absolute;top:50%;left:50%;-webkit-transform-origin:center;transform-origin:center;-webkit-transform:translate(calc(var(--handleXOffset) * 1px + -50%),calc(var(--handleYOffset) * 1px + -50%)) scale(var(--scaleFactor));transform:translate(calc(var(--handleXOffset) * 1px + -50%),calc(var(--handleYOffset) * 1px + -50%)) scale(var(--scaleFactor));width:var(--colorPickerHandleSize);height:var(--colorPickerHandleSize);border-radius:50%;border:calc(var(--colorPickerHandleSize) * .1) solid var(--borderColor);background:var(--selectedColor);-webkit-box-shadow:0rem 0rem .15rem hsla(0,0%,0%,.3);box-shadow:0rem 0rem .15rem hsla(0,0%,0%,.3);cursor:-webkit-grab;cursor:grab}._1qbbvv7i:active{cursor:-webkit-grabbing;cursor:grabbing}._1qbbvv7j{position:absolute;width:calc(var(--_1qbbvv75) * .1);height:calc(var(--_1qbbvv75) * .1);bottom:0;-webkit-transform:translate(25%,25%);transform:translate(25%,25%)}._1qbbvv7l{--circle-color:hsl(0, 0%,50%);--_1qbbvv7k:calc(var(--_1qbbvv75)*.15);width:var(--_1qbbvv7k);height:var(--_1qbbvv7k);background-color:var(--circle-color);border:calc(var(--_1qbbvv7k) * .1) solid var(--_1qbbvv71)}._1qbbvv7l:focus-visible{outline:.4rem solid var(--_1qbbvv72)}._1qbbvv7l:focus{border-color:var(--_1qbbvv72)}._1qbbvv7m{color:inherit;width:100%}._1qbbvv7p,.qmpo2r0{color:var(--_1qbbvv74)}._1qbbvv7n{cursor:pointer}._1qbbvv7o{text-align:center;width:100%}._1qbbvv7p{display:inline-block;width:calc(var(--_1qbbvv75)/7.5);border:none;background-color:transparent;text-align:right;cursor:text;font-size:93%}._1qbbvv7p:hover{outline:1px solid var(--_1qbbvv72);background-color:var(--_1qbbvv71)}._1qbbvv7p:active,._1qbbvv7p:focus{outline:2px solid var(--_1qbbvv73);background-color:var(--_1qbbvv71)}._1qbbvv7q{width:1rem;height:1rem;margin-left:1ch;cursor:copy;vertical-align:middle}@media (hover:hover) and (pointer:fine){._1qbbvv7a:hover{fill:var(--_1qbbvv73)}._1qbbvv7a:disabled{cursor:default;fill:var(--_1qbbvv71);background:hsla(0,0%,0%,0)!important}._1qbbvv7d:hover{border-color:white}._1qbbvv7l:hover{fill:var(--_1qbbvv72)}}@media (prefers-color-scheme:light){._1qbbvv7c{--_1qbbvv70:hsl(256, 14%, 85%);--_1qbbvv71:hsl(253, 5%, 66%);--_1qbbvv72:hsl(176, 44%, 50%);--_1qbbvv73:hsl(337, 71%, 60%);--_1qbbvv74:hsl(242, 94%, 7%);--_1qbbvv75:15rem;--_1qbbvv76:100}}._1c5ktpm1{-webkit-box-sizing:border-box;box-sizing:border-box;width:100%;-ms-flex-direction:column;flex-direction:column;gap:.5em;text-align:left;margin-top:-.5rem}._1c5ktpm2{--bg:linear-gradient(90deg, white, black);--lightness:50%;--saturation:100%;--hue:0;--hueBG:linear-gradient(90deg, hsl(0,var(--saturation),var(--lightness)), hsl(30,var(--saturation),var(--lightness)), hsl(60,var(--saturation),var(--lightness)), hsl(90,var(--saturation),var(--lightness)), hsl(120,var(--saturation),var(--lightness)), hsl(150,var(--saturation),var(--lightness)), hsl(180,var(--saturation),var(--lightness)), hsl(210,var(--saturation),var(--lightness)), hsl(240,var(--saturation),var(--lightness)), hsl(270,var(--saturation),var(--lightness)), hsl(300,var(--saturation),var(--lightness)), hsl(330,var(--saturation),var(--lightness)), hsl(360,var(--saturation),var(--lightness)));--satBG:linear-gradient(90deg,hsl(var(--hue),0%,var(--lightness)),hsl(var(--hue),100%,var(--lightness)) );--lightBG:linear-gradient(90deg, hsl(var(--hue), var(--saturation), 0%), hsl(var(--hue), var(--saturation),50%),hsl(var(--hue), var(--saturation), 100%));--_1c5ktpm0:1.5rem;-webkit-appearance:none;-moz-appearance:none;appearance:none;background:0 0;width:100%;border-radius:.5em;outline:0;-webkit-transition:opacity .2s;transition:opacity .2s;margin-top:.5em;-webkit-transform:translateZ(1px);transform:translateZ(1px)}._1c5ktpm2::-moz-range-thumb{box-sizing:content-box;background:0 0;border:solid var(--_1qbbvv71) .15em;border-radius:50%;height:var(--_1c5ktpm0);width:var(--_1c5ktpm0);transform:translateZ(1px);box-shadow:inset 0 0 0 .15em var(--_1qbbvv74)}._1c5ktpm2::-ms-thumb{box-sizing:content-box;background:0 0;border:solid var(--_1qbbvv71) .15em;border-radius:50%;height:var(--_1c5ktpm0);width:var(--_1c5ktpm0);transform:translateZ(1px);box-shadow:inset 0 0 0 .15em var(--_1qbbvv74)}._1c5ktpm2::-webkit-slider-thumb{-webkit-appearance:none;-webkit-box-sizing:content-box;box-sizing:content-box;background:0 0;border:solid var(--_1qbbvv71) .15em;border-radius:50%;height:var(--_1c5ktpm0);width:var(--_1c5ktpm0);-webkit-transform:translateY(-.1em);transform:translateY(-.1em);-webkit-box-shadow:inset 0 0 0 .15em var(--_1qbbvv74);box-shadow:inset 0 0 0 .15em var(--_1qbbvv74)}._1c5ktpm2::-moz-range-thumb:hover{border-color:var(--_1qbbvv72)}._1c5ktpm2::-moz-range-thumb:active{border-color:var(--_1qbbvv73)}._1c5ktpm2::-ms-thumb:hover{border-color:var(--_1qbbvv72)}._1c5ktpm2::-ms-thumb:active{border-color:var(--_1qbbvv73)}._1c5ktpm2::-webkit-slider-thumb:hover{border-color:var(--_1qbbvv72)}._1c5ktpm2::-webkit-slider-thumb:active{border-color:var(--_1qbbvv73)}._1c5ktpm3::-moz-range-track{box-sizing:content-box;width:100%;display:inline-block;height:var(--_1c5ktpm0);border:.2em solid var(--_1qbbvv71);border-radius:var(--_1c5ktpm0);box-shadow:0 0 1em hsla(0,0%,0%,.3);background:var(--hueBG)}._1c5ktpm3::-ms-track{box-sizing:content-box;width:100%;display:inline-block;height:var(--_1c5ktpm0);border:.2em solid var(--_1qbbvv71);border-radius:var(--_1c5ktpm0);box-shadow:0 0 1em hsla(0,0%,0%,.3);background:var(--hueBG)}._1c5ktpm3::-webkit-slider-runnable-track{-webkit-box-sizing:content-box;box-sizing:content-box;width:100%;display:inline-block;height:var(--_1c5ktpm0);border:.2em solid var(--_1qbbvv71);border-radius:var(--_1c5ktpm0);-webkit-box-shadow:0 0 1em hsla(0,0%,0%,.3);box-shadow:0 0 1em hsla(0,0%,0%,.3);background:var(--hueBG)}._1c5ktpm4::-moz-range-track{box-sizing:content-box;width:100%;display:inline-block;height:var(--_1c5ktpm0);border:.2em solid var(--_1qbbvv71);border-radius:var(--_1c5ktpm0);box-shadow:0 0 1em hsla(0,0%,0%,.3);background:var(--satBG)}._1c5ktpm4::-ms-track{box-sizing:content-box;width:100%;display:inline-block;height:var(--_1c5ktpm0);border:.2em solid var(--_1qbbvv71);border-radius:var(--_1c5ktpm0);box-shadow:0 0 1em hsla(0,0%,0%,.3);background:var(--satBG)}._1c5ktpm4::-webkit-slider-runnable-track{-webkit-box-sizing:content-box;box-sizing:content-box;width:100%;display:inline-block;height:var(--_1c5ktpm0);border:.2em solid var(--_1qbbvv71);border-radius:var(--_1c5ktpm0);-webkit-box-shadow:0 0 1em hsla(0,0%,0%,.3);box-shadow:0 0 1em hsla(0,0%,0%,.3);background:var(--satBG)}._1c5ktpm5::-moz-range-track{box-sizing:content-box;width:100%;display:inline-block;height:var(--_1c5ktpm0);border:.2em solid var(--_1qbbvv71);border-radius:var(--_1c5ktpm0);box-shadow:0 0 1em hsla(0,0%,0%,.3);background:var(--lightBG)}._1c5ktpm5::-ms-track{box-sizing:content-box;width:100%;display:inline-block;height:var(--_1c5ktpm0);border:.2em solid var(--_1qbbvv71);border-radius:var(--_1c5ktpm0);box-shadow:0 0 1em hsla(0,0%,0%,.3);background:var(--lightBG)}._1c5ktpm5::-webkit-slider-runnable-track{-webkit-box-sizing:content-box;box-sizing:content-box;width:100%;display:inline-block;height:var(--_1c5ktpm0);border:.2em solid var(--_1qbbvv71);border-radius:var(--_1c5ktpm0);-webkit-box-shadow:0 0 1em hsla(0,0%,0%,.3);box-shadow:0 0 1em hsla(0,0%,0%,.3);background:var(--lightBG)}.qmpo2r0{width:100%;background-color:var(--_1qbbvv70);border-color:var(--_1qbbvv74);border-radius:1em}.qmpo2r0:focus,.qmpo2r0:hover{color:var(--_1qbbvv72);background-color:var(--_1qbbvv71);border-color:var(--_1qbbvv72)}.qmpo2r0:active{border-color:var(--_1qbbvv73)}");