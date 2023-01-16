"use strict";

/**
 * @overview <i>ccmjs</i>-based web component for multiplication tables trainer.
 * @author André Kless <andre.kless@web.de> 2023
 * @license The MIT License (MIT)
 */

( () => {
  const component = {
    name: 'multiplication_tables_trainer',
    ccm: './libs/ccm/ccm.js',
    config: {
      "controls": true,
      "css": [ "ccm.load",
        [
          "./libs/bootstrap-5/css/bootstrap.css",
          "./resources/styles.css",
        ],
        { "url": "./libs/bootstrap-5/css/bootstrap-fonts.css", "context": "head" }
      ],
      "data": {},
      "feedback": 2,
      "helper": [ "ccm.load", { "url": "./libs/ccm/helper.js", "type": "module" } ],
      "html": [ "ccm.load", { "url": "./resources/templates.js", "type": "module" } ],
      "range": [ 1, 10 ],
      // "onchange": event => console.log( event ),
      "onfinish": { "log": true },
      // "onready": event => console.log( event ),
      // "onstart": event => console.log( event ),
      // "result_mode": true,
      "rounds": 100,
      "show_solution": true,
      "shuffle": true,
      "timer": 5,
      "text": {
        "limit": "Zeitlimit",
        "range": "Zahlenreihen von",
        "seconds": "Sekunden",
        "start": "START",
        "title": "Einmaleins-Trainer",
        "mul": "∙"
      }
    },
    Instance: function () {
      let $, data, $main;
      this.init = async () => {
        $ = Object.assign( {}, this.ccm.helper, this.helper );
        $.use( this.ccm );
      };
      this.ready = async () => {
        this.onready && await this.onready( { instance: this } );
      };
      this.start = async () => {
        this.html.render( this.html.main(), this.element );
        $main = this.element.querySelector( 'main' );
        data = await $.dataset( this.data );
        if ( this.controls ) return this.html.render( this.html.controls( this ), $main );
        return startTraining();
      };
      this.getValue = () => $.clone( data );
      this.events = {
        onStart: () => {
          const { range, timer } = $.formData( this.element );
          this.timer = timer;
          this.range = range.split( '-' ).map( n => parseInt( n ) );
          startTraining();
        },
        onNext: () => {
          if ( data.nr === data.total ) return $.onFinish( this );
          data.nr++;
          this.html.render( this.html.training( this ), $main );
          const $input = this.element.querySelector( 'input' );
          $input.value = '';
          $input.disabled = false;
          $input.focus();
          const $progress = this.element.querySelector( '.progress-bar' );
          $progress.style.animationDuration = this.timer + 's';
          $progress.classList.remove( 'run' );
          void $progress.offsetWidth;
          $progress.classList.add( 'run' );
          window.setTimeout( this.events.onFeedback, this.timer * 1000 );
        },
        onFeedback: () => {
          console.log( $.clone( data ) );
          const section = data.sections[ data.nr - 1 ];
          const $input = this.element.querySelector( 'input' );
          section.input = parseInt( $input.value );
          section.correct = section.input === section.solution;
          $input.disabled = true;
          if ( this.show_solution ) $input.value = section.solution;
          const $progress = this.element.querySelector( '.progress-bar' );
          $progress.style.backgroundColor = section.correct ? 'limegreen' : 'red' ;
          section.correct && data.correct++;
          this.html.render( this.html.training( this ), $main );
          window.setTimeout( this.events.onNext, this.feedback * 1000 );
        }
      };
      const startTraining = async () => {
        const set = new Set();
        for ( let i = this.range[ 0 ]; i <= this.range[ 1 ]; i++ )
          for ( let j = 1; j <= 10; j++ ) {
            set.add( [ i, j ] );
          }
        data = {
          nr: 0,
          correct: 0,
          total: this.rounds || set.size,
          attempts: 1,
          sections: [ ...set.values() ].map( task => { return {
            task,
            solution: task[ 0 ] * task[ 1 ]
          } } )
        };
        this.shuffle && $.shuffleArray( data.sections );
        if ( this.rounds ) data.sections.length = this.rounds;
        this.events.onNext();
        this.onstart && await this.onstart( this );
      };
    }
  };
  let b="ccm."+component.name+(component.version?"-"+component.version.join("."):"")+".js";if(window.ccm&&null===window.ccm.files[b])return window.ccm.files[b]=component;(b=window.ccm&&window.ccm.components[component.name])&&b.ccm&&(component.ccm=b.ccm);"string"===typeof component.ccm&&(component.ccm={url:component.ccm});let c=(component.ccm.url.match(/(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)/)||[""])[0];if(window.ccm&&window.ccm[c])window.ccm[c].component(component);else{var a=document.createElement("script");document.head.appendChild(a);component.ccm.integrity&&a.setAttribute("integrity",component.ccm.integrity);component.ccm.crossorigin&&a.setAttribute("crossorigin",component.ccm.crossorigin);a.onload=function(){(c="latest"?window.ccm:window.ccm[c]).component(component);document.head.removeChild(a)};a.src=component.ccm.url}
} )();