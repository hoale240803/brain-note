module.exports = async (params) => {
    const { app } = params;
    const editor = app.workspace.activeEditor?.editor;
    if (!editor) return;

    const selectedText = editor.getSelection();
    if (!selectedText) return;

    const from = editor.getCursor("from");
    editor.replaceSelection(`==🟢${selectedText}==`);

    // '==🟢' chiếm đúng 4 đơn vị vị trí con trỏ (2 ký tự '=' + 2 đơn vị Unicode của emoji 🟢)
    editor.setCursor({
        line: from.line,
        ch: from.ch + 4
    });
};