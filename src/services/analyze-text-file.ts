export async function openTextFile() {
    // open a text file with the file system access api
    const [fileHandle] = await (window as any).showOpenFilePicker();
    const file = await fileHandle.getFile();
    const contents = await file.text();
    console.log("contents", contents);

    return contents;
}

export async function analyzeTextFile(text: string) {
    // analyze the text

    const response = await fetch(`http://localhost:3000/analyze?mood=${text}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    console.log("data", data);

    return data;
}

export async function summarizeTextFile(text: string) {
    // summarize the text
    const response = await fetch(`http://localhost:3000/summarize?mood=${text}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();
    console.log("data", data);

    return data;
}