
const Cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1)
const template = document.createElement("template")
template.innerHTML = `
<link rel="stylesheet" href="/src/components/slider.css">
<div> <label id="label" for="slider"></label> </div>
<div> <input id="slider" class="slider" type="range" min="1" max="100" step="1" value="50" /> </div>
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
      // do the shadow -- mode is not relevant to css, it only applies to JavaScript.
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