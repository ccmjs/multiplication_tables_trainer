/**
 * @overview HTML templates of <i>ccmjs</i>-based web component for multiplication tables trainer.
 * @author André Kless <andre.kless@web.de> 2023
 */

import { html, render, repeat } from './../libs/lit/lit.js';
export { render };

export function main() {
  return html`
    <header></header>
    <main class="d-flex justify-content-center align-items-center p-3 text-center text-nowrap overflow-auto"></main>
    <footer></footer>
  `;
}

export function controls( app ) {
  return html`
    <form @submit=${ e => { e.preventDefault(); app.events.onStart(); } }>
      <h1>${ app.text.title }</h1>
      <div class="mt-3">
        <div class="fw-bold">${ app.text.range }</div>
        <div class="d-flex justify-content-center">
          ${ [ '1-10', '11-20', '1-20', '1-100' ].map( ( range, i ) => html`
            <div class="px-2">
              <label>
                <input type="radio" name="range" value="${ range }" ?required=${ !i } ?checked=${ range === app.range.join( '-' ) }>
                ${ range }
              </label>
            </div>
          ` ) }
        </div>
      </div>
      <div class="mt-3">
        <label>
          <div class="fw-bold">${ app.text.limit }</div>
          <div>
            <input class="form-control d-inline w-auto p-1" type="number" name="timer" min="1" max="60" value="${ app.timer }" required>
            ${ app.text.seconds }
          </div>
        </label>
      </div>
      <div class="mt-3">
        <input type="submit" class="btn btn-primary" value="${ app.text.start }">
      </div>
    </form>
  `;
}

export function training( app ) {
  const data = app.getValue();
  const section = data.sections[ data.nr - 1 ];
  return html`
    <div>
      <div id="task">
        ${ section.task[ 0 ] } ${ app.text.mul } ${ section.task[ 1 ] } = <input class="form-control d-inline w-auto p-1" type="number" min="1" max="${ app.range[ 1 ] * 10 }">
      </div>
      <div class="progress rounded-pill m-4">
        <div class="progress-bar bg-primary" role="progressbar"></div>
      </div>
      <div id="points" class="d-flex flex-wrap">
        ${ repeat( data.sections, ( _, i ) => i, section => {
          if ( section.correct === undefined )
            return html`
              <svg fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
              </svg>
            `;
          else
            return html`
              <svg fill="currentColor" viewBox="0 0 16 16" class="text-${ section.correct ? 'success' : 'danger' }" title="${ section.task[ 0 ] + ' ' + app.text.mul + ' ' + section.task[ 1 ] + ' = ' + section.solution }">
                <circle cx="8" cy="8" r="8"/>
              </svg>
            `;
        } ) }
      </div>
    </div>
  `;
}
