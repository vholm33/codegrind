// components/Editor.ts
import { basicSetup, EditorView } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import { autocompletion } from '@codemirror/autocomplete';

import { StateEffect, StateEffectType, StateField } from '@codemirror/state';
import { Decoration } from '@codemirror/view';

// Override autocomplete
const noAutocomplete = autocompletion({
    override: [],
    activateOnTyping: false,
    defaultKeymap: false,
});

type DecorationSet = ReturnType<typeof Decoration.set>;

export class CodeEditor {
    private view: EditorView;
    private highlightField: StateField<DecorationSet>;
    //? private highlightEffect: StateEffect<DecorationSet>['type']
    private readonly setHighlights: StateEffectType<DecorationSet>;

    constructor(element: HTMLElement, initialDoc: string = '') {
        this.setHighlights = StateEffect.define<DecorationSet>();
        this.highlightField = this.createHighlightField();

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

        // Listener for text changes
        const inputListener = EditorView.updateListener.of((update) => {
            if (update.docChanged) {
                // Document changed, can emit events here
            }
        })

        this.view = new EditorView({
            doc: initialDoc,
            extensions: [
                basicSetup,
                noAutocomplete,
                javascript({ typescript: true }),
                syntaxHighlighting(ayuHighlightStyle),
                this.highlightField,
                inputListener
            ],
            parent: element,
        });
    }

    focus(): void {
        if (this.view) {
            console.log(`Focusing in editor`);
            this.view.focus();
        }
    }

    getValue(): string {
        console.log(`getValue()`)
        return this.view?.state.doc.toString() || '';
    }

    setValue(newText: string): void {
        if (!this.view) return

        this.view.dispatch({
            changes: {
                from: 0,
                to: this.view.state.doc.length,
                insert: newText,
            },
        });
    }

    private createHighlightField(): StateField<DecorationSet> {
        console.log(`private createHighlightField()`);
        return StateField.define<DecorationSet>({
            // Initial value - no decorations
            create: () => Decoration.none,
            update: (decorations: DecorationSet, transaction: any) => {
                // First map existing decorations through changes
                let newDecorations = decorations.map(transaction.changes);

                // Then apply any new highlight effects
                for (const effect of transaction.effects) {
                    if (effect.is(this.setHighlights)) {
                        newDecorations = effect.value;
                        break;
                    }
                }

                return newDecorations;
            },

            // Update decorations when state changes
            /*             update(decorations: DecorationSet, transaction: any): DecorationSet {
                console.log(`update(decorations, transaction) --> Update decoration when state changes`);
                // Map decorations through changes (if text was edited)
                decorations = decorations.map(transaction.changes);
                return decorations;
            },
 */
            // Provide the decorations to the editor
            provide: (field) => EditorView.decorations.from(field),
        });
    }

    highlightText(ranges: Array<{ from: number; to: number; className: string }>): void {
        if (!this.view) return;

        // Filter valid ranges
        const docLength = this.view.state.doc.length;
        const validRanges = ranges.filter(({ from, to }) =>
            from >= 0 && to <= docLength && from < to
        )
        if (validRanges.length === 0) {
            this.clearHighlights();
            return
        }


        const decorations = Decoration.set(
            validRanges.map(({ from, to, className }) => Decoration.mark({ class: className }).range(from, to)),
        );

         this.view.dispatch({
             effects: this.setHighlights.of(decorations),
         });
    }

    clearHighlights(): void {
        if (!this.view) return;

        this.view.dispatch({
            effects: this.setHighlights.of(Decoration.none),
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
        this.view?.destroy();
    }
}
