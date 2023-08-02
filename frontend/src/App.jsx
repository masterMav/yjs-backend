import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

function App() {
  const editorRef = useRef(null);
  const editorRef2 = useRef(null);

  // Initialize YJS
  const ydoc = new Y.Doc();

  // Create yArray
  const yarray = ydoc.getArray("monaco");

  // Connect to websocket server
  const provider = new WebsocketProvider("ws://localhost:5000", "room1", ydoc);

  // Fetch all data from server
  provider.on("sync", () => {
    if (yarray.length === 0) {
      const doc1 = new Y.Text(),
        doc2 = new Y.Text();
      yarray.push([doc1]);
      yarray.push([doc2]);
    }
  });

  // Bind doc1 -> editor1
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    const binding1 = new MonacoBinding(
      yarray.get(0),
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
  }

  // Bind doc2 -> editor2
  function handleEditorDidMount2(editor, monaco) {
    editorRef2.current = editor;

    const binding2 = new MonacoBinding(
      yarray.get(1),
      editorRef2.current.getModel(),
      new Set([editorRef2.current]),
      provider.awareness
    );
  }

  return (
    <>
      <h1>coco</h1>
      <Editor
        height="50vh"
        width="100vw"
        theme="vs-dark"
        onMount={handleEditorDidMount}
      />
      <Editor
        height="50vh"
        width="100vw"
        theme="vs-dark"
        onMount={handleEditorDidMount2}
      />
    </>
  );
}

export default App;
