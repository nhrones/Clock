
const Cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1)

const template = document.createElement("template")
template.innerHTML = `
<style>

/* for the shadowRoot only */
:host {
   margin-top:10px;
   background-color: #000;
   color: cornflowerblue;
   text-align: center;
}  

button {
   background-color: #000;
   color: cornflowerblue;
   border: 2px solid cornflowerblue;
}

label {
   color: cornflowerblue;
   margin: 10px;
   font-family: helvetica;
   font-size: 18px;
   font-style: italic;
   letter-spacing: 2px;
 }
 
 .slider {
   appearance: none; 
   width: 20%;
   height: 10px;
   background: #000;
   outline: none;
   border: 2px solid cornflowerblue;
   border-radius: 4px;
 }
 
 
 /* for chrome/safari */
 .slider::-webkit-slider-thumb {
   -webkit-appearance: none;
   appearance: none;
   width: 25px;
   height: 20px;
   background: rgb(169, 169, 243);
   cursor: pointer;
   border: 5px solid cornflowerblue;
   border-radius: 4px;
 }
 
 /* for firefox */
 .slider::-moz-range-thumb {
   width: 20px;
   height: 60px;
   background: #000;
   cursor: pointer;
   border: 5px solid #44f;
   border-radius: 4px;
 }

</style>

<div>
   <label id="label" for="ss"></label>
</div>

<div>
   <input id="slider" class="slider" type="range" min="1" max="100" step="1" value="50" />
</div>
`;

/** SuperSlider Web Component*/
export class SuperSlider extends HTMLElement {
   // The name of this slider -- from its id 
   valueName: string
   label: HTMLLabelElement
   slider: HTMLInputElement
   unit: string
   constructor() {
      super();
      // do the shadow
      const shadowRoot = this.attachShadow({ mode: "closed" })
      let clone = template.content.cloneNode(true)
      shadowRoot.append(clone)
      // grab a reference to the elements
      this.slider = shadowRoot.getElementById("slider") as HTMLInputElement;
      this.label = shadowRoot.getElementById("label") as HTMLLabelElement;
      // extract the attributes from the HTML-Tag
      this.unit = this.getAttribute('unit') as string;
      this.valueName = Cap(this.getAttribute('id') as string);
   }

   connectedCallback() {
      this.label.textContent = `${this.valueName}: ${this.slider.value}%`;

      this.slider.addEventListener("input", (e) => {
         e.stopPropagation(); //stops bubbling up
         this.label.textContent = `${this.valueName}: ${this.slider.value}%`;
         let ev = new InputEvent("change", { data: this.slider.value })
         this.dispatchEvent(ev);
      });

      let reset = this.slider.getAttribute('value');
      let resetter = document.createElement('button');
      resetter.textContent = '↺';
      resetter.setAttribute('title', reset + this.unit);
      resetter.addEventListener("click", (e) => {
         this.slider.value = reset!;
         this.slider.dispatchEvent(
            new MouseEvent('input', { view: window, bubbles: false })
         );
      });

      this.slider.after(resetter);
   }
}


customElements.define("super-slider", SuperSlider); 