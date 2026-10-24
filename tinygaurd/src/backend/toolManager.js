//Start, stop, and track Python processes.
import { spawn } from "node:child_process";
import path from "node:path";
import { app } from "electron";

const tools = new Map();

function registerTool({
    toolID,
    display_name,
    script,
    runtime = "Python"
}){
    if (tools.has(toolID)) {
        throw new Error(`Tool already registered: ${toolID}`);
    }

    tools.set(toolID, {
        toolID,
        display_name,
        script,
        runtime,
        status: "stopped",
        process: null,
        error: null
    });
}

function getTool(toolID) {
    return tools.get(toolID) ?? null;
}

function getAllTools() {
    return Array.from(tools.values(), ({process, ...tool}) => tool);
}

function startTool(toolID) {
    const tool = getTool(toolID);

    if (!tool) {
        throw new Error(`Unknown tool: ${toolID}`);
    }

    if (tool.process && tool.process.exitCode === null && !tool.process.killed) {
        return false;
    }

    const projectRoot = path.resolve(app.getAppPath());
    const scriptPath = path.resolve(projectRoot, tool.script);

    tool.status = "starting"
    tool.error = null;

    const child = spawn("python", [scriptPath], {
        cwd: path.dirname(scriptPath),
        stdio: ["ignore", "pipe", "pipe"],
        windowsHide: true
    });

    tool.process = child;

    child.once("spawn", () => {
        tool.status = "running";
    });

    child.stdout.on("data", (data) => {
        console.log(`[${tool.toolID}] ${data.toString().trimEnd()}`);
    });

    child.stderr.on("data", (data) => {
        console.error(`[${tool.toolID}] ${data.toString().trimEnd()}`);
    });

    child.once("error", (error) => {
        tool.status = "error";
        tool.error = error.message;
        tool.process = null;
    });

    child.once("exit", (code) => {
        if (tool.process === child) {
            tool.process = null;
            tool.status = code === 0 ? "stopped" : "error";
            tool.error = code === 0 ? null : `python exited with code ${code}`;
        }
    });

    return true;
}

registerTool({
    toolID: "face-hiding",
    display_name: "Face Hiding",
    script: "tools/face_hiding/webcam.py"
});

export {
    registerTool,
    getTool,
    getAllTools,
    startTool
};