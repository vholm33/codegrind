// components/Editor.ts
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';

export class CodeEditor {
    private view: EditorView;

    constructor(element: HTMLElement) {
        this.view = new EditorView({
            extensions: [basicSetup, javascript()],
            parent: element,
        });
    }

    getValue(): string {
        return this.view.state.doc.toString();
    }
}
