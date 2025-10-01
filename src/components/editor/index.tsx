'use client';

import React, { Ref } from 'react';

import '@mdxeditor/editor/style.css';
import './dark-editor.css';
import {
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  diffSourcePlugin,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  MDXEditorMethods,
  quotePlugin,
  Separator,
  tablePlugin,
  toolbarPlugin,
  UndoRedo,
} from '@mdxeditor/editor';
import { basicDark } from 'cm6-theme-basic-dark';
import { useTheme } from 'next-themes';

interface EditorProps {
  editorRef: Ref<MDXEditorMethods> | null;
  value: string;
  fieldChange: (value: string) => void;
}

const Editor = ({ editorRef, value, fieldChange, ...props }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const theme = resolvedTheme === 'dark' ? [basicDark] : [];
  return (
    <MDXEditor
      key={resolvedTheme}
      markdown={value}
      ref={editorRef}
      onChange={fieldChange}
      className="dark-editor markdown-editor w-full border light-border-2 background-light800_dark200"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),
        tablePlugin(),
        imagePlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: '' }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            css: 'css',
            txt: 'txt',
            sql: 'sql',
            html: 'html',
            saas: 'saas',
            scss: 'scss',
            bash: 'bash',
            json: 'json',
            js: 'javascript',
            ts: 'typescript',
            '': 'unspecified',
            tsx: 'TypeScript (React)',
            jsx: 'JavaScript (React)',
          },
          autoLoadLanguageSupport: true,
          codeMirrorExtensions: theme,
        }),
        diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: '' }),
        toolbarPlugin({
          toolbarContents: () => (
            <ConditionalContents
              options={[
                {
                  when: (editor) => editor?.editorType === 'codeblock',
                  contents: () => <ChangeCodeMirrorLanguage />,
                },
                {
                  fallback: () => (
                    <>
                      <UndoRedo />
                      <Separator />

                      <BoldItalicUnderlineToggles />
                      <CodeToggle />
                      <Separator />

                      <ListsToggle />
                      <Separator />

                      <CreateLink />
                      <InsertImage />
                      <Separator />

                      <InsertTable />
                      <InsertThematicBreak />
                      <Separator />

                      <InsertCodeBlock />
                    </>
                  ),
                },
              ]}
            />
          ),
        }),
      ]}
      {...props}
    />
  );
};

export default Editor;
