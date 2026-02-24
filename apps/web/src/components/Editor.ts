// components/Editor.ts
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';

export class CodeEditor {
    private view: EditorView;

    constructor(element: HTMLElement, initialDoc: string = '') {
        this.view = new EditorView({
            doc: initialDoc,
            extensions: [basicSetup, javascript()],
            parent: element,
        });
    }

    getValue(): string {
        return this.view.state.doc.toString();
    }

    setValue(newText: string): void {
        this.view.dispatch({
            changes: {
                from: 0,
                to: this.view.state.doc.length,
                insert: newText,
            },
        });
    }

    destroy(): void {
        this.view.destroy();
    }
}
