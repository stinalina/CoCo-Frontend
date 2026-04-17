import { Injectable } from '@angular/core';

export enum TypewriterActionType {
  TYPE = 'type',
  DELETE = 'delete',
  PAUSE = 'pause',
  LINEBREAK = '<br/>',
}

type TypewriterAction =
  | { type: TypewriterActionType.TYPE; text: string }
  | { type: TypewriterActionType.DELETE; count: number }
  | { type: TypewriterActionType.PAUSE; duration: number }
  | { type: TypewriterActionType.LINEBREAK };

@Injectable({ providedIn: 'root' })
export class TypewriterEffectService {
  private actions: TypewriterAction[] = [];
  private readonly cursorHtml = '<span class="typewriter-cursor">|</span>';

  public setActions(actions: TypewriterAction[]): void {
    this.actions = actions;
  }

  public animatePlaceholder(updatePlaceholder: (text: string) => void): void {
    let i = 0;
    let text = '';
    const typingSpeed = 100; // ms pro Buchstabe

    const nextAction = () => {
      if (i >= this.actions.length){
        updatePlaceholder(text);
        return
      };
      const action = this.actions[i];

      switch (action.type) {
        case TypewriterActionType.PAUSE:
          if (action.duration <= 500 || i === 0) {
            setTimeout(() => {
              i++;
              nextAction();
            }, action.duration);
          } else {
            let dots = 0;
            const maxDots = 3;
            const dotInterval = 400;
            let elapsed = 0;
            updatePlaceholder(text + '<span class="typewriter-cursor"> ...</span>');
            const interval = setInterval(() => {
              dots = (dots + 1) % (maxDots + 1);
              const dotsStr = '.'.repeat(dots);
              updatePlaceholder(text + `<span class="typewriter-cursor">${dotsStr}</span>`);
              elapsed += dotInterval;
              if (elapsed >= action.duration) {
                clearInterval(interval);
                updatePlaceholder(text);
                i++;
                nextAction();
              }
            }, dotInterval);
          }
          break;
        case TypewriterActionType.TYPE:
          let j = 0;
          const typeInterval = setInterval(() => {
            if (j < action.text.length) {
              text += action.text[j];
              updatePlaceholder(text + this.cursorHtml);
              j++;
            } else {
              clearInterval(typeInterval);
              i++;
              nextAction();
            }
          }, typingSpeed);
          break;
        case TypewriterActionType.DELETE:
          let k = 0;
          const deleteInterval = setInterval(() => {
            if (k < action.count && text.length > 0) {
              text = text.slice(0, -1);
              updatePlaceholder(text + this.cursorHtml);
              k++;
            } else {
              clearInterval(deleteInterval);
              i++;
              nextAction();
            }
          }, typingSpeed);
          break;
        case TypewriterActionType.LINEBREAK:
          text += TypewriterActionType.LINEBREAK;
          updatePlaceholder(text);
          i++;
          nextAction();
          break;
      }
    };
    nextAction();
  }
}