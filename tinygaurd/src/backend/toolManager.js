//Start, stop, and track Python processes.
const tools = new Map();

function registerTool({
    toolID,
    display_name,
    script,
    runtime = "Python"
}){
    if (tools.has(toolID)) {
        throw new Error('Tool already registered: ${toolID}');
    }

    tools.set(toolID, {
        toolID,
        display_name,
        script,
        runtime,
        status: "stopped",
        process: null
    });
}

function getTool(toolID) {
    return tools.get(toolID) ?? null;
}

function getAllTools() {
    return Array.from(tools.values(), ({process, ...tool}) => tool);
}

registerTool({
    toolID: "face-hiding",
    display_name: "Face Hiding",
    script: "tools/face_hiding/webcam.py"
});

module.exports = {
    registerTool,
    getTool,
    getAllTools
};