import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { resolveRouterPath } from '../router';

import '@shoelace-style/shoelace/dist/components/button/button.js';
@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: String }) title = 'File Analyzer';

  @property({ type: Boolean}) enableBack: boolean = false;

  static get styles() {
    return css`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--app-color-primary);
        color: white;
        padding: 4px 12px 12px;
        position: fixed;
        top: env(titlebar-area-y, 0);
        height: env(titlebar-area-height, 30px);
        z-index: 1;
        app-region: drag;
        width: calc(env(titlebar-area-width, 100%) - 18px);
      }

      header h1 {
        margin-top: 0px;
        margin-bottom: 0px;
        font-size: 12px;
        font-weight: bold;
        view-transition-name: main-header-text;
      }

      nav a {
        margin-left: 10px;
      }

      #back-button-block {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 6px;
      }

      img {
        view-transition-name: main-header-image;
        display: block;
        width: 20px;
      }

      @media(prefers-color-scheme: light) {
        header {
          color: black;
        }

        nav a {
          color: initial;
        }
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <header>

        <div id="back-button-block">
          ${this.enableBack ? html`<sl-button href="${resolveRouterPath()}">
            Back
          </sl-button>` : null}

          <img src="/assets/icons/512.png">

          <h1>${this.title}</h1>
        </div>
      </header>
    `;
  }
}
