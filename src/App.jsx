import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";

function App() {
  const editorRef = useRef(null);

  let binding = null, yarray = null, provider = null;
  
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    
    // Initialize YJS
    const ydoc = new Y.Doc();
  
    // create yArray
    yarray = ydoc.getArray("monaco");
  
    // connect to websocket server
    provider = new WebsocketProvider("ws://localhost:5000", "room1", ydoc);

    provider.on("sync", () => {
      // Bind initial
      if (yarray.length === 0) {
        const newDoc = new Y.Text(),
          doc2 = new Y.Text();
        yarray.push([newDoc]);
        yarray.push([doc2]);
      }

      // Bind YJS to Monaco
      binding = new MonacoBinding(
        yarray.get(0),
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        provider.awareness
      );
    });
  }

  // type.toString() shows proper text, for storage just pass type.toString()
  const handleClick = () => {

    // editor history gets deleted
    binding.destroy();

    binding = new MonacoBinding(
      yarray.get(1),
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
  };

  return (
    <>
      <h1>coco</h1>
      <button onClick={handleClick}>Switch</button>
      <Editor
        height="50vh"
        width="50vw"
        theme="vs-dark"
        onMount={handleEditorDidMount}
      />
    </>
  );
}

export default App;
