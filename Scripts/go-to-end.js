module.exports = async (params) => {
    const editor = params.app.workspace.activeEditor?.editor;
    if (!editor) return;
    const cursor = editor.getCursor();
    const lineLength = editor.getLine(cursor.line).length;
    editor.setCursor({ line: cursor.line, ch: lineLength });
};