import { LitElement, css, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import '@shoelace-style/shoelace/dist/components/textarea/textarea.js';
import '@shoelace-style/shoelace/dist/components/tag/tag.js';

import { styles } from '../styles/shared-styles';

@customElement('app-home')
export class AppHome extends LitElement {

  @state() keywords: string[] = [];
  @state() followups: string[] = [];
  @state() summary: string = "";

  @state() analyzed: boolean = false;

  @state() analyzing: boolean = false;

  static get styles() {
    return [
      styles,
      css`

      main {
        padding: 10px;
      }

      sl-textarea::part(textarea) {
        height: 80vh;
        border: none;
      }

      sl-textarea::part(base) {
        border: none;
        background-color: hsl(240deg 5.26% 14.9%);
      }

      #toolbar {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 10px;

        background: rgb(36 36 40);
        border-radius: 6px;
        padding: 8px;
      }

      #no-file-opened {
        display: flex;
        width: 100vw;
        flex-direction: column;
        align-items: center;
        gap: 44px;
        margin-top: 10vh;
      }

      #no-file-opened img {
        width: 50vw;
      }

      #no-file-opened h3 {
        font-size: 2em;
        margin-top: 0;
        margin: 0;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      #main-container {
        display: flex;
        gap: 8px;
      }

      #main-container sl-textarea {
        flex: 2;
        border: none;
        animation: 0.3s ease-out 0s 1 slideInFromLeft;
      }

      #main-container #analyzations {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8px;

        height: 80vh;
        overflow-y: auto;
        overflow-x: hidden;

        animation: 0.3s ease-out 0s 1 slideInFromRight;
      }

      #main-container #analyzations::-webkit-scrollbar {
        width: 0px;
      }

      sl-card {
        width: 100%;
      }

      sl-card::part(base) {
        border: none;
      }

      h2 {
        font-size: 1.2em;
        margin: 0;
      }

      @keyframes slideInFromRight {
        0% {
          transform: translateX(100%);
          opacity: 0;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideInFromLeft {
        0% {
          transform: translateX(-100%);
          opacity: 0;
        }
        100% {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @media(prefers-color-scheme: light) {
        #toolbar {
          background: white;
        }
      }

      @media(max-width: 800px) {
        #main-container {
          flex-direction: column;
        }
      }
    `];
  }

  constructor() {
    super();
  }

  async firstUpdated() {
    // this method is a lifecycle even in lit
    // for more info check out the lit docs https://lit.dev/docs/components/lifecycle/
    console.log('This is your home page');

  }

  async openFile() {
    const { openTextFile } = await import("../services/analyze-text-file")
    const text = await openTextFile();

    this.analyzing = true;

    const { analyzeTextFile } = await import("../services/analyze-text-file");
    const data = await analyzeTextFile(text);
    console.log("data", JSON.stringify(JSON.parse(data)));
    const jsonData = JSON.parse(data);
    console.log("jsonData", jsonData.keywords);

    this.keywords = jsonData.keywords;
    this.followups = jsonData.follow_up;

    const { summarizeTextFile } = await import("../services/analyze-text-file");
    const summary = await summarizeTextFile(text);
    console.log("summary", summary);

    this.summary = summary;

    this.analyzing = false;

    this.analyzed = true;

    await this.updateComplete;

    const textarea = this.shadowRoot?.querySelector('sl-textarea');
    textarea!.value = text;
  }


  render() {
    return html`
      <app-header></app-header>

      <main>
        ${this.analyzed === true ? html`<div id="toolbar">
          <sl-button size="small" variant="primary" @click="${this.openFile}">Open Text File</sl-button>
        </div>` : null}

        <div id="main-container">
          ${this.analyzed === true ? html`<sl-textarea></sl-textarea>` : html`
            <div id="no-file-opened">
              <h3>No file opened</h3>

              <sl-button ?loading="${this.analyzing}" variant="primary" @click="${this.openFile}">Open Text File</sl-button>

              <img src="/assets/no-file.svg" alt="No file opened" />
            </div>
          `}

          ${this.analyzed === true ? html`<div id="analyzations">
            ${this.summary ? html`<sl-card>
              <div slot="header">
                <h2>Summary</h2>
              </div>

              <p>
                ${this.summary}
              </p>
            </sl-card>` : null}

            ${this.keywords && this.keywords.length > 0 ? html`<sl-card>
              <div slot="header">
                <h2>Keywords</h2>
              </div>

              <ul>
              ${this.keywords.map(keyword => html`
                <li>
                  <sl-tag type="primary">${keyword}</sl-tag>
  </li>
                `)}
              </ul>
            </sl-card>` : null}

            ${this.followups && this.followups.length > 0 ? html`
            <sl-card>
              <div slot="header">
                <h2>Follow Ups</h2>
              </div>

              <ul>
              ${this.followups.map(followup => html`
                  <li>
                  <sl-tag type="primary">${followup}</sl-tag>
                `)}
              </ul>
            </sl-card>` : null}
          </div>` : null}
        </div>

      </main>
    `;
  }
}
