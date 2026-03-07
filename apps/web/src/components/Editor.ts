// components/Editor.ts
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { autocompletion } from '@codemirror/autocomplete';
// Override autocomplete
const noAutocomplete = autocompletion({
    override: [],
    activateOnTyping: false,
    defaultKeymap: false,
});

export class CodeEditor {
    private view: EditorView;

    constructor(element: HTMLElement, initialDoc: string = '') {
        /* const ayuHighlight = HighlightStyle.define{[]
            '.cm-keyword': { color: '#ff8f40' },
            '.cm-string': { color: '#aad94c' },
            '.cm-string-2': { color: '#95e6cb' },
            '.cm-comment': { color: '#acb6bf8c', fontStyle: 'italic' },
            '.cm-number': { color: '#d2a6ff' },
            '.cm-variable': { color: '#bfbdb6' },
            '.cm-variable-2': { color: '#d2a6ff' },
            '.cm-variable-3': { color: '#f07178' },
            '.cm-function': { color: '#ffb454' },
            '.cm-typeName': { color: '#39bae6' },
            '.cm-operator': { color: '#f29668' },
            '.cm-tag': { color: '#39bae6' },
            '.cm-attribute': { color: '#ffb454' },
            '.cm-builtin': { color: '#f07178' },
            '.cm-error': { color: '#d95757' },
        ]}; */

        const ayuHighlightStyle = HighlightStyle.define([
            { tag: tags.keyword, color: '#ff8f40' },
            { tag: tags.string, color: '#aad94c' },
            { tag: tags.comment, color: '#acb6bf8c', fontStyle: 'italic' },
            { tag: tags.number, color: '#d2a6ff' },
            { tag: tags.variableName, color: '#bfbdb6' },
            { tag: tags.function(tags.variableName), color: '#ffb454' },
            { tag: tags.typeName, color: '#39bae6' },
            { tag: tags.operator, color: '#f29668' },
            { tag: tags.tagName, color: '#39bae6' },
            { tag: tags.attributeName, color: '#ffb454' },
            { tag: tags.bool, color: '#d2a6ff' },
            { tag: tags.self, color: '#39bae6' },
            { tag: tags.invalid, color: '#d95757' },
        ]);

        this.view = new EditorView({
            doc: initialDoc,
            extensions: [
                basicSetup,
                noAutocomplete,
                javascript({ typescript: true }),
                syntaxHighlighting(ayuHighlightStyle),
            ],
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

    private getAyuSyntaxTheme() {
        return EditorView.theme(
            {
                '.cm-keyword': { color: '#ff8f40' },
                '.cm-string': { color: '#aad94c' },
                '.cm-string-2': { color: '#95e6cb' },
                '.cm-comment': { color: '#acb6bf8c', fontStyle: 'italic' },
                '.cm-number': { color: '#d2a6ff' },
                '.cm-variable': { color: '#bfbdb6' },
                '.cm-variable-2': { color: '#d2a6ff' },
                '.cm-variable-3': { color: '#f07178' },
                '.cm-function': { color: '#ffb454' },
                '.cm-typeName': { color: '#39bae6' },
                '.cm-operator': { color: '#f29668' },
                '.cm-tag': { color: '#39bae6' },
                '.cm-attribute': { color: '#ffb454' },
                '.cm-builtin': { color: '#f07178' },
                '.cm-error': { color: '#d95757' },
            },
            { dark: true },
        );
    }

    destroy(): void {
        this.view.destroy();
    }
}
